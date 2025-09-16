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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          cover_image_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_published: boolean
          language: string
          level: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_published?: boolean
          language?: string
          level: string
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_published?: boolean
          language?: string
          level?: string
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dos_articles: {
        Row: {
          content_html: string | null
          created_at: string
          created_by: string
          id: string
          legal_note_html: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content_html?: string | null
          created_at?: string
          created_by: string
          id?: string
          legal_note_html?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content_html?: string | null
          created_at?: string
          created_by?: string
          id?: string
          legal_note_html?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          created_at: string
          file_size: number | null
          filename: string
          id: string
          is_active: boolean
          mime_type: string | null
          source: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          filename: string
          id?: string
          is_active?: boolean
          mime_type?: string | null
          source: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          filename?: string
          id?: string
          is_active?: boolean
          mime_type?: string | null
          source?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content_html: string | null
          course_id: string
          created_at: string
          id: string
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content_html?: string | null
          course_id: string
          created_at?: string
          id?: string
          order_index?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content_html?: string | null
          course_id?: string
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
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
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_login: string | null
          name: string | null
          role: string
          two_fa_secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          name?: string | null
          role?: string
          two_fa_secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          name?: string | null
          role?: string
          two_fa_secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          contact_email: string
          default_language: string
          download_policy: boolean
          id: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          site_title: string
          social_links: Json | null
          updated_at: string
        }
        Insert: {
          contact_email?: string
          default_language?: string
          download_policy?: boolean
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          site_title?: string
          social_links?: Json | null
          updated_at?: string
        }
        Update: {
          contact_email?: string
          default_language?: string
          download_policy?: boolean
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          site_title?: string
          social_links?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          github_repo_url: string | null
          id: string
          is_downloadable: boolean
          name: string
          slug: string
          source_type: string
          tags: string[] | null
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          github_repo_url?: string | null
          id?: string
          is_downloadable?: boolean
          name: string
          slug: string
          source_type: string
          tags?: string[] | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          github_repo_url?: string | null
          id?: string
          is_downloadable?: boolean
          name?: string
          slug?: string
          source_type?: string
          tags?: string[] | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      vulnerabilities: {
        Row: {
          created_at: string
          created_by: string
          description_html: string | null
          id: string
          proof_of_concept_html: string | null
          remediation_html: string | null
          severity: string
          slug: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description_html?: string | null
          id?: string
          proof_of_concept_html?: string | null
          remediation_html?: string | null
          severity: string
          slug: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description_html?: string | null
          id?: string
          proof_of_concept_html?: string | null
          remediation_html?: string | null
          severity?: string
          slug?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      "Wep-login": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_emails: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          id: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      promote_user_role: {
        Args: { new_role: string; target_email: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
