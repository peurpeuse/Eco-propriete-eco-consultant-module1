import asyncio, sys
from playwright.async_api import async_playwright
OUT='/home/claude/eco_v3/qa/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,vp in (('desk',{'width':1440,'height':900}),('mob',{'width':390,'height':844})):
            pg=await b.new_page(viewport=vp); errs=[]; hs=[]
            pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
            await pg.goto('file:///home/claude/eco_v3/build/site/index.html'); await pg.wait_for_timeout(500)
            routes=[('home',"['home']"),('welcome',"['learn','welcome']"),('v27',"['learn','c:2.7:0']"),('q27',"['learn','c:2.7:1']"),('r27',"['learn','c:2.7:2']"),('p29',"['learn','c:2.9:3']"),('d27',"['learn','c:2.7:4']"),('case3',"['learn','case:3']"),('rem4',"['learn','rem:4']"),('pos',"['learn','pos']"),('end',"['learn','end']"),('sat',"['learn','sat']"),('att',"['learn','att']"),('dossier',"['learn','dossier']")]
            for n,r in routes:
                await pg.evaluate(f"__eco.go({r})"); await pg.wait_for_timeout(150)
                if n=='q27':
                    for i in range(5):
                        qs=await pg.query_selector_all('.q')
                        if i>=len(qs): break
                        q=qs[i]; o=await q.query_selector('.opt:not([disabled])')
                        if not o: continue
                        await o.click(); await (await q.query_selector('.val')).click(); await pg.wait_for_timeout(50)
                if n=='p29':
                    await pg.click('#didP'); await pg.click('#corr')
                if await pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"): hs.append(n)
                await pg.screenshot(path=f'{OUT}{name}_{n}.png', full_page=(n=='home'))
            if name=='mob':
                await pg.evaluate("__eco.go(['learn','c:1.1:0'])"); await pg.click('#navBtn'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}mob_navopen.png')
            print(name,'errors',errs,'hscroll',hs)
        await b.close()
asyncio.run(main())
