import {readFile, access, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out=path.join(root,'docs');
let checks=0;
for (const file of ['index.html','zh/index.html']) {
  const filePath=path.join(out,file);
  const html=await readFile(filePath,'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length) throw new Error(`${file}: duplicate IDs`);
  if([...html.matchAll(/<h1\b/g)].length!==1) throw new Error(`${file}: expected one H1`);
  for(const [,ref] of html.matchAll(/(?:href|src|poster|data-video)="([^"]+)"/g)) {
    if(/^(https?:|data:)/.test(ref))continue;
    if(ref.startsWith('#')) {
      if(ref.length>1&&!ids.includes(ref.slice(1)))throw new Error(`${file}: missing anchor ${ref}`);
    } else {
      const target=path.resolve(path.dirname(filePath),ref);
      if(!target.startsWith(out+path.sep)&&target!==out)throw new Error(`Asset escapes publication directory: ${ref}`);
      await access(target);
      if((await stat(target)).isDirectory())await access(path.join(target,'index.html'));
    }
    checks++;
  }
  for(const [,id] of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) {
    for(const part of id.split(' '))if(!ids.includes(part))throw new Error(`${file}: missing ARIA target ${part}`);
    checks++;
  }
  const json=html.match(/<script id="page-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
  JSON.parse(json);
  if(/undefined|localhost|127\.0\.0\.1/.test(html))throw new Error(`${file}: local-only or undefined content`);
}
for(const lang of ['en','zh']) {
  const vtt=await readFile(path.join(out,`assets/intro.${lang}.vtt`),'utf8');
  if(!vtt.startsWith('WEBVTT')||[...vtt.matchAll(/-->/g)].length!==3)throw new Error(`Invalid ${lang} captions`);
}
await access(path.join(out,'.nojekyll'));
console.log(`Passed ${checks} local resource, anchor and accessibility-reference checks across English and Chinese pages.`);
