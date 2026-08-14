-- ============================================================================
-- CÙNG CON TRƯỞNG THÀNH - HỆ THỐNG QUẢN LÝ LỚP HỌC TIỂU HỌC (SUPABASE DB SCHEMA)
-- Compatible with Supabase PostgreSQL, Realtime & Row Level Security (RLS)
-- ============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLE: profiles
-- Stores system user accounts linked to Supabase Auth (auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    avatar_url TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. TABLE: classes
-- Stores Homeroom Classes (Lớp chủ nhiệm Grade 1 to 5)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                             -- e.g. "Lớp 3A1"
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    academic_year TEXT NOT NULL,                     -- e.g. "2025-2026"
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    join_code TEXT UNIQUE NOT NULL,                 -- e.g. "L3A1-8899"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. TABLE: class_students
-- Junction mapping students to classes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_code TEXT NOT NULL,                     -- e.g. "HS2026-001"
    nickname TEXT DEFAULT '',                        -- Friendly nickname, e.g. "Bé Bông"
    avatar_color TEXT DEFAULT '#10B981',             -- Friendly avatar badge color
    seat_number INT DEFAULT 1,                       -- Seating layout position
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 4. TABLE: parent_student_links
-- Links Parent accounts to Student accounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parent_student_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL DEFAULT 'Phụ huynh', -- e.g. "Bố", "Mẹ", "Ông", "Bà"
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 5. TABLE: attendance
-- Daily attendance entries recorded by Teacher
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'late', 'excused', 'unexcused')),
    note TEXT DEFAULT '',
    recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id, date)
);

-- ----------------------------------------------------------------------------
-- 6. TABLE: reward_points
-- Gamification Star Points ("Tích điểm mẹ vui" & Classroom rewards)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reward_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    points INT NOT NULL CHECK (points <> 0),
    category TEXT NOT NULL CHECK (category IN ('academic', 'behavior', 'home_chore', 'custom')),
    reason TEXT NOT NULL,                            -- e.g. "Phát biểu hăng hái", "Tự giác quét nhà"
    awarded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. TABLE: co_oi_messages
-- Secret 1-1 Confession & Support box between Student and Homeroom Teacher
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.co_oi_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    emotion_tag TEXT NOT NULL DEFAULT 'Vui' CHECK (emotion_tag IN ('Vui', 'Buồn', 'Lo lắng', 'Bị bạn trêu', 'Cần cô giúp')),
    message_text TEXT NOT NULL,
    teacher_reply TEXT DEFAULT '',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    replied_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 8. TABLE: chat_messages
-- 1-1 Chat & Announcements between Teacher and Parents
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL if class announcement
    type TEXT NOT NULL CHECK (type IN ('announcement', 'direct')),
    content TEXT NOT NULL,
    media_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. TABLE: class_diary
