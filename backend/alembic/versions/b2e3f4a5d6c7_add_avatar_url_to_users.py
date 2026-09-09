"""add avatar_url to users

Revision ID: b2e3f4a5d6c7
Revises: 40c1496237d0
Create Date: 2026-09-09

"""
from alembic import op
import sqlalchemy as sa

revision = 'b2e3f4a5d6c7'
down_revision = '40c1496237d0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('users', sa.Column('avatar_url', sa.String(500), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'avatar_url')
