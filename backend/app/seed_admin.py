"""
EthioVuln — Seed Admin User
Run: python -m app.seed_admin
"""

import asyncio
from sqlalchemy import select
from app.database import async_session_factory, init_db
from app.models.user import User
from app.core.security import hash_password


async def seed_admin():
    await init_db()

    async with async_session_factory() as session:
        # Check if admin already exists
        result = await session.execute(
            select(User).where(User.email == "melaku@gmail.com")
        )
        existing = result.scalar_one_or_none()

        if existing:
            print("✓ Admin user already exists")
            return

        admin = User(
            email="melaku@gmail.com",
            username="melaku",
            hashed_password=hash_password("Admin@1234"),  # change this password
            full_name="Melaku",
            is_active=True,
            is_admin=True,
        )
        session.add(admin)
        await session.commit()
        print("✓ Admin user created successfully")
        print("  Email:    melaku@gmail.com")
        print("  Password: Admin@1234  ← CHANGE THIS after first login")


if __name__ == "__main__":
    asyncio.run(seed_admin())
