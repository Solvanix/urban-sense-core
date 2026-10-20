import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname, 'data/entities');
const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, {withFileTypes:true})) { const p=path.join(dir,entry.name); if(entry.isDirectory()) walk(p); else if(entry.name.endsWith('.json') && entry.name !== 'graph-index.json') files.push(p); } }
walk(root);
const records=[]; const ids=new Set(); let errors=[];
for (const file of files) {
  const raw=fs.readFileSync(file,'utf8');
  for (const chunk of raw.trim().split(/\n(?=\{)/)) {
    try { const item=JSON.parse(chunk); records.push(item); if(!item.id||!item.entityType||!item.status) errors.push(`${file}: missing common fields`); if(ids.has(item.id)) errors.push(`${file}: duplicate id ${item.id}`); ids.add(item.id); } catch(e) { errors.push(`${file}: invalid JSON line record (${e.message})`); }
  }
}
const refs=[]; for(const item of records) for(const [key,value] of Object.entries(item)) if(/(Ids|Id)$/.test(key)) (Array.isArray(value)?value:[value]).filter(Boolean).forEach(v=>refs.push([item.id,key,v]));
for(const [id,key,ref] of refs) if(!ids.has(ref) && !['municipality-al-eizariya'].includes(ref)) errors.push(`${id}.${key}: unresolved reference ${ref}`);
if(errors.length){ console.error(errors.join('\n')); process.exit(1); }
console.log(`SENSE data validation: ok (${records.length} records, ${ids.size} ids)`);
