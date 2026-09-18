import assert from 'node:assert/strict';
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync(new URL('./data/maba-bridge.json', import.meta.url), 'utf8'));
const html = fs.readFileSync(new URL('./maba-bridge.html', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('./maba-bridge.js', import.meta.url), 'utf8');

assert.equal(data.meta.status, 'working-draft');
assert.equal(data.domain_entities.length, 5);
assert.equal(data.pilot_gates.length, 6);
assert.ok(data.integration_guardrails.includes('لا رصيد مالي حقيقي'));
for (const id of ['domainGrid', 'guardrailNote', 'gateList']) assert.ok(html.includes(`id="${id}"`));
for (const id of ['domainGrid', 'guardrailNote', 'gateList']) assert.ok(js.includes(`#${id}`));
assert.ok(!JSON.stringify(data).match(/(password|secret|api[_-]?key|token)/i));
console.log('maba bridge static checks: ok');
