import asyncio,sys
from playwright.async_api import async_playwright
MOCK="""window.API={_d:{'cmi.core.student_name':'Dupont, Julie','cmi.core.lesson_status':'not attempted'},LMSInitialize:()=>'true',LMSFinish:()=>'true',LMSGetValue:function(k){return this._d[k]||''},LMSSetValue:function(k,v){this._d[k]=String(v);return 'true'},LMSCommit:()=>'true',LMSGetLastError:()=>'0',LMSGetErrorString:()=>'',LMSGetDiagnostic:()=>''};"""
async def main(path):
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script(MOCK); await pg.goto('file://'+path); await pg.wait_for_timeout(300)
        ids=await pg.evaluate("COURSE.modules.filter(m=>COURSE.scope.modules.includes(m.id)).flatMap(m=>m.capsules.map(c=>c.id))")
        mods=await pg.evaluate("COURSE.scope.modules")
        for cid in ids:
            await pg.evaluate(f"__eco.go(['learn','c:{cid}:0'])"); await pg.click('#watched')
            await pg.evaluate(f"__eco.go(['learn','c:{cid}:1'])")
            n=len(await pg.query_selector_all('.q'))
            for i in range(n):
                q=(await pg.query_selector_all('.q'))[i]
                await (await q.query_selector('.opt')).click(); await (await q.query_selector('.val')).click()
            await pg.evaluate(f"__eco.go(['learn','c:{cid}:2'])"); await pg.click('#gotR')
            await pg.evaluate(f"__eco.go(['learn','c:{cid}:3'])"); await pg.click('#didP')
            await pg.evaluate(f"__eco.go(['learn','c:{cid}:4'])"); await pg.fill('#depT','Mon livrable'); await pg.click('#depB')
        for m in mods:
            await pg.evaluate(f"__eco.go(['learn','case:{m}'])"); await pg.fill('#depT','Cas'); await pg.click('#depB')
        for t in ('pos','fin'):
            await pg.evaluate(f"__eco.go(['learn','{t}'])")
            for q in await pg.query_selector_all('.q'):
                await (await q.query_selector('.opt')).click(); await (await q.query_selector('.val')).click()
        if await pg.evaluate("COURSE.scope.end"):
            await pg.evaluate("__eco.go(['learn','end'])"); await pg.fill('#depT','Dossier'); await pg.click('#depB')
        d=await pg.evaluate("API._d")
        print('interactions', sum(1 for k in d if k.endswith('.result')))
        print('status',d.get('cmi.core.lesson_status'),'score',d.get('cmi.core.score.raw'),'suspend',len(d.get('cmi.core.suspend_data',d.get('cmi.suspend_data',''))),'loc',d.get('cmi.core.lesson_location'),'errors',errs)
        await b.close()
asyncio.run(main(sys.argv[1]))
