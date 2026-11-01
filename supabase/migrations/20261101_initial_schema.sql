-- ====================================================================
-- HANZI MASTER - POSTGRESQL DATABASE SCHEMA & MIGRATION
-- Production-Ready Schema covering HSK 1-6 Curriculum, SRS, Writing,
-- Speaking, Listening, Mock Exams, Gamification, and AI Tutor.
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    current_hsk_level INTEGER NOT NULL DEFAULT 1 CHECK (current_hsk_level BETWEEN 1 AND 6),
    daily_goal_minutes INTEGER NOT NULL DEFAULT 20,
    daily_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    total_xp INTEGER NOT NULL DEFAULT 0,
    preferred_script TEXT NOT NULL DEFAULT 'simplified' CHECK (preferred_script IN ('simplified', 'traditional')),
    audio_speed NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (audio_speed IN (0.75, 1.00, 1.25)),
    theme_preference TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. HSK LEVELS
CREATE TABLE IF NOT EXISTS public.hsk_levels (
    level INTEGER PRIMARY KEY CHECK (level BETWEEN 1 AND 6),
    title TEXT NOT NULL,
    title_vn TEXT NOT NULL,
    description TEXT NOT NULL,
    required_vocab_count INTEGER NOT NULL,
    passing_score INTEGER NOT NULL DEFAULT 180,
    max_score INTEGER NOT NULL DEFAULT 300,
    color_hex TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. COURSES & UNITS
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_vn TEXT NOT NULL,
    description_vn TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_vn TEXT NOT NULL,
    description_vn TEXT,
    icon_name TEXT DEFAULT 'BookOpen',
    estimated_hours NUMERIC(4,1) DEFAULT 4.0,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_vn TEXT NOT NULL,
    learning_objectives TEXT[],
    estimated_minutes INTEGER NOT NULL DEFAULT 25,
    order_index INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. VOCABULARY & EXAMPLES
CREATE TABLE IF NOT EXISTS public.vocabulary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    simplified TEXT NOT NULL,
    traditional TEXT,
    pinyin TEXT NOT NULL,
    pinyin_clean TEXT NOT NULL, -- Pinyin without tone marks for easy searching
    meaning_vn TEXT NOT NULL,
    meaning_en TEXT NOT NULL,
    part_of_speech TEXT, -- noun, verb, adjective, measure word, particle, etc.
    radical TEXT,
    stroke_count INTEGER,
    audio_url TEXT,
    is_official_syllabus BOOLEAN NOT NULL DEFAULT true,
    difficulty_rating NUMERIC(2,1) DEFAULT 1.0, -- 1.0 to 5.0
    synonyms TEXT[],
    antonyms TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.vocabulary_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vocabulary_id UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
    sentence_zh TEXT NOT NULL,
    sentence_pinyin TEXT NOT NULL,
    sentence_vn TEXT NOT NULL,
    sentence_en TEXT,
    audio_url TEXT,
    order_index INTEGER DEFAULT 1
);

-- 6. GRAMMAR TOPICS & EXAMPLES
CREATE TABLE IF NOT EXISTS public.grammar_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_vn TEXT NOT NULL,
    pattern TEXT NOT NULL,
    explanation_vn TEXT NOT NULL,
    usage_conditions TEXT,
    common_mistakes TEXT,
    comparison TEXT,
    search_keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.grammar_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grammar_id UUID NOT NULL REFERENCES public.grammar_topics(id) ON DELETE CASCADE,
    sentence_zh TEXT NOT NULL,
    sentence_pinyin TEXT NOT NULL,
    sentence_vn TEXT NOT NULL,
    analysis_notes TEXT,
    order_index INTEGER DEFAULT 1
);

-- 7. AUDIO MATERIALS & LISTENING EXERCISES
CREATE TABLE IF NOT EXISTS public.audio_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level),
    title TEXT NOT NULL,
    transcript_zh TEXT NOT NULL,
    transcript_pinyin TEXT NOT NULL,
    translation_vn TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.listening_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audio_id UUID REFERENCES public.audio_materials(id) ON DELETE CASCADE,
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level),
    exercise_type TEXT NOT NULL CHECK (exercise_type IN ('select_image', 'multiple_choice', 'dictation', 'fill_blank', 'sentence_order')),
    prompt_zh TEXT,
    prompt_audio_url TEXT,
    question TEXT NOT NULL,
    options JSONB, -- Array of string options or objects {label, text}
    correct_answer TEXT NOT NULL,
    explanation_vn TEXT,
    vocabulary_notes TEXT[],
    grammar_notes TEXT[]
);

-- 8. SPEAKING SCENARIOS
CREATE TABLE IF NOT EXISTS public.speaking_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level),
    topic_vn TEXT NOT NULL,
    title TEXT NOT NULL,
    role_ai TEXT NOT NULL,
    role_user TEXT NOT NULL,
    initial_ai_message TEXT NOT NULL,
    initial_pinyin TEXT NOT NULL,
    initial_meaning_vn TEXT NOT NULL,
    suggested_phrases JSONB,
    evaluation_criteria TEXT[]
);

-- 9. WRITING EXERCISES & STROKES
CREATE TABLE IF NOT EXISTS public.writing_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vocabulary_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE,
    character TEXT NOT NULL,
    pinyin TEXT NOT NULL,
    meaning_vn TEXT NOT NULL,
    stroke_count INTEGER NOT NULL,
    radicals TEXT[],
    stroke_order_data JSONB, -- HanziWriter vectors/strokes
    practice_mode TEXT NOT NULL DEFAULT 'trace' CHECK (practice_mode IN ('trace', 'memory', 'stroke_fill', 'meaning_to_char', 'dictation'))
);

