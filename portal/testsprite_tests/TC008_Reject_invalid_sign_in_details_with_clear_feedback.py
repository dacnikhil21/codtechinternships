import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        pw = await async_api.async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )
        context = await browser.new_context()
        context.set_default_timeout(15000)
        page = await context.new_page()
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill the Email field with an invalid email address, fill the Password field with an invalid password, then submit the Sign In form.
        # email input placeholder="student@example.com"
        elem = page.locator("xpath=/html/body/div/main/section[2]/form/div/div/div/input").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("invalid-email")
        
        # -> Fill the Email field with an invalid email address, fill the Password field with an invalid password, then submit the Sign In form.
        # password input placeholder="••••••••"
        elem = page.locator("xpath=/html/body/div/main/section[2]/form/div/div[2]/div/input").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("badpassword")
        
        # -> Fill the Email field with an invalid email address, fill the Password field with an invalid password, then submit the Sign In form.
        # button "Sign In
login"
        elem = page.locator("xpath=/html/body/div/main/section[2]/form/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        await asyncio.sleep(5)
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    