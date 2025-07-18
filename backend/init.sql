-- Planeswalker's Primer - Database Initialisation Script
-- This script sets up the database schema for local development

-- Enable UUID extension for future use
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favourites table (UK spelling for database)
CREATE TABLE IF NOT EXISTS favourites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    card_name VARCHAR(255) NOT NULL,
    scryfall_id VARCHAR(255),
    ability_type VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table (for testing/demo purposes)
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourites_card_name ON favourites(card_name);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert sample data for development
INSERT INTO users (username) VALUES
    ('demo_user'),
    ('test_player'),
    ('mtg_beginner')
ON CONFLICT (username) DO NOTHING;

-- Insert sample favourites (using the demo_user)
INSERT INTO favourites (user_id, card_name, scryfall_id, ability_type, notes) VALUES
    (1, 'Lightning Bolt', 'e3285e6b-3e79-4d7c-bf96-d920f973b122', 'Instant', 'Classic burn spell - great for beginners'),
    (1, 'Llanowar Elves', 'e2ca9671-0ad9-4e39-8a7a-47cd8b7b9297', 'Creature - Elf Druid', 'Mana acceleration - very useful'),
    (2, 'Serra Angel', 'b5d97e72-8c85-4f1e-9a55-8e4b6c54c9b1', 'Creature - Angel', 'Flying and vigilance make this a strong creature'),
    (2, 'Counterspell', 'ce30f926-bc06-46ee-9f35-0cdf09a67043', 'Instant', 'Classic blue counterspell')
ON CONFLICT DO NOTHING;

-- Insert sample messages for testing
INSERT INTO messages (text) VALUES
    ('Welcome to Planeswalker''s Primer!'),
    ('This is a sample message for testing the API'),
    ('Local development environment is working!')
ON CONFLICT DO NOTHING;

-- Create a view for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT
    u.id,
    u.username,
    u.created_at,
    COUNT(f.id) as favourite_count,
    MAX(f.created_at) as last_favourite_added
FROM users u
LEFT JOIN favourites f ON u.id = f.user_id
GROUP BY u.id, u.username, u.created_at;

-- Grant permissions (for development)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Create a function to clean up test data (useful for development)
CREATE OR REPLACE FUNCTION reset_test_data()
RETURNS void AS $$
BEGIN
    DELETE FROM favourites WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
    DELETE FROM users WHERE username LIKE 'test_%';
    DELETE FROM messages WHERE text LIKE '%test%';
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Planeswalker''s Primer database initialised successfully!';
    RAISE NOTICE 'Sample users created: demo_user, test_player, mtg_beginner';
    RAISE NOTICE 'Sample favourites and messages added for testing';
END $$;