CREATE TABLE IF NOT EXISTS public.writing_strokes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    writing_exercise_id UUID NOT NULL REFERENCES public.writing_exercises(id) ON DELETE CASCADE,
    stroke_index INTEGER NOT NULL,
    stroke_type TEXT NOT NULL, -- Diểm, Hoành, Thụ, Phẩy, Mác, Gập, Móc
    stroke_path TEXT NOT NULL
);

-- 10. MOCK EXAMS & QUESTIONS
CREATE TABLE IF NOT EXISTS public.exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level),
    section TEXT NOT NULL CHECK (section IN ('listening', 'reading', 'writing')),
    part_number INTEGER NOT NULL DEFAULT 1,
    question_number INTEGER NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('single_choice', 'true_false', 'matching', 'reorder', 'fill_blank', 'essay')),
    audio_url TEXT,
    image_url TEXT,
    prompt_zh TEXT,
    options JSONB,
    correct_answer TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 5,
    explanation_vn TEXT
);

CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level),
    score_listening NUMERIC(5,2) DEFAULT 0,
    score_reading NUMERIC(5,2) DEFAULT 0,
    score_writing NUMERIC(5,2) DEFAULT 0,
    total_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    is_passed BOOLEAN NOT NULL DEFAULT false,
    duration_seconds INTEGER NOT NULL,
    user_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    weak_areas JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. SPACED REPETITION SYSTEM (SM-2) FOR VOCABULARY
CREATE TABLE IF NOT EXISTS public.user_vocabulary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'learning' CHECK (status IN ('learning', 'known', 'difficult', 'mastered')),
    repetition_count INTEGER NOT NULL DEFAULT 0,
    interval_days INTEGER NOT NULL DEFAULT 0,
    ease_factor NUMERIC(3,2) NOT NULL DEFAULT 2.50,
    next_review_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_reviewed_at TIMESTAMPTZ,
    in_personal_notebook BOOLEAN NOT NULL DEFAULT false,
    personal_notes TEXT,
    UNIQUE(user_id, vocabulary_id)
);

CREATE TABLE IF NOT EXISTS public.vocabulary_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5), -- 0=blackout, 3=pass, 5=perfect
    response_time_ms INTEGER,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. LEARNING PROGRESS & STUDY SESSIONS
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    accuracy_percentage NUMERIC(5,2) DEFAULT 0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('flashcard', 'listening', 'speaking', 'writing', 'grammar', 'exam', 'ai_chat')),
    duration_minutes INTEGER NOT NULL,
    items_practiced INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. ACHIEVEMENTS & GAMIFICATION
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title_vn TEXT NOT NULL,
    description_vn TEXT NOT NULL,
    icon TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    category TEXT NOT NULL CHECK (category IN ('streak', 'vocab', 'exam', 'speaking', 'writing'))
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, achievement_id)
);

-- 14. AI TUTOR CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hsk_level INTEGER NOT NULL REFERENCES public.hsk_levels(level),
    title TEXT NOT NULL DEFAULT 'Hội thoại mới',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    pinyin TEXT,
    translation_vn TEXT,
    breakdown_json JSONB, -- Vocabulary & grammar breakdown
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- INDEXES FOR FAST QUERYING
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_vocab_level ON public.vocabulary(hsk_level);
CREATE INDEX IF NOT EXISTS idx_vocab_simplified ON public.vocabulary(simplified);
CREATE INDEX IF NOT EXISTS idx_vocab_pinyin_clean ON public.vocabulary(pinyin_clean);
CREATE INDEX IF NOT EXISTS idx_user_vocab_review ON public.user_vocabulary(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_grammar_level ON public.grammar_topics(hsk_level);
CREATE INDEX IF NOT EXISTS idx_exam_q_level_section ON public.exam_questions(hsk_level, section);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, created_at);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Read policies for public curriculum
ALTER TABLE public.hsk_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for curriculum" ON public.hsk_levels FOR SELECT USING (true);
CREATE POLICY "Public read access for courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public read access for units" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public read access for lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public read access for vocabulary" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Public read access for vocabulary_examples" ON public.vocabulary_examples FOR SELECT USING (true);
CREATE POLICY "Public read access for grammar_topics" ON public.grammar_topics FOR SELECT USING (true);
CREATE POLICY "Public read access for grammar_examples" ON public.grammar_examples FOR SELECT USING (true);
CREATE POLICY "Public read access for listening_exercises" ON public.listening_exercises FOR SELECT USING (true);
CREATE POLICY "Public read access for speaking_scenarios" ON public.speaking_scenarios FOR SELECT USING (true);
CREATE POLICY "Public read access for writing_exercises" ON public.writing_exercises FOR SELECT USING (true);
CREATE POLICY "Public read access for exam_questions" ON public.exam_questions FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own vocab SRS" ON public.user_vocabulary FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert vocab reviews" ON public.vocabulary_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own vocab reviews" ON public.vocabulary_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON public.learning_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own exam attempts" ON public.exam_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI messages" ON public.ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ai_conversations WHERE id = ai_messages.conversation_id AND user_id = auth.uid())
);
