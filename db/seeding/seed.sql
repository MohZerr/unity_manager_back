-- Insert data into "user"
INSERT INTO "user" (email, password, firstname, lastname, code_color, created_at, updated_at)
VALUES
('xavier@oclock.io', '$2b$10$vjcHuUYaDQRCYD6TxcbZEe4Mty0cH5q0CRLMw6oWnpiSOe6w/5Z/u', 'Xavier', 'LANDRON', '#b2c3d4', NOW(), NOW()),
('henri@oclock.io', '$2b$10$jat9qcFcyH7j81cgL.HokeTTfupV2NxenybE5kZ.jroByGfSaJfGW', 'Henri', 'IOSIPOV', '#c3d4e5', NOW(), NOW()),
('mohamed@oclock.io', '$2b$10$psWdFCAgmQ7EzAjQivOW4uDuFnpDPU.pZnj/WveTd0snzu/3ErV1m', 'Mohamed', 'ZERROUKI', '#d4e5f6', NOW(), NOW()),
('kheang@oclock.io', '$2b$10$PtUsimIZogwogiEfIlhXte7BIcgu.sCZ1AwiBJAIe3dcgQ4fp6zSW', 'Kheang', 'TE', '#d4e5f6', NOW(), NOW());

-- Insert data into "project"
INSERT INTO "project" (name, owner_id, created_at, updated_at)
VALUES
('Project Alpha', 1, NOW(), NOW()),
('Project Beta', 2, NOW(), NOW()),
('Project Gamma', 3, NOW(), NOW());

-- Insert data into "list"
INSERT INTO "list" (name, position, code_color, project_id, created_at, updated_at)
VALUES
('Todo', 1.0, '#ffddcc', 1, NOW(), NOW()),
('Done', 2.0, '#ddeeff', 1, NOW(), NOW()),
('In Progress', 1.5, '#ccffee', 2, NOW(), NOW()),
('Review', 2.5, '#eeddcc', 2, NOW(), NOW());

-- Insert data into "card"
INSERT INTO "card" (name, content, position, list_id, created_at, updated_at)
VALUES
('test1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 1.0, 1, NOW(), NOW()),
('test2', 'Officia deserunt mollit anim id est laborum', 2.0, 1, NOW(), NOW()),
('test3', 'Ut enim ad minim veniam, quis nostrud exercitation', 1.0, 2, NOW(), NOW()),
('test4', 'Duis aute irure dolor in reprehenderit in voluptate', 2.0, 2, NOW(), NOW());

-- Insert data into "project_has_user"
INSERT INTO "project_has_user" (project_id, user_id, created_at, updated_at)
VALUES
(1, 1, NOW(), NOW()),
(1, 2, NOW(), NOW()),
(1, 3, NOW(), NOW()),
(1, 4, NOW(), NOW()),
(2, 1, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(2, 3, NOW(), NOW()),
(2, 4, NOW(), NOW()),
(3, 1, NOW(), NOW()),
(3, 2, NOW(), NOW()),
(3, 3, NOW(), NOW()),
(3, 4, NOW(), NOW());

-- Insert data into "tag"
INSERT INTO "tag" (name, code_color, project_id, created_at, updated_at)
VALUES
('Urgent', '#ff1122', 1, NOW(), NOW()),
('Optional', '#2211ff', 1, NOW(), NOW()),
('Important', '#33cc33', 2, NOW(), NOW()),
('Review', '#ffaa00', 3, NOW(), NOW());

-- Insert data into "card_has_tag"
INSERT INTO "card_has_tag" (tag_id, card_id, created_at, updated_at)
VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(3, 3, NOW(), NOW()),
(4, 4, NOW(), NOW());

-- Insert data into "card_has_user"
INSERT INTO "card_has_user" (user_id, card_id, created_at, updated_at)
VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(3, 3, NOW(), NOW()),
(4, 4, NOW(), NOW());