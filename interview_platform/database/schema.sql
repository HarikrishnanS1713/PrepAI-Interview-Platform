-- ============================================================
-- PrepAI – MySQL Database Schema
-- Run this file to initialise the database:
--   mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS prepai_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE prepai_db;

-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  domain        VARCHAR(50)   DEFAULT 'general',
  experience    VARCHAR(20)   DEFAULT 'fresher',
  org           VARCHAR(120)  DEFAULT NULL,
  target_role   VARCHAR(120)  DEFAULT NULL,
  is_active     TINYINT(1)    DEFAULT 1,
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;


-- ── Questions ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  question_text   TEXT          NOT NULL,
  domain          VARCHAR(50)   NOT NULL,   -- programming | hr | technical | aptitude
  type            VARCHAR(30)   NOT NULL,   -- interview | quiz | aptitude
  difficulty      VARCHAR(10)   DEFAULT 'medium',  -- easy | medium | hard
  options         JSON          DEFAULT NULL,       -- for MCQ: ["opt1","opt2",...]
  correct_answer  VARCHAR(255)  DEFAULT NULL,       -- MCQ answer index or keyword
  explanation     TEXT          DEFAULT NULL,
  created_by      INT           DEFAULT NULL,
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_domain     (domain),
  INDEX idx_type       (type),
  INDEX idx_difficulty (difficulty),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- ── Sessions ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT           NOT NULL,
  type             VARCHAR(30)   NOT NULL,   -- interview | quiz | aptitude | hr
  domain           VARCHAR(50)   DEFAULT 'general',
  difficulty       VARCHAR(10)   DEFAULT 'medium',
  total_questions  INT           DEFAULT 10,
  status           VARCHAR(20)   DEFAULT 'active',  -- active | completed | abandoned
  score            DECIMAL(5,2)  DEFAULT NULL,
  created_at       DATETIME      DEFAULT CURRENT_TIMESTAMP,
  completed_at     DATETIME      DEFAULT NULL,
  INDEX idx_user   (user_id),
  INDEX idx_status (status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ── Responses ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS responses (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  session_id   INT           NOT NULL,
  user_id      INT           NOT NULL,
  question_id  INT           NOT NULL,
  answer_text  TEXT          DEFAULT NULL,
  score        DECIMAL(5,2)  DEFAULT 0,
  feedback     TEXT          DEFAULT NULL,
  is_correct   TINYINT(1)    DEFAULT NULL,   -- for MCQ
  created_at   DATETIME      DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session  (session_id),
  INDEX idx_user     (user_id),
  INDEX idx_question (question_id),
  FOREIGN KEY (session_id)  REFERENCES sessions(id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ── Performance Reports ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS performance_reports (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT           NOT NULL,
  report_date      DATE          NOT NULL,
  sessions_done    INT           DEFAULT 0,
  avg_score        DECIMAL(5,2)  DEFAULT 0,
  best_domain      VARCHAR(50)   DEFAULT NULL,
  weak_domain      VARCHAR(50)   DEFAULT NULL,
  recommendations  TEXT          DEFAULT NULL,
  created_at       DATETIME      DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ================================================================
-- SEED DATA – Sample questions
-- ================================================================

INSERT INTO questions (question_text, domain, type, difficulty, options, correct_answer, explanation) VALUES
-- Programming interview questions
('Explain the difference between stack and queue data structures.', 'programming', 'interview', 'easy', NULL, NULL, NULL),
('What is Big O notation? Explain O(1), O(n), and O(n log n).', 'programming', 'interview', 'medium', NULL, NULL, NULL),
('What is recursion and when should you avoid it?', 'programming', 'interview', 'medium', NULL, NULL, NULL),
('Explain the concept of closures in programming.', 'programming', 'interview', 'hard', NULL, NULL, NULL),
('What are SOLID principles? Give an example for each.', 'programming', 'interview', 'hard', NULL, NULL, NULL),

-- Technical MCQ – DSA
('What is the time complexity of binary search?',
  'technical', 'quiz', 'easy',
  '["O(n)", "O(log n)", "O(n²)", "O(1)"]',
  '1',
  'Binary search halves the search space each step, giving O(log n).'),
('Which data structure uses LIFO order?',
  'technical', 'quiz', 'easy',
  '["Queue", "Stack", "Deque", "Linked List"]',
  '1',
  'Stack uses Last In, First Out order.'),
('What is the worst-case time complexity of QuickSort?',
  'technical', 'quiz', 'medium',
  '["O(n log n)", "O(n)", "O(n²)", "O(log n)"]',
  '2',
  'When the pivot is always the smallest/largest element, QuickSort degrades to O(n²).'),

-- HR interview questions
('Tell me about yourself and your background.', 'hr', 'interview', 'easy', NULL, NULL, NULL),
('Describe a time you resolved a conflict with a team member.', 'hr', 'interview', 'medium', NULL, NULL, NULL),
('Where do you see yourself in 5 years?', 'hr', 'interview', 'easy', NULL, NULL, NULL),

-- Aptitude MCQ
('A train travels 360 km in 4 hours. What is its speed in km/h?',
  'aptitude', 'quiz', 'easy',
  '["80", "90", "100", "120"]',
  '1',
  'Speed = Distance / Time = 360 / 4 = 90 km/h.'),
('What is 15% of 400?',
  'aptitude', 'quiz', 'easy',
  '["50", "55", "60", "65"]',
  '2',
  '15% of 400 = (15/100) × 400 = 60.'),
('Complete the series: 2, 4, 8, 16, __',
  'aptitude', 'quiz', 'easy',
  '["24", "32", "30", "18"]',
  '1',
  'Each term is doubled: 16 × 2 = 32.'),

-- DBMS questions
('What does ACID stand for in database transactions?',
  'technical', 'quiz', 'medium',
  '["Atomicity, Consistency, Isolation, Durability", "Async, Concurrent, Indexed, Distributed", "Atomic, Complete, Integrated, Durable", "None of the above"]',
  '0',
  'ACID ensures reliable database transactions: Atomicity, Consistency, Isolation, Durability.');
