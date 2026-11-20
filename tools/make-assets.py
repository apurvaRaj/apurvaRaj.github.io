# Regenerates public/og/default.png and public/resume.pdf from tools/og.html and tools/resume.html.
# Needs: pip install playwright && playwright install chromium. Run from the repo root: python3 tools/make-assets.py
import asyncio, pathlib
from playwright.async_api import async_playwright
root = pathlib.Path(__file__).resolve().parent
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1200, 'height': 630})
        await pg.goto((root / 'og.html').as_uri()); await pg.wait_for_timeout(600)
        (root.parent / 'public/og').mkdir(parents=True, exist_ok=True)
        await pg.screenshot(path=str(root.parent / 'public/og/default.png'))
        await pg.goto((root / 'resume.html').as_uri()); await pg.wait_for_timeout(400)
        await pg.pdf(path=str(root.parent / 'public/resume.pdf'), format='A4', print_background=True, prefer_css_page_size=True)
        await b.close()
asyncio.run(main())
