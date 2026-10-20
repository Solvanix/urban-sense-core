import assert from 'node:assert/strict';
import { ROLES, authorize, filterVisibleResources } from './maba-access-policy.js';

const publishedStory = { type: 'story', status: 'published', visibility: 'public', municipalityId: 'municipality-al-eizariya' };
const draftStory = { type: 'story', status: 'draft', visibility: 'private', municipalityId: 'municipality-al-eizariya' };
const localProduct = { type: 'product', merchantId: 'merchant-local-crafts-demo', municipalityId: 'municipality-al-eizariya', status: 'prototype' };
const otherProduct = { type: 'product', merchantId: 'merchant-other', municipalityId: 'municipality-bethlehem', status: 'prototype' };

assert.equal(authorize({ role: ROLES.PUBLIC_VISITOR }, 'read', publishedStory).reason, 'PUBLIC_PUBLISHED_CONTENT');
assert.equal(authorize({ role: ROLES.PUBLIC_VISITOR }, 'read', draftStory).reason, 'PUBLIC_CONTENT_ONLY');
assert.equal(authorize({ role: ROLES.MUNICIPALITY_MANAGER, municipalityId: 'municipality-al-eizariya' }, 'update', localProduct).allowed, true);
assert.equal(authorize({ role: ROLES.MUNICIPALITY_MANAGER, municipalityId: 'municipality-al-eizariya' }, 'update', otherProduct).reason, 'MUNICIPALITY_ISOLATION');
assert.equal(authorize({ role: ROLES.MERCHANT, merchantId: 'merchant-local-crafts-demo' }, 'update', localProduct).reason, 'MERCHANT_OWN_DATA');
assert.equal(authorize({ role: ROLES.MERCHANT, merchantId: 'merchant-local-crafts-demo' }, 'update', otherProduct).reason, 'MERCHANT_SCOPE_RESTRICTED');
assert.deepEqual(filterVisibleResources({ role: ROLES.PUBLIC_VISITOR }, [publishedStory, draftStory]), [publishedStory]);
console.log('maba entity access checks: ok');
