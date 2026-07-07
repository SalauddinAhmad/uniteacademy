export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          course_id: string
          due_at: string | null
          id: string
          is_published: boolean
          published_at: string
          title: string
        }
        Insert: {
          course_id: string
          due_at?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          title: string
        }
        Update: {
          course_id?: string
          due_at?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_teachers: {
        Row: {
          avatar_url: string | null
          course_id: string
          id: string
          initials: string
          name: string
          sort: number
        }
        Insert: {
          avatar_url?: string | null
          course_id: string
          id?: string
          initials: string
          name: string
          sort?: number
        }
        Update: {
          avatar_url?: string | null
          course_id?: string
          id?: string
          initials?: string
          name?: string
          sort?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_teachers_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: Database["public"]["Enums"]["course_category"]
          cover_url: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_published: boolean
          slug: string
          title_bn: string
          title_en: string | null
          type: Database["public"]["Enums"]["course_type"]
        }
        Insert: {
          category?: Database["public"]["Enums"]["course_category"]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_published?: boolean
          slug: string
          title_bn: string
          title_en?: string | null
          type?: Database["public"]["Enums"]["course_type"]
        }
        Update: {
          category?: Database["public"]["Enums"]["course_category"]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_published?: boolean
          slug?: string
          title_bn?: string
          title_en?: string | null
          type?: Database["public"]["Enums"]["course_type"]
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string | null
          enrolled_at: string
          id: string
          is_behind: boolean
          program_id: string | null
          user_id: string
        }
        Insert: {
          course_id?: string | null
          enrolled_at?: string
          id?: string
          is_behind?: boolean
          program_id?: string | null
          user_id: string
        }
        Update: {
          course_id?: string | null
          enrolled_at?: string
          id?: string
          is_behind?: boolean
          program_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
          watched_seconds: number
        }
        Insert: {
          completed?: boolean
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
          watched_seconds?: number
        }
        Update: {
          completed?: boolean
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
          watched_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          course_id: string
          duration_minutes: number
          id: string
          sort: number
          title_bn: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          duration_minutes?: number
          id?: string
          sort?: number
          title_bn: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          duration_minutes?: number
          id?: string
          sort?: number
          title_bn?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          joined_at: string
          locale: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          joined_at?: string
          locale?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          joined_at?: string
          locale?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      program_courses: {
        Row: {
          course_id: string
          id: string
          program_id: string
          semester_id: string
          sort: number
        }
        Insert: {
          course_id: string
          id?: string
          program_id: string
          semester_id: string
          sort?: number
        }
        Update: {
          course_id?: string
          id?: string
          program_id?: string
          semester_id?: string
          sort?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_courses_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_courses_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          batch_label: string | null
          cover_url: string | null
          created_at: string
          ends_at: string | null
          id: string
          is_published: boolean
          slug: string
          starts_at: string | null
          title_bn: string
          title_en: string | null
        }
        Insert: {
          batch_label?: string | null
          cover_url?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          is_published?: boolean
          slug: string
          starts_at?: string | null
          title_bn: string
          title_en?: string | null
        }
        Update: {
          batch_label?: string | null
          cover_url?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          starts_at?: string | null
          title_bn?: string
          title_en?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          completed_at: string
          course_id: string
          id: string
          score: number
          total: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          course_id: string
          id?: string
          score?: number
          total?: number
          user_id: string
        }
        Update: {
          completed_at?: string
          course_id?: string
          id?: string
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          ends_on: string | null
          id: string
          is_locked: boolean
          label: string
          program_id: string
          sort: number
          starts_on: string | null
        }
        Insert: {
          ends_on?: string | null
          id?: string
          is_locked?: boolean
          label: string
          program_id: string
          sort?: number
          starts_on?: string | null
        }
        Update: {
          ends_on?: string | null
          id?: string
          is_locked?: boolean
          label?: string
          program_id?: string
          sort?: number
          starts_on?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "semesters_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
      course_category: "diploma" | "talimul_quran" | "free" | "teacher_training"
      course_type: "live" | "recorded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student"],
      course_category: ["diploma", "talimul_quran", "free", "teacher_training"],
      course_type: ["live", "recorded"],
    },
  },
} as const
