"""add_user_subscription_and_role

Revision ID: 5a2b8e9f1c3d
Revises: 0152bce2c4e7
Create Date: 2026-10-24 11:40:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5a2b8e9f1c3d'
down_revision: Union[str, None] = '0152bce2c4e7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('users')]

    if 'role' not in columns:
        op.add_column(
            'users',
            sa.Column('role', sa.String(length=100), nullable=False, server_default='Cyber Security Student')
        )
    if 'subscription_tier' not in columns:
        op.add_column(
            'users',
            sa.Column('subscription_tier', sa.String(length=50), nullable=False, server_default='Free')
        )
    if 'trial_ends_at' not in columns:
        op.add_column(
            'users',
            sa.Column('trial_ends_at', sa.DateTime(timezone=True), nullable=True)
        )


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('users')]

    if 'trial_ends_at' in columns:
        op.drop_column('users', 'trial_ends_at')
    if 'subscription_tier' in columns:
        op.drop_column('users', 'subscription_tier')
    if 'role' in columns:
        op.drop_column('users', 'role')
