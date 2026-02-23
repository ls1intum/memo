-- Seed demo user
INSERT INTO users (id, name, email, role, created_at)
VALUES ('user_demo_001', 'Demo User', 'demo@memo.local', 'USER', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Seed admin user
INSERT INTO users (id, name, email, role, created_at)
VALUES ('user_admin_001', 'Admin User', 'admin@memo.local', 'ADMIN', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Seed guest user (for unauthenticated access)
INSERT INTO users (id, name, email, role, created_at)
VALUES ('guest', 'Guest User', 'guest@memo.local', 'USER', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Seed competencies
INSERT INTO competencies (id, title, description, created_at) VALUES
('comp_ds_001', 'Data Structures', 'Utilize built-in data types, implement pattern matching to deconstruct complex types, and create user-defined data structures.', CURRENT_TIMESTAMP),
('comp_fp_001', 'Functional Programming', 'Implement solutions using pure functions without side effects, write recursive functions, and optimize through tail recursion.', CURRENT_TIMESTAMP),
('comp_hof_001', 'Higher-Order Functions', 'Differentiate between named and anonymous functions, create higher-order functions, and apply currying and partial application techniques.', CURRENT_TIMESTAMP),
('comp_poly_001', 'Polymorphism', 'Understand polymorphism and instantiation, implement polymorphic functions and data types for general-purpose reusable code.', CURRENT_TIMESTAMP),
('comp_mod_001', 'Module System and Abstraction', 'Design modules with clear interfaces, implement information hiding through abstract types, create functors, and structure programs using modular components.', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Seed learning resources
INSERT INTO learning_resources (id, title, url, created_at) VALUES
('res_ocaml_001', 'Cornell CS 3110: Data Structures and Functional Programming (OCaml) – Course Notes', 'https://cs3110.github.io/textbook/', CURRENT_TIMESTAMP),
('res_rwo_001', 'Real World OCaml (2nd Edition)', 'https://dev.realworldocaml.org/', CURRENT_TIMESTAMP),
('res_fp_001', 'Functional Programming in OCaml', 'https://cs3110.github.io/textbook/chapters/intro/intro.html', CURRENT_TIMESTAMP),
('res_mod_001', 'OCaml Manual: The Module System and Functors', 'https://v2.ocaml.org/manual/moduleexamples.html', CURRENT_TIMESTAMP),
('res_types_001', 'On Understanding Types, Data Abstraction, and Polymorphism', 'https://dl.acm.org/doi/10.1145/6041.6042', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Seed competency relationships (examples)
INSERT INTO competency_relationships (id, relationship_type, origin_id, destination_id, user_id, created_at) VALUES
('rel_ds_fp_001', 'ASSUMES', 'comp_fp_001', 'comp_ds_001', 'user_demo_001', CURRENT_TIMESTAMP),
('rel_hof_fp_001', 'EXTENDS', 'comp_hof_001', 'comp_fp_001', 'user_demo_001', CURRENT_TIMESTAMP),
('rel_mod_poly_001', 'ASSUMES', 'comp_mod_001', 'comp_poly_001', 'user_demo_001', CURRENT_TIMESTAMP)
ON CONFLICT (origin_id, destination_id, relationship_type) DO NOTHING;

-- Seed competency-resource links (examples)
INSERT INTO competency_resource_links (id, competency_id, resource_id, user_id, created_at) VALUES
('link_ds_ocaml_001', 'comp_ds_001', 'res_ocaml_001', 'user_demo_001', CURRENT_TIMESTAMP),
('link_fp_ocaml_001', 'comp_fp_001', 'res_ocaml_001', 'user_demo_001', CURRENT_TIMESTAMP),
('link_fp_rwo_001', 'comp_fp_001', 'res_rwo_001', 'user_demo_001', CURRENT_TIMESTAMP),
('link_hof_fp_001', 'comp_hof_001', 'res_fp_001', 'user_demo_001', CURRENT_TIMESTAMP),
('link_mod_mod_001', 'comp_mod_001', 'res_mod_001', 'user_demo_001', CURRENT_TIMESTAMP),
('link_poly_types_001', 'comp_poly_001', 'res_types_001', 'user_demo_001', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
