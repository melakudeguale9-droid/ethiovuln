import asyncio
from app.database import engine
from sqlalchemy import text

async def test():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("SELECT 1 FROM scans LIMIT 1"))
            print("Scans table exists!")
        except Exception as e:
            print(f"DB Error: {e}")

asyncio.run(test())
