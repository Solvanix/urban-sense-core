const DEMO_PREFIX = 'SENSE-MABA-DEMO';

const clone = (value) => JSON.parse(JSON.stringify(value));

export function createPilotStore(seed = {}) {
  return {
    cards: clone(seed.cards ?? {}),
    revokedCards: new Set(seed.revokedCards ?? []),
    queuedEvents: clone(seed.queuedEvents ?? []),
    acceptedEventIds: new Set(seed.acceptedEventIds ?? []),
    audit: clone(seed.audit ?? [])
  };
}

export function issueDemoCard(store, { cardId = `card-${Date.now()}`, category = 'STD', validHours = 24 } = {}) {
  if (store.cards[cardId]) throw new Error('CARD_EXISTS');
  const now = Date.now();
  store.cards[cardId] = {
    id: cardId,
    category,
    state: 'active',
    validFrom: new Date(now).toISOString(),
    validTo: new Date(now + validHours * 60 * 60 * 1000).toISOString(),
    counter: 0,
    dataStatus: 'prototype'
  };
  recordAudit(store, 'card.issued', { cardId, category });
  return clone(store.cards[cardId]);
}

export function revokeDemoCard(store, cardId, reason = 'reported-lost') {
  const card = getCard(store, cardId);
  card.state = 'revoked';
  store.revokedCards.add(cardId);
  recordAudit(store, 'card.revoked', { cardId, reason });
  return clone(card);
}

export function createDemoQrPayload(store, cardId, now = Date.now()) {
  const card = getCard(store, cardId);
  if (card.state !== 'active' || store.revokedCards.has(cardId)) throw new Error('CARD_NOT_ACTIVE');
  card.counter += 1;
  const expiresAt = new Date(now + 5 * 60 * 1000).toISOString();
  const signature = `${DEMO_PREFIX}:v1:${cardId}:${card.counter}:${expiresAt}`;
  const payload = { kind: DEMO_PREFIX, cardId, counter: card.counter, expiresAt, signature };
  recordAudit(store, 'qr.created', { cardId, counter: card.counter });
  return payload;
}

export function validateDemoQrPayload(store, payload, now = Date.now()) {
  if (!payload || payload.kind !== DEMO_PREFIX) return { valid: false, reason: 'INVALID_KIND' };
  const card = store.cards[payload.cardId];
  if (!card || card.state !== 'active' || store.revokedCards.has(payload.cardId)) return { valid: false, reason: 'CARD_REVOKED_OR_UNKNOWN' };
  if (Date.parse(payload.expiresAt) <= now) return { valid: false, reason: 'QR_EXPIRED' };
  const expected = `${DEMO_PREFIX}:v1:${payload.cardId}:${payload.counter}:${payload.expiresAt}`;
  if (payload.signature !== expected) return { valid: false, reason: 'SIGNATURE_MISMATCH' };
  if (payload.counter !== card.counter) return { valid: false, reason: 'COUNTER_NOT_CURRENT' };
  return { valid: true, card: clone(card), reason: 'OK' };
}

export function queuePilotEvent(store, event) {
  if (!event?.eventId) throw new Error('EVENT_ID_REQUIRED');
  if (store.acceptedEventIds.has(event.eventId) || store.queuedEvents.some((item) => item.eventId === event.eventId)) {
    return { queued: false, duplicate: true };
  }
  store.queuedEvents.push({ ...clone(event), queuedAt: new Date().toISOString(), syncState: 'queued' });
  recordAudit(store, 'event.queued', { eventId: event.eventId, type: event.type });
  return { queued: true, duplicate: false };
}

export function syncPilotEvents(store, accept = () => true) {
  const pending = [...store.queuedEvents];
  const synced = [];
  const rejected = [];
  store.queuedEvents = [];
  for (const event of pending) {
    if (store.acceptedEventIds.has(event.eventId)) continue;
    if (accept(event)) {
      store.acceptedEventIds.add(event.eventId);
      synced.push(event.eventId);
      recordAudit(store, 'event.synced', { eventId: event.eventId });
    } else {
      event.syncState = 'rejected';
      store.queuedEvents.push(event);
      rejected.push(event.eventId);
    }
  }
  return { synced, rejected, remaining: store.queuedEvents.length };
}

export function serialisePilotStore(store) {
  return JSON.stringify({
    cards: store.cards,
    revokedCards: [...store.revokedCards],
    queuedEvents: store.queuedEvents,
    acceptedEventIds: [...store.acceptedEventIds],
    audit: store.audit
  });
}

export function restorePilotStore(value) {
  return createPilotStore(JSON.parse(value));
}

function getCard(store, cardId) {
  const card = store.cards[cardId];
  if (!card) throw new Error('CARD_NOT_FOUND');
  return card;
}

function recordAudit(store, type, detail) {
  store.audit.push({ id: `audit-${store.audit.length + 1}`, type, detail, at: new Date().toISOString(), dataStatus: 'prototype' });
}
