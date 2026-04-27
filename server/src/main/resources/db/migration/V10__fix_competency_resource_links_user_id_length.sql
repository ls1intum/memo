-- V9 extended competency_relationships_votes.user_id to VARCHAR(36) for Keycloak UUIDs
-- but missed competency_resource_links.user_id which is still VARCHAR(30).
-- A 36-char Keycloak UUID inserted as user_id would fail with "value too long".
ALTER TABLE competency_resource_links ALTER COLUMN user_id TYPE VARCHAR(36);
