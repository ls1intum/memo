-- Additional competencies and seed data for testing
-- Adds 15 new competencies, 38 relationship pairs, and 38 backdated votes
-- for the guest user spread across the last ~8 weeks (includes a 6-day streak)

-- ───────────────────────── Competencies ─────────────────────────

INSERT INTO competencies (id, title, description, created_at) VALUES
('comp_alg_001',  'Algorithm Design',           'Analyze problems, design efficient algorithms using divide-and-conquer, greedy, and dynamic programming strategies, and argue correctness via invariants and induction.', CURRENT_TIMESTAMP),
('comp_tc_001',   'Type Checking and Inference', 'Implement type-checking algorithms, understand Hindley–Milner inference, and reason about type soundness in statically typed languages.', CURRENT_TIMESTAMP),
('comp_conc_001', 'Concurrency and Parallelism', 'Write concurrent programs using threads, locks, and message passing; reason about race conditions, deadlocks, and memory models.', CURRENT_TIMESTAMP),
('comp_io_001',   'I/O and Side Effects',        'Manage side effects in functional programs using monadic abstractions, distinguish pure from impure code, and sequence effectful computations.', CURRENT_TIMESTAMP),
('comp_test_001', 'Testing and Verification',    'Write unit and property-based tests, apply test-driven development, and use formal verification techniques such as pre/post-conditions.', CURRENT_TIMESTAMP),
('comp_pars_001', 'Parsing and Grammars',        'Define context-free grammars, implement recursive-descent and parser-combinator parsers, and construct abstract syntax trees from source text.', CURRENT_TIMESTAMP),
('comp_eval_001', 'Evaluation Strategies',       'Compare call-by-value, call-by-name, and lazy evaluation; implement interpreters that support different reduction strategies.', CURRENT_TIMESTAMP),
('comp_err_001',  'Error Handling',              'Model errors with option/result types instead of exceptions, propagate errors functionally, and design robust recovery strategies.', CURRENT_TIMESTAMP),
('comp_oop_001',  'Object-Oriented Design',      'Apply encapsulation, inheritance, and composition; use SOLID principles and design patterns such as Observer, Strategy, and Factory.', CURRENT_TIMESTAMP),
('comp_db_001',   'Database Fundamentals',       'Design normalized relational schemas, write SQL queries with joins and aggregations, and understand transaction isolation levels.', CURRENT_TIMESTAMP),
('comp_net_001',  'Networking Basics',           'Understand TCP/IP, HTTP, and DNS; implement client-server communication using sockets and REST APIs.', CURRENT_TIMESTAMP),
('comp_os_001',   'Operating Systems Concepts',  'Explain process scheduling, virtual memory, and file systems; write programs that interact with OS services via system calls.', CURRENT_TIMESTAMP),
('comp_sec_001',  'Software Security',           'Identify common vulnerabilities (XSS, SQL injection, buffer overflow), apply secure coding practices, and understand authentication and encryption fundamentals.', CURRENT_TIMESTAMP),
('comp_git_001',  'Version Control with Git',    'Use branching, merging, and rebasing workflows; resolve merge conflicts and collaborate effectively using pull requests.', CURRENT_TIMESTAMP),
('comp_cpl_001',  'Complexity Theory',           'Classify problems by time and space complexity using Big-O notation; understand P, NP, and NP-completeness with reduction proofs.', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ───────────────────────── Relationships ─────────────────────────

INSERT INTO competency_relationships (id, origin_id, destination_id, total_votes, vote_assumes, vote_extends, vote_matches, vote_unrelated, entropy, created_at, updated_at) VALUES
('rel_seed_01', 'comp_alg_001',  'comp_tc_001',   1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_TIMESTAMP - INTERVAL '55 days'),
('rel_seed_02', 'comp_alg_001',  'comp_conc_001', 1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '52 days', CURRENT_TIMESTAMP - INTERVAL '52 days'),
('rel_seed_03', 'comp_tc_001',   'comp_conc_001', 1, 0, 0, 0, 1, 0.0, CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '50 days'),
('rel_seed_04', 'comp_io_001',   'comp_test_001', 1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '48 days', CURRENT_TIMESTAMP - INTERVAL '48 days'),
('rel_seed_05', 'comp_pars_001', 'comp_eval_001', 1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '45 days'),
('rel_seed_06', 'comp_err_001',  'comp_oop_001',  1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '43 days', CURRENT_TIMESTAMP - INTERVAL '43 days'),
('rel_seed_07', 'comp_db_001',   'comp_net_001',  1, 0, 0, 0, 1, 0.0, CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_TIMESTAMP - INTERVAL '40 days'),
('rel_seed_08', 'comp_os_001',   'comp_sec_001',  1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '38 days', CURRENT_TIMESTAMP - INTERVAL '38 days'),
('rel_seed_09', 'comp_git_001',  'comp_cpl_001',  1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '35 days'),
('rel_seed_10', 'comp_alg_001',  'comp_io_001',   1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '33 days', CURRENT_TIMESTAMP - INTERVAL '33 days'),
('rel_seed_11', 'comp_tc_001',   'comp_pars_001', 1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
('rel_seed_12', 'comp_conc_001', 'comp_err_001',  1, 0, 0, 0, 1, 0.0, CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '28 days'),
('rel_seed_13', 'comp_eval_001', 'comp_db_001',   1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '26 days', CURRENT_TIMESTAMP - INTERVAL '26 days'),
('rel_seed_14', 'comp_net_001',  'comp_os_001',   1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '24 days', CURRENT_TIMESTAMP - INTERVAL '24 days'),
('rel_seed_15', 'comp_sec_001',  'comp_git_001',  1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '21 days', CURRENT_TIMESTAMP - INTERVAL '21 days'),
('rel_seed_16', 'comp_cpl_001',  'comp_test_001', 1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '19 days', CURRENT_TIMESTAMP - INTERVAL '19 days'),
-- 6-day streak: days 14–19 ago
('rel_seed_17', 'comp_oop_001',  'comp_db_001',   1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '17 days', CURRENT_TIMESTAMP - INTERVAL '17 days'),
('rel_seed_18', 'comp_io_001',   'comp_pars_001', 1, 0, 0, 0, 1, 0.0, CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '14 days'),
('rel_seed_19', 'comp_eval_001', 'comp_err_001',  1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '12 days'),
('rel_seed_20', 'comp_net_001',  'comp_git_001',  1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('rel_seed_21', 'comp_alg_001',  'comp_err_001',  1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '7 days',  CURRENT_TIMESTAMP - INTERVAL '7 days'),
('rel_seed_22', 'comp_tc_001',   'comp_db_001',   1, 0, 0, 0, 1, 0.0, CURRENT_TIMESTAMP - INTERVAL '5 days',  CURRENT_TIMESTAMP - INTERVAL '5 days'),
('rel_seed_23', 'comp_conc_001', 'comp_os_001',   1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '3 days',  CURRENT_TIMESTAMP - INTERVAL '3 days'),
('rel_seed_24', 'comp_cpl_001',  'comp_oop_001',  1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Extra votes on some days for varied daily counts
('rel_seed_25', 'comp_alg_001',  'comp_cpl_001',  1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '28 days'),
('rel_seed_26', 'comp_io_001',   'comp_err_001',  1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '21 days', CURRENT_TIMESTAMP - INTERVAL '21 days'),
('rel_seed_27', 'comp_test_001', 'comp_eval_001', 1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '14 days'),
('rel_seed_28', 'comp_oop_001',  'comp_sec_001',  1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '7 days',  CURRENT_TIMESTAMP - INTERVAL '7 days'),
('rel_seed_29', 'comp_pars_001', 'comp_cpl_001',  1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '5 days',  CURRENT_TIMESTAMP - INTERVAL '5 days'),
('rel_seed_30', 'comp_sec_001',  'comp_db_001',   1, 0, 0, 0, 1, 0.0, CURRENT_TIMESTAMP - INTERVAL '3 days',  CURRENT_TIMESTAMP - INTERVAL '3 days'),
('rel_seed_31', 'comp_git_001',  'comp_net_001',  1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('rel_seed_32', 'comp_conc_001', 'comp_test_001', 1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('rel_seed_33', 'comp_alg_001',  'comp_eval_001', 1, 0, 0, 0, 1, 0.0, CURRENT_TIMESTAMP - INTERVAL '17 days', CURRENT_TIMESTAMP - INTERVAL '17 days'),
('rel_seed_34', 'comp_test_001', 'comp_net_001',  1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '24 days', CURRENT_TIMESTAMP - INTERVAL '24 days'),
('rel_seed_35', 'comp_git_001',  'comp_oop_001',  1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '33 days', CURRENT_TIMESTAMP - INTERVAL '33 days'),
-- Streak gap-fillers (days 15, 16, 18)
('rel_seed_36', 'comp_alg_001',  'comp_pars_001', 1, 0, 1, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('rel_seed_37', 'comp_tc_001',   'comp_eval_001', 1, 1, 0, 0, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '16 days'),
('rel_seed_38', 'comp_conc_001', 'comp_git_001',  1, 0, 0, 1, 0, 0.0, CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '18 days')
ON CONFLICT DO NOTHING;

-- ───────────────────────── Votes ─────────────────────────

INSERT INTO competency_relationships_votes (id, relationship_id, user_id, relationship_type, created_at) VALUES
('vote_seed_01', 'rel_seed_01', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '55 days'),
('vote_seed_02', 'rel_seed_02', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '52 days'),
('vote_seed_03', 'rel_seed_03', 'guest', 'UNRELATED', CURRENT_TIMESTAMP - INTERVAL '50 days'),
('vote_seed_04', 'rel_seed_04', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '48 days'),
('vote_seed_05', 'rel_seed_05', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '45 days'),
('vote_seed_06', 'rel_seed_06', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '43 days'),
('vote_seed_07', 'rel_seed_07', 'guest', 'UNRELATED', CURRENT_TIMESTAMP - INTERVAL '40 days'),
('vote_seed_08', 'rel_seed_08', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '38 days'),
('vote_seed_09', 'rel_seed_09', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '35 days'),
('vote_seed_10', 'rel_seed_10', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '33 days'),
('vote_seed_11', 'rel_seed_11', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '30 days'),
('vote_seed_12', 'rel_seed_12', 'guest', 'UNRELATED', CURRENT_TIMESTAMP - INTERVAL '28 days'),
('vote_seed_13', 'rel_seed_13', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '26 days'),
('vote_seed_14', 'rel_seed_14', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '24 days'),
('vote_seed_15', 'rel_seed_15', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '21 days'),
('vote_seed_16', 'rel_seed_16', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '19 days'),
('vote_seed_17', 'rel_seed_17', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '17 days'),
('vote_seed_18', 'rel_seed_18', 'guest', 'UNRELATED', CURRENT_TIMESTAMP - INTERVAL '14 days'),
('vote_seed_19', 'rel_seed_19', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '12 days'),
('vote_seed_20', 'rel_seed_20', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '10 days'),
('vote_seed_21', 'rel_seed_21', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '7 days'),
('vote_seed_22', 'rel_seed_22', 'guest', 'UNRELATED', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('vote_seed_23', 'rel_seed_23', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '3 days'),
('vote_seed_24', 'rel_seed_24', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('vote_seed_25', 'rel_seed_25', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '28 days'),
('vote_seed_26', 'rel_seed_26', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '21 days'),
('vote_seed_27', 'rel_seed_27', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '14 days'),
('vote_seed_28', 'rel_seed_28', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '7 days'),
('vote_seed_29', 'rel_seed_29', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '5 days'),
('vote_seed_30', 'rel_seed_30', 'guest', 'UNRELATED', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('vote_seed_31', 'rel_seed_31', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('vote_seed_32', 'rel_seed_32', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '10 days'),
('vote_seed_33', 'rel_seed_33', 'guest', 'UNRELATED', CURRENT_TIMESTAMP - INTERVAL '17 days'),
('vote_seed_34', 'rel_seed_34', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '24 days'),
('vote_seed_35', 'rel_seed_35', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '33 days'),
-- Streak gap-fillers
('vote_seed_36', 'rel_seed_36', 'guest', 'EXTENDS',   CURRENT_TIMESTAMP - INTERVAL '15 days'),
('vote_seed_37', 'rel_seed_37', 'guest', 'ASSUMES',   CURRENT_TIMESTAMP - INTERVAL '16 days'),
('vote_seed_38', 'rel_seed_38', 'guest', 'MATCHES',   CURRENT_TIMESTAMP - INTERVAL '18 days')
ON CONFLICT DO NOTHING;
