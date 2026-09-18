const DEMO_PREFIX = 'SENSE-MABA-DEMO';
const clone = (value) => JSON.parse(JSON.stringify(value));

export function createPilotStore(seed = {}) {
  return {
    cards: clone(seed.cards ?? {}),
    revokedCards: new Set(seed.revokedCards ?? []),
    queuedEvents: clone(seed.queuedEvents ?? []),
    acceptedEventIds: new Set(seed.acceptedEventIds ?? []),
    audit: clone(seed.audit ?? []),
    municipalities: clone(seed.municipalities ?? {
      'municipality-a': { id: 'municipality-a', name: 'بلدية تجريبية أ', routes: ['route-a'], roles: ['operator', 'auditor'] },
      'municipality-b': { id: 'municipality-b', name: 'بلدية تجريبية ب', routes: ['route-b'], roles: ['operator'] }
    })
  };
}

export function createMunicipalContext({ municipalityId = 'municipality-a', role = 'operator' } = {}) {
  return { municipalityId, role, dataStatus: 'prototype' };
}

export function authorizeMunicipalAction(store, context, { municipalityId, role, action = 'read' } = {}) {
  if (!context?.municipalityId || !context?.role) return { allowed: false, reason: 'CONTEXT_REQUIRED' };
  if (municipalityId && context.municipalityId !== municipalityId) return { allowed: false, reason: 'MUNICIPALITY_SCOPE_DENIED' };
  const municipality = store.municipalities[context.municipalityId];
  if (!municipality) return { allowed: false, reason: 'MUNICIPALITY_UNKNOWN' };
  if (role && context.role !== role) return { allowed: false, reason: 'ROLE_DENIED' };
  if (!municipality.roles.includes(context.role)) return { allowed: false, reason: 'ROLE_NOT_ASSIGNED' };
  if (action === 'revoke' && context.role !== 'operator') return { allowed: false, reason: 'ACTION_NOT_ALLOWED' };
  return { allowed: true, reason: 'OK', municipalityId: municipality.id, role: context.role };
}

export function assertMunicipalAccess(store, context, municipalityId, action = 'read') {
  const result = authorizeMunicipalAction(store, context, { municipalityId, action });
  if (!result.allowed) throw new Error(result.reason);
  return result;
}

export function issueDemoCard(store, { cardId = `card-${Date.now()}`, category = 'STD', validHours = 24, municipalityId = null } = {}) {
  if (store.cards[cardId]) throw new Error('CARD_EXISTS');
  const now = Date.now();
  store.cards[cardId] = { id: cardId, category, municipalityId, state: 'active', validFrom: new Date(now).toISOString(), validTo: new Date(now + validHours * 60 * 60 * 1000).toISOString(), counter: 0, dataStatus: 'prototype' };
  recordAudit(store, 'card.issued', { cardId, category, municipalityId });
  return clone(store.cards[cardId]);
}

export function issueMunicipalDemoCard(store, context, { municipalityId = context?.municipalityId, ...options } = {}) {
  assertMunicipalAccess(store, context, municipalityId, 'write');
  return issueDemoCard(store, { ...options, municipalityId });
}

export function revokeDemoCard(store, cardId, reason = 'reported-lost') {
  const card = getCard(store, cardId); card.state = 'revoked'; store.revokedCards.add(cardId); recordAudit(store, 'card.revoked', { cardId, reason }); return clone(card);
}

export function revokeMunicipalDemoCard(store, context, cardId, reason = 'reported-lost') {
  const card = getCard(store, cardId); assertMunicipalAccess(store, context, card.municipalityId, 'revoke'); return revokeDemoCard(store, cardId, reason);
}

export function createDemoQrPayload(store, cardId, now = Date.now()) {
  const card = getCard(store, cardId);
  if (card.state !== 'active' || store.revokedCards.has(cardId)) throw new Error('CARD_NOT_ACTIVE');
  card.counter += 1; const expiresAt = new Date(now + 5 * 60 * 1000).toISOString(); const signature = `${DEMO_PREFIX}:v1:${cardId}:${card.counter}:${expiresAt}`;
  const payload = { kind: DEMO_PREFIX, cardId, municipalityId: card.municipalityId, counter: card.counter, expiresAt, signature }; recordAudit(store, 'qr.created', { cardId, counter: card.counter }); return payload;
}

export function validateDemoQrPayload(store, payload, now = Date.now()) {
  if (!payload || payload.kind !== DEMO_PREFIX) return { valid: false, reason: 'INVALID_KIND' };
  const card = store.cards[payload.cardId];
  if (!card || card.state !== 'active' || store.revokedCards.has(payload.cardId)) return { valid: false, reason: 'CARD_REVOKED_OR_UNKNOWN' };
  if (payload.municipalityId !== card.municipalityId) return { valid: false, reason: 'MUNICIPALITY_SCOPE_DENIED' };
  if (Date.parse(payload.expiresAt) <= now) return { valid: false, reason: 'QR_EXPIRED' };
  const expected = `${DEMO_PREFIX}:v1:${payload.cardId}:${payload.counter}:${payload.expiresAt}`;
  if (payload.signature !== expected) return { valid: false, reason: 'SIGNATURE_MISMATCH' };
  if (payload.counter !== card.counter) return { valid: false, reason: 'COUNTER_NOT_CURRENT' };
  return { valid: true, card: clone(card), reason: 'OK' };
}

export function queuePilotEvent(store, event) {
  if (!event?.eventId) throw new Error('EVENT_ID_REQUIRED');
  if (store.acceptedEventIds.has(event.eventId) || store.queuedEvents.some((item) => item.eventId === event.eventId)) return { queued: false, duplicate: true };
  store.queuedEvents.push({ ...clone(event), queuedAt: new Date().toISOString(), syncState: 'queued' }); recordAudit(store, 'event.queued', { eventId: event.eventId, type: event.type, municipalityId: event.municipalityId }); return { queued: true, duplicate: false };
}

export function queueMunicipalPilotEvent(store, context, event) {
  assertMunicipalAccess(store, context, event?.municipalityId, 'write');
  const card = getCard(store, event.cardId);
  if (card.municipalityId !== context.municipalityId) throw new Error('MUNICIPALITY_SCOPE_DENIED');
  return queuePilotEvent(store, { ...event, actorRole: context.role });
}

export function syncPilotEvents(store, accept = () => true) {
  const pending = [...store.queuedEvents]; const synced = []; const rejected = []; store.queuedEvents = [];
  for (const event of pending) { if (store.acceptedEventIds.has(event.eventId)) continue; if (accept(event)) { store.acceptedEventIds.add(event.eventId); synced.push(event.eventId); recordAudit(store, 'event.synced', { eventId: event.eventId, municipalityId: event.municipalityId }); } else { event.syncState = 'rejected'; store.queuedEvents.push(event); rejected.push(event.eventId); } }
  return { synced, rejected, remaining: store.queuedEvents.length };
}

export function serialisePilotStore(store) { return JSON.stringify({ cards: store.cards, revokedCards: [...store.revokedCards], queuedEvents: store.queuedEvents, acceptedEventIds: [...store.acceptedEventIds], audit: store.audit, municipalities: store.municipalities }); }
export function restorePilotStore(value) { return createPilotStore(JSON.parse(value)); }
function getCard(store, cardId) { const card = store.cards[cardId]; if (!card) throw new Error('CARD_NOT_FOUND'); return card; }
function recordAudit(store, type, detail) { store.audit.push({ id: `audit-${store.audit.length + 1}`, type, detail, at: new Date().toISOString(), dataStatus: 'prototype' }); }
