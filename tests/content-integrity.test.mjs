import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const data = name => JSON.parse(readFileSync(new URL(`../src/data/${name}.json`,import.meta.url),'utf8'));
const publicPath = path => new URL(`../public${path}`,import.meta.url);
test('credential catalogue has unique records and real local previews',()=>{
 const certs=data('certifications');
 assert.equal(new Set(certs.map(c=>c.id)).size,certs.length);
 assert.equal(new Set(certs.map(c=>c.title)).size,certs.length);
 for(const c of certs){
  assert.ok(existsSync(publicPath(c.image)),`${c.title}: missing preview`);
  assert.ok(['Course completion','Recognition','Participation','Assessment','Registration'].includes(c.kind));
  assert.notEqual(c.verificationUrl,'#');
 }
});
test('public profile reflects confirmed career transitions',()=>{
 const experience=data('experience');
 assert.equal(experience.find(e=>e.company==='Scalius Labs').period,'September 2026 – Present');
 assert.equal(experience.find(e=>e.title==='Former President').period,'February 2025 – June 2026');
 assert.equal(experience.find(e=>e.title==='Alumni Affairs Advisor').period,'June 2026 – Present');
 assert.equal(experience.find(e=>e.company==='Aachol Foundation').period,'July 2025 – June 2026');
 assert.match(data('hero').summary,/2024; CGPA 3.60\/4.00/);
});
test('project links have no placeholders or known mismatched repository',()=>{
 for(const p of data('projects')){
  assert.notEqual(p.github_url,'#'); assert.notEqual(p.demo_url,'#');
  assert.ok(!p.github_url?.includes('plant-disease-detection-project'));
  if(p.image_url)assert.ok(existsSync(publicPath(p.image_url)),`${p.title}: missing preview`);
 }
});
test('private legacy previews stay outside public assets',()=>{
 assert.ok(!existsSync(publicPath('/certs/ict_olympiad_participant.png')));
 assert.ok(!existsSync(publicPath('/certs/cisco_basic_networking.png')));
});
test('professional certification is distinguished from preparatory courses',()=>{
 const certs=data('certifications');
 assert.match(certs.find(c=>c.id===13).description,/not the PMI CAPM/);
 assert.match(certs.find(c=>c.id===35).description,/not a Cisco CCNA/);
 assert.equal(certs.find(c=>c.id===8).date,'2025-09-21');
 assert.equal(certs.find(c=>c.id===17).kind,'Registration');
});
