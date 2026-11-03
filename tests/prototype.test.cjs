'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Expected inline application script');
assert.ok(script.includes('draw();\n})();'),'App bootstrap signature changed');
script=script.replace('draw();\n})();','window.__test={state,Q,WORKS,organizationPortrait,collectiveMeaning,scopeInsight,result,graph,reaction};draw();\n})();');

const element=()=>({innerHTML:'',textContent:'',addEventListener(){},setAttribute(){}});
const app=element(),sound=element(),restart=element();
const document={
  getElementById(id){return ({app,sound,restart})[id]||element()},
  querySelectorAll(){return []}
};
const window={matchMedia(){return {matches:true}},scrollTo(){}};
new Function('document','window',script)(document,window);
const t=window.__test;
assert.equal(t.Q.length,8,'New collective-continuity question is required');
assert.equal(t.Q[3].key,'groupPractice');
assert.equal(t.organizationPortrait('alone','none').label,'个人探索');
assert.match(t.organizationPortrait('organised','none').desc,/存在张力/);
assert.notEqual(t.collectiveMeaning(t.WORKS[5],'alone'),t.collectiveMeaning(t.WORKS[5],'organised'));

const many={skills:['a','b','c','d','e'],interests:['1','2','3','4','5'],obstacle:'busy'};
assert.match(t.scopeInsight(many).title,/分得太散/);
assert.match(t.scopeInsight({...many,obstacle:'retention'}).title,/没有留下/);
assert.equal(t.scopeInsight({...many,obstacle:'direction'}),null);
assert.equal(t.scopeInsight({...many,interests:['1']}),null);
Object.assign(t.state.answers,{environment:'mixed',pressure:'unknown',group:'alone',groupPractice:'none',time:'low',...many});
t.state.resultChoices=[t.WORKS[5],t.WORKS[1],t.WORKS[3]];
assert.match(t.result(),/与主体发展有什么关系/);
assert.match(t.result(),/你是否把精力分得太散/);
assert.match(t.graph(),/data-node="subject"/);
assert.match(t.graph(),/data-orgwhatif="organised"/);
t.state.orgWhatif='stable';
assert.match(t.graph(),/稳定小团体/);
assert.match(t.reaction(t.Q[t.Q.length-1],'busy'),/让一个人承担几个人的工作/);

console.log('PASS: 15 organization, overload-reflection and rendering checks');