-- Moments Feed / Timeline of class activities
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_diary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. TABLE: interactive_tools
-- Lucky Wheel, Secret Box, Quiz embeds, HTML5 games configuration
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interactive_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    tool_type TEXT NOT NULL CHECK (tool_type IN ('wheel', 'box', 'iframe', 'html5')),
    config_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_students_class ON public.class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON public.class_students(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON public.parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON public.parent_student_links(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_lookup ON public.attendance(class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_reward_points_student ON public.reward_points(student_id);
CREATE INDEX IF NOT EXISTS idx_co_oi_student ON public.co_oi_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_co_oi_teacher ON public.co_oi_messages(teacher_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_class ON public.chat_messages(class_id);
CREATE INDEX IF NOT EXISTS idx_class_diary_class ON public.class_diary(class_id);

-- ============================================================================
-- AUTOMATED USER PROFILE TRIGGER ON AUTH SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url, phone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Thành viên mới'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'teacher'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all 10 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_oi_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_tools ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Allow public read access to profiles for authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- CLASSES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Teachers can view & edit their own classes"
    ON public.classes FOR ALL
    TO authenticated
    USING (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Students and Parents can view their assigned class"
    ON public.classes FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.class_students cs
            WHERE cs.class_id = public.classes.id
              AND (cs.student_id = auth.uid() OR EXISTS (
                  SELECT 1 FROM public.parent_student_links psl
                  WHERE psl.student_id = cs.student_id AND psl.parent_id = auth.uid()
              ))
        )
    );

-- ----------------------------------------------------------------------------
-- CLASS_STUDENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Teachers can manage students in their class"
    ON public.class_students FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = public.class_students.class_id AND c.teacher_id = auth.uid()
        ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Students and linked parents can view class students"
    ON public.class_students FOR SELECT
    TO authenticated
    USING (true);

-- ----------------------------------------------------------------------------
-- PARENT_STUDENT_LINKS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Parents and Teachers can view parent student links"
    ON public.parent_student_links FOR SELECT
    TO authenticated
    USING (parent_id = auth.uid() OR student_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    ));

CREATE POLICY "Parents can insert pending link requests"
    ON public.parent_student_links FOR INSERT
    TO authenticated
    WITH CHECK (parent_id = auth.uid());

-- ----------------------------------------------------------------------------
-- ATTENDANCE POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Teachers can record and manage attendance"
    ON public.attendance FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = public.attendance.class_id AND c.teacher_id = auth.uid()
        ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Parents and Students can view attendance"
    ON public.attendance FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.parent_student_links psl
            WHERE psl.student_id = public.attendance.student_id AND psl.parent_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- REWARD_POINTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Teachers can grant and manage rewards"
    ON public.reward_points FOR ALL
    TO authenticated
    USING (
        awarded_by = auth.uid() OR EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = public.reward_points.class_id AND c.teacher_id = auth.uid()
        ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Parents can create home chore reward requests"
    ON public.reward_points FOR INSERT
    TO authenticated
    WITH CHECK (
        category = 'home_chore' AND EXISTS (
            SELECT 1 FROM public.parent_student_links psl
            WHERE psl.student_id = public.reward_points.student_id AND psl.parent_id = auth.uid()
        )
    );

CREATE POLICY "Students and Parents can view reward points"
    ON public.reward_points FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.parent_student_links psl
            WHERE psl.student_id = public.reward_points.student_id AND psl.parent_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- CO_OI_MESSAGES POLICIES (CONFIDENTIAL 1-1 STUDENT & TEACHER)
-- ----------------------------------------------------------------------------
CREATE POLICY "Students can send and view their own secret messages"
    ON public.co_oi_messages FOR ALL
    TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Homeroom Teachers can view and reply to secret messages"
    ON public.co_oi_messages FOR ALL
    TO authenticated
    USING (teacher_id = auth.uid());

-- ----------------------------------------------------------------------------
-- CHAT_MESSAGES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Class members can read announcements and direct messages"
    ON public.chat_messages FOR SELECT
    TO authenticated
    USING (
        receiver_id IS NULL OR sender_id = auth.uid() OR receiver_id = auth.uid()
    );

CREATE POLICY "Authenticated users can post chat messages"
    ON public.chat_messages FOR INSERT
    TO authenticated
    WITH CHECK (sender_id = auth.uid());

-- ----------------------------------------------------------------------------
-- CLASS_DIARY POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Class members can view diary posts"
    ON public.class_diary FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Teachers can create and manage diary posts"
    ON public.class_diary FOR ALL
    TO authenticated
    USING (
        author_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

-- ----------------------------------------------------------------------------
-- INTERACTIVE_TOOLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Class members can view interactive tools"
    ON public.interactive_tools FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Teachers can create and edit interactive tools"
    ON public.interactive_tools FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = public.interactive_tools.class_id AND c.teacher_id = auth.uid()
        ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- END OF SCHEMA.SQL
-- ============================================================================
