const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{const [id,dir]=process.argv.slice(2);fs.mkdirSync(dir,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://localhost:8790/video/comp.html');const bd=JSON.parse(fs.readFileSync('boards/'+id+'.json'));
 await p.evaluate(x=>window.load(x),bd);let t=0;
 for(let i=0;i<bd.scenes.length;i++){const s=bd.scenes[i];const tt=t+s.dur*0.8;await p.evaluate(x=>window.renderAt(x),tt);await p.screenshot({path:dir+'/'+id+'_'+String(i).padStart(2,'0')+'_'+s.kind+'.jpg',type:'jpeg',quality:70});t+=s.dur;}
 console.log('errs',errs.slice(0,5));await b.close();})();
