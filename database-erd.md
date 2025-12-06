# B-Prepped AI - Database ERD Diagram

Based on the analysis of the application pages, here's the Entity-Relationship Diagram for the B-Prepped AI resume builder application:

## Core Entities

### 1. Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  bio TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  linkedin VARCHAR(255),
  github VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
)
```

### 2. UserProfiles Table (Extended user settings)
```sql
user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  resume_tips BOOLEAN DEFAULT true,
  job_alerts BOOLEAN DEFAULT false,
  profile_visibility BOOLEAN DEFAULT false,
  data_analytics BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 3. TokenBalances Table
```sql
token_balances (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_balance INTEGER DEFAULT 0,
  total_purchased INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 4. TokenTransactions Table
```sql
token_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for purchases, negative for usage
  balance_after INTEGER NOT NULL,
  transaction_type ENUM('purchase', 'usage') NOT NULL,
  feature_type VARCHAR(50), -- 'resume_scan', 'interview_prep', etc.
  description TEXT,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 5. Resumes Table
```sql
resumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES resume_templates(id),
  content JSON, -- Structured resume data
  personal_info JSON, -- Personal details (name, email, phone)
  summary TEXT, -- Professional summary
  experience TEXT, -- Work experience content
  education TEXT, -- Education content
  skills TEXT, -- Skills content
  ats_score INTEGER,
  last_edited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_draft BOOLEAN DEFAULT false
)
```

### 5a. ResumeDrafts Table (for auto-saved drafts)
```sql
resume_drafts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  template_id UUID REFERENCES resume_templates(id),
  content JSON, -- Auto-saved form data
  last_saved TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 5b. ResumeSections Table (structured sections)
```sql
resume_sections (
  id UUID PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  section_type ENUM('personal', 'summary', 'experience', 'education', 'skills') NOT NULL,
  section_order INTEGER NOT NULL,
  content JSON,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 6. ResumeTemplates Table
```sql
resume_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('built-in', 'extracted', 'custom') DEFAULT 'built-in',
  description TEXT,
  sections INTEGER,
  layout VARCHAR(50), -- 'single-column', 'two-column'
  preview_url VARCHAR(500),
  template_data JSON, -- Template structure and styling
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 7. UserExperiences Table
```sql
user_experiences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  technologies JSON, -- Array of technology strings
  achievements JSON, -- Array of achievement strings
  responsibilities JSON, -- Array of responsibility strings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 8. ResumeScans Table
```sql
resume_scans (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  job_title VARCHAR(255),
  company VARCHAR(255),
  job_description TEXT,
  score INTEGER,
  keywords_matched INTEGER,
  keywords_missing INTEGER,
  keywords_total INTEGER,
  issues JSON, -- Array of issue objects with type and text
  suggestions JSON, -- Array of suggestion strings
  tokens_used INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 9. InterviewSessions Table
```sql
interview_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255),
  job_description TEXT,
  interviewer_id UUID REFERENCES interviewers(id),
  session_data JSON, -- Chat messages, duration, etc.
  score INTEGER,
  questions_answered INTEGER,
  total_questions INTEGER,
  feedback TEXT,
  strengths JSON, -- Array of strength strings
  improvements JSON, -- Array of improvement strings
  duration_minutes INTEGER,
  tokens_used INTEGER DEFAULT 25,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
)
```

### 10. Interviewers Table (AI Interviewer Profiles)
```sql
interviewers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  company VARCHAR(255),
  avatar_url VARCHAR(500),
  experience VARCHAR(50), -- '8+ years', etc.
  specialty VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true
)
```

### 11. UsageAnalytics Table
```sql
usage_analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL, -- 'resume_scan', 'interview_prep', etc.
  tokens_used INTEGER NOT NULL,
  session_data JSON, -- Additional context about the usage
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 12. UserSettings Table
```sql
user_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, setting_key)
)
```

## Relationships

1. Users → UserProfiles (1:1)
2. Users → TokenBalances (1:1)
3. Users → TokenTransactions (1:N)
4. Users → Resumes (1:N)
5. Users → UserExperiences (1:N)
6. Users → ResumeScans (1:N)
7. Users → InterviewSessions (1:N)
8. Users → UsageAnalytics (1:N)
9. Users → UserSettings (1:N)
10. Users → ResumeDrafts (1:N)
11. Resumes → ResumeTemplates (N:1)
12. Resumes → ResumeSections (1:N)
13. ResumeDrafts → Resumes (N:1, nullable)
14. ResumeDrafts → ResumeTemplates (N:1)
15. ResumeScans → Resumes (N:1)
16. InterviewSessions → Interviewers (N:1)

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at);
CREATE INDEX idx_resumes_is_draft ON resumes(is_draft);
CREATE INDEX idx_resume_drafts_user_id ON resume_drafts(user_id);
CREATE INDEX idx_resume_drafts_resume_id ON resume_drafts(resume_id);
CREATE INDEX idx_resume_drafts_last_saved ON resume_drafts(last_saved);
CREATE INDEX idx_resume_sections_resume_id ON resume_sections(resume_id);
CREATE INDEX idx_resume_sections_type ON resume_sections(section_type);
CREATE INDEX idx_user_experiences_user_id ON user_experiences(user_id);
CREATE INDEX idx_resume_scans_user_id ON resume_scans(user_id);
CREATE INDEX idx_resume_scans_created_at ON resume_scans(created_at);
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_created_at ON interview_sessions(created_at);
CREATE INDEX idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_feature_type ON usage_analytics(feature_type);
CREATE INDEX idx_usage_analytics_created_at ON usage_analytics(created_at);
```

## Key Design Considerations

1. **Token System**: Central to the application's monetization, with detailed transaction tracking
2. **JSON Fields**: Used for flexible data storage (resume content, technologies, achievements)
3. **Analytics**: Comprehensive tracking of user behavior and feature usage
4. **AI Features**: Support for resume scanning, optimization, and interview preparation
5. **Template System**: Extensible template management for different resume styles
6. **User Experience Tracking**: Detailed work experience management for resume building
7. **Resume Builder**: Structured sections with auto-save draft functionality
8. **Template Integration**: Seamless integration between experiences and resume builder

## Additional Considerations

1. **Soft Deletes**: Consider adding `deleted_at` timestamps instead of hard deletes
2. **Audit Trail**: Consider adding created_by/updated_by fields for admin operations
3. **File Storage**: Resume files and templates would likely be stored in a cloud storage service with references in the database
4. **Caching**: Frequently accessed data like user balances and templates should be cached
5. **Partitioning**: Consider time-based partitioning for high-volume tables like token_transactions and usage_analytics
