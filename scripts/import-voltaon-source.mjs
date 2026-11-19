import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourcePath=process.argv[2]||'D:/sabin/note/일단 작성할 포트폴리오.md';
const raw=await fs.readFile(sourcePath),source=raw.toString('utf8').replace(/\r\n/g,'\n');
const final=JSON.parse(await fs.readFile(path.join(root,'content/portfolio.json'),'utf8'));
const selectedCases=[13,12,14,2,28,3,6,27];
const sharedCases=[14,2,28,3,27];
const headings=[...source.matchAll(/^## Troubleshooting (\d+)\.\s*(.+)$/gm)];
const cases=selectedCases.map(number=>{
  if(sharedCases.includes(number)){
    const page=final.gyeol.find(page=>page.sourceCase===number);assert(page,`Final Gyeolsoft case missing: ${number}`);
    return structuredClone(page);
  }
  const index=headings.findIndex(heading=>Number(heading[1])===number);assert(index>=0,`Missing manuscript case: ${number}`);
  const heading=headings[index];
  const markdown=source.slice(heading.index+heading[0].length,headings[index+1]?.index??source.length).split(/^# 여기부터는/m)[0].replace(/(?:\n---\s*)+$/,'').trim();
  assert(markdown.length>100&&!/```/.test(markdown));assert(source.includes(markdown));
  const publishedMarkdown=number===6
    ? markdown.replace('원본 미변경·상위 Worker 재사용 조건에서 ', '같은 PDF를 다시 읽을 때 ')
    : markdown;
  return{id:`case-${number}`,kind:'case',sourceCase:number,title:heading[2].trim(),markdown:publishedMarkdown};
});
const data={schemaVersion:1,source:{path:sourcePath,sha256:createHash('sha256').update(raw).digest('hex')},selectedCases,images:structuredClone(final.images),common:structuredClone(final.common),voltaon:[...structuredClone(final.common),...cases]};
for(const number of sharedCases)assert.deepEqual(cases.find(page=>page.sourceCase===number),final.gyeol.find(page=>page.sourceCase===number));
assert(!cases.some(page=>[7,15].includes(page.sourceCase)));
await fs.writeFile(path.join(root,'content/voltaon.json'),JSON.stringify(data,null,2)+'\n');
console.log({selectedCases,sharedCases,newCases:[13,12,6],sourceSha256:data.source.sha256,excluded:[7,15]});
