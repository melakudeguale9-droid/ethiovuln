"""add_settings_apikeys_loginhistory

Revision ID: 0152bce2c4e7
Revises: 40c1496237d0
Create Date: 2026-09-09 11:33:54.243452
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0152bce2c4e7'
down_revision: Union[str, None] = '40c1496237d0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop legacy avatar_url column from users
    op.drop_column('users', 'avatar_url')

    # ── user_preferences ────────────────────────────────────────────────────
    op.create_table(
        'user_preferences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('users.id', ondelete='CASCADE'),
                  nullable=False, unique=True),
        sa.Column('default_scan_type', sa.String(50), nullable=False, server_default='full'),
        sa.Column('default_scan_timeout', sa.Integer(), nullable=False, server_default='30'),
        sa.Column('default_fuzzer_threads', sa.Integer(), nullable=False, server_default='30'),
        sa.Column('auto_stop_on_critical', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('exclude_paths', sa.Text(), nullable=True),
        sa.Column('default_severity_filter', sa.String(20), nullable=False, server_default='all'),
        sa.Column('items_per_page', sa.Integer(), nullable=False, server_default='20'),
        sa.Column('show_stats_cards', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('notify_scan_complete', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('notify_critical_finding', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('notify_email', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('report_include_low', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('report_company_name', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── api_keys ─────────────────────────────────────────────────────────────
    op.create_table(
        'api_keys',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('users.id', ondelete='CASCADE'),
                  nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('key_prefix', sa.String(8), nullable=False),
        sa.Column('hashed_key', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── login_history ────────────────────────────────────────────────────────
    op.create_table(
        'login_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('users.id', ondelete='CASCADE'),
                  nullable=False),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('success', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('login_history')
    op.drop_table('api_keys')
    op.drop_table('user_preferences')
    op.add_column('users', sa.Column('avatar_url', sa.VARCHAR(length=500), autoincrement=False, nullable=True))
