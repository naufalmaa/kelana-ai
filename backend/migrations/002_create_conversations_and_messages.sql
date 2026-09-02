-- Migration: 002_create_conversations_and_messages
-- Creates conversations and messages tables

CREATE TABLE IF NOT EXISTS conversations (
    id         BIGSERIAL   PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(256) NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure title column exists if table was created in an earlier run
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS title VARCHAR(256) DEFAULT 'New Conversation';

CREATE INDEX IF NOT EXISTS idx_conversations_user_id
    ON conversations(user_id);

CREATE TABLE IF NOT EXISTS messages (
    id              BIGSERIAL   PRIMARY KEY,
    conversation_id BIGINT      NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    title           VARCHAR(256) NOT NULL,
    role            VARCHAR(16) NOT NULL,
    content         TEXT        NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure title column exists if table was created in an earlier run
ALTER TABLE messages ADD COLUMN IF NOT EXISTS title VARCHAR(256);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
    ON messages(conversation_id);