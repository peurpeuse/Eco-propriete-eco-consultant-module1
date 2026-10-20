import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        await pg.goto('file:///home/claude/eco_v3/build/site/index.html'); await pg.wait_for_timeout(300)
        for r in ["['home']","['module',2]","['cap','2.7',0]","['cap','2.9',3]","['case',3]","['dossier']","['att']","['test','pos']"]:
            await pg.evaluate(f"__eco.go({r})"); await pg.wait_for_timeout(100)
            w=await pg.evaluate("""(()=>{const W=innerWidth;const out=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>W+1&&r.width>0)out.push(e.tagName+'.'+e.className+' '+Math.round(r.right))});return [document.documentElement.scrollWidth,out.slice(0,5)]})()""")
            print(r,w)
        await b.close()
asyncio.run(main())
