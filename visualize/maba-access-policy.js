export const ROLES = Object.freeze({
  SYSTEM_ADMIN: 'system_admin', CENTRAL_OPERATOR: 'central_operator', MUNICIPALITY_MANAGER: 'municipality_manager',
  ISSUANCE_OFFICER: 'issuance_officer', MERCHANT: 'merchant', TRANSPORT_OPERATOR: 'transport_operator',
  GATE_OFFICER: 'gate_officer', AUDITOR: 'auditor'
});

export function authorize(actor, action, resource) {
  if (!actor?.role || !resource?.type) return deny('MISSING_CONTEXT');
  if (actor.role === ROLES.SYSTEM_ADMIN) return allow('SYSTEM_ADMIN');
  if (actor.role === ROLES.AUDITOR) return action === 'read' ? allow('READ_ONLY') : deny('AUDITOR_READ_ONLY');
  if (actor.role === ROLES.CENTRAL_OPERATOR) {
    return ['device','blocklist','report','card'].includes(resource.type) && ['read','sync','revoke'].includes(action)
      ? allow('CENTRAL_OPERATIONS') : deny('CENTRAL_SCOPE_RESTRICTED');
  }
  if (actor.role === ROLES.MUNICIPALITY_MANAGER) {
    if (!sameMunicipality(actor, resource)) return deny('MUNICIPALITY_ISOLATION');
    return ['merchant','offer','site','route','fare','local_card','report'].includes(resource.type) && ['read','create','update','issue','manage'].includes(action)
      ? allow('MUNICIPALITY_SCOPE') : deny('MUNICIPALITY_RESOURCE_RESTRICTED');
  }
  if (actor.role === ROLES.ISSUANCE_OFFICER) {
    if (!sameMunicipality(actor, resource)) return deny('MUNICIPALITY_ISOLATION');
    return ['card','local_card'].includes(resource.type) && ['read','issue','revoke'].includes(action)
      ? allow('ISSUANCE_SCOPE') : deny('ISSUANCE_SCOPE_RESTRICTED');
  }
  if (actor.role === ROLES.MERCHANT) {
    if (resource.type === 'merchant_transaction' && actor.merchantId === resource.merchantId && ['read','create'].includes(action)) return allow('MERCHANT_OWN_DATA');
    if (resource.type === 'offer' && actor.merchantId === resource.merchantId && action === 'read') return allow('MERCHANT_OWN_OFFERS');
    return deny('MERCHANT_SCOPE_RESTRICTED');
  }
  if (actor.role === ROLES.TRANSPORT_OPERATOR) {
    return ['route','vehicle','device','transport_report'].includes(resource.type) && actor.operatorId === resource.operatorId && ['read','update','sync'].includes(action)
      ? allow('TRANSPORT_OWN_DATA') : deny('TRANSPORT_SCOPE_RESTRICTED');
  }
  if (actor.role === ROLES.GATE_OFFICER) {
    return resource.type === 'access_point' && actor.accessPointId === resource.accessPointId && action === 'read'
      ? allow('GATE_VERIFY_ONLY') : deny('GATE_VERIFY_ONLY');
  }
  return deny('UNKNOWN_ROLE');
}

export function filterVisibleResources(actor, resources, action = 'read') {
  return resources.filter((resource) => authorize(actor, action, resource).allowed);
}

export function policyMatrix() {
  return [
    ['system_admin', 'كل المنصة', 'read/create/update/manage'], ['central_operator', 'الأجهزة والحظر والبطاقات والتقارير', 'read/sync/revoke'],
    ['municipality_manager', 'موارد بلديته', 'read/create/update/issue/manage'], ['issuance_officer', 'بطاقات بلديته', 'read/issue/revoke'],
    ['merchant', 'معاملاته وعروضه', 'read/create'], ['transport_operator', 'مساراته ومركباته وأجهزته', 'read/update/sync'],
    ['gate_officer', 'نقطة الوصول المحددة', 'read'], ['auditor', 'السجلات والتقارير', 'read only']
  ];
}
function sameMunicipality(actor, resource) { return Boolean(actor.municipalityId && resource.municipalityId && actor.municipalityId === resource.municipalityId); }
function allow(reason) { return { allowed: true, reason }; }
function deny(reason) { return { allowed: false, reason }; }
