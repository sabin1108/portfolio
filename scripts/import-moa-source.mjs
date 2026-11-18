import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = process.argv[2] || 'D:/sabin/note/일단 작성할 포트폴리오.md';
const raw = await fs.readFile(sourcePath);
const source = raw.toString('utf8').replace(/\r\n/g, '\n');
const boundary = source.indexOf('# 모아 트러블슈팅');
assert(boundary > 0, 'Missing troubleshooting boundary');
const commonSource = source.slice(0, boundary).replace(/(?:\n---\s*)+$/, '').trim();
const kinds = ['intro','overview','role','decisions','implementation'];
const common = commonSource.split(/^---\s*$/m).map(s=>s.trim()).filter(Boolean).map((markdown,index)=>({
  id:`common-${index+1}`, kind:kinds[index], title:index===0?'사용자 맞춤 폴더 관리 챗봇':index===1?'프로젝트 소개':markdown.match(/^#\s+(.+)$/m)?.[1] || '모아', markdown
}));
assert.equal(common.length,5);
const headings = [...source.matchAll(/^## Troubleshooting (\d+)\.\s*(.+)$/gm)];
const selectedCases = [2,14,28,3,5,27];
const cases = selectedCases.map(number=>{
  const index=headings.findIndex(h=>Number(h[1])===number);
  assert(index>=0,`Missing selected case ${number}`);
  const match=headings[index];
  let body=source.slice(match.index+match[0].length,headings[index+1]?.index ?? source.length);
  body=body.split(/^# 여기부터는/m)[0].replace(/^```.*$/gm,'').replace(/(?:\n---\s*)+$/,'').trim();
  assert(body.length>100);
  return {id:`case-${number}`,kind:'case',sourceCase:number,title:match[2].trim(),markdown:body};
});
assert(!cases.some(p=>p.sourceCase===10));
const images={
  'Pasted image 20261117213019.png':'/media/moa-architecture.png',
  'Pasted image 20261118163934.png':'/media/moa-folder-tree.png'
};
await fs.mkdir(path.join(root,'content'),{recursive:true});
await fs.mkdir(path.join(root,'public/media'),{recursive:true});
for(const [name,target] of Object.entries(images))await fs.copyFile(path.join(path.dirname(sourcePath),name),path.join(root,'public',target));
const data={schemaVersion:1,source:{path:sourcePath,sha256:crypto.createHash('sha256').update(raw).digest('hex')},selectedCases,images,common,gyeol:[...common,...cases]};
for(const page of [...common,...cases]) {
  assert(source.includes(page.markdown),`Source text changed: ${page.id}`);
  assert(!/여기부터는|```/.test(page.markdown),`Editorial marker: ${page.id}`);
}
assert.deepEqual(data.gyeol.slice(5).map(p=>p.sourceCase),selectedCases);
await fs.writeFile(path.join(root,'content/manuscript.md'),raw);
await fs.writeFile(path.join(root,'content/portfolio.json'),JSON.stringify(data,null,2));
await fs.writeFile(path.join(root,'content/import-report.json'),JSON.stringify({source:data.source,commonPages:common.length,selectedCases,excludedCase10:'Removed intentionally by user',verbatimChecks:common.length+cases.length,imageSources:Object.keys(images).map(name=>path.join(path.dirname(sourcePath),name)),editorialMarkersRemoved:true},null,2));
console.log(JSON.stringify({common:common.length,cases:cases.map(p=>p.sourceCase),verbatimChecks:common.length+cases.length}));
