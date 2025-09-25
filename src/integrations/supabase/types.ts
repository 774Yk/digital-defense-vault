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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agent_kb_file_processing_jobs: {
        Row: {
          account_id: string
          agent_id: string
          completed_at: string | null
          created_at: string | null
          entries_created: number | null
          error_message: string | null
          job_id: string
          job_type: string
          result_info: Json | null
          source_info: Json
          started_at: string | null
          status: string | null
          total_files: number | null
        }
        Insert: {
          account_id: string
          agent_id: string
          completed_at?: string | null
          created_at?: string | null
          entries_created?: number | null
          error_message?: string | null
          job_id?: string
          job_type: string
          result_info?: Json | null
          source_info: Json
          started_at?: string | null
          status?: string | null
          total_files?: number | null
        }
        Update: {
          account_id?: string
          agent_id?: string
          completed_at?: string | null
          created_at?: string | null
          entries_created?: number | null
          error_message?: string | null
          job_id?: string
          job_type?: string
          result_info?: Json | null
          source_info?: Json
          started_at?: string | null
          status?: string | null
          total_files?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_kb_file_processing_jobs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      agent_knowledge_base_entries: {
        Row: {
          account_id: string
          agent_id: string
          content: string
          content_tokens: number | null
          created_at: string | null
          description: string | null
          entry_id: string
          extracted_from_zip_id: string | null
          file_mime_type: string | null
          file_path: string | null
          file_size: number | null
          is_active: boolean | null
          last_accessed_at: string | null
          name: string
          source_metadata: Json | null
          source_type: string | null
          updated_at: string | null
          usage_context: string | null
        }
        Insert: {
          account_id: string
          agent_id: string
          content: string
          content_tokens?: number | null
          created_at?: string | null
          description?: string | null
          entry_id?: string
          extracted_from_zip_id?: string | null
          file_mime_type?: string | null
          file_path?: string | null
          file_size?: number | null
          is_active?: boolean | null
          last_accessed_at?: string | null
          name: string
          source_metadata?: Json | null
          source_type?: string | null
          updated_at?: string | null
          usage_context?: string | null
        }
        Update: {
          account_id?: string
          agent_id?: string
          content?: string
          content_tokens?: number | null
          created_at?: string | null
          description?: string | null
          entry_id?: string
          extracted_from_zip_id?: string | null
          file_mime_type?: string | null
          file_path?: string | null
          file_size?: number | null
          is_active?: boolean | null
          last_accessed_at?: string | null
          name?: string
          source_metadata?: Json | null
          source_type?: string | null
          updated_at?: string | null
          usage_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_knowledge_base_entries_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_knowledge_base_entries_extracted_from_zip_id_fkey"
            columns: ["extracted_from_zip_id"]
            isOneToOne: false
            referencedRelation: "agent_knowledge_base_entries"
            referencedColumns: ["entry_id"]
          },
        ]
      }
      agent_knowledge_base_usage_log: {
        Row: {
          agent_id: string
          entry_id: string
          log_id: string
          tokens_used: number | null
          usage_type: string
          used_at: string | null
        }
        Insert: {
          agent_id: string
          entry_id: string
          log_id?: string
          tokens_used?: number | null
          usage_type: string
          used_at?: string | null
        }
        Update: {
          agent_id?: string
          entry_id?: string
          log_id?: string
          tokens_used?: number | null
          usage_type?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_knowledge_base_usage_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_knowledge_base_usage_log_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "agent_knowledge_base_entries"
            referencedColumns: ["entry_id"]
          },
        ]
      }
      agent_runs: {
        Row: {
          agent_id: string | null
          agent_version_id: string | null
          completed_at: string | null
          created_at: string
          error: string | null
          id: string
          metadata: Json | null
          started_at: string
          status: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          agent_version_id?: string | null
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
          thread_id: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          agent_version_id?: string | null
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_runs_agent_version_id_fkey"
            columns: ["agent_version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
            referencedColumns: ["version_id"]
          },
          {
            foreignKeyName: "agent_runs_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      agent_templates: {
        Row: {
          avatar: string | null
          avatar_color: string | null
          config: Json | null
          created_at: string | null
          creator_id: string
          description: string | null
          download_count: number | null
          icon_background: string | null
          icon_color: string | null
          icon_name: string | null
          is_kortix_team: boolean | null
          is_public: boolean | null
          marketplace_published_at: string | null
          metadata: Json | null
          name: string
          profile_image_url: string | null
          tags: string[] | null
          template_id: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          avatar_color?: string | null
          config?: Json | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          download_count?: number | null
          icon_background?: string | null
          icon_color?: string | null
          icon_name?: string | null
          is_kortix_team?: boolean | null
          is_public?: boolean | null
          marketplace_published_at?: string | null
          metadata?: Json | null
          name: string
          profile_image_url?: string | null
          tags?: string[] | null
          template_id?: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          avatar_color?: string | null
          config?: Json | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          download_count?: number | null
          icon_background?: string | null
          icon_color?: string | null
          icon_name?: string | null
          is_kortix_team?: boolean | null
          is_public?: boolean | null
          marketplace_published_at?: string | null
          metadata?: Json | null
          name?: string
          profile_image_url?: string | null
          tags?: string[] | null
          template_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_templates_backup: {
        Row: {
          agentpress_tools: Json | null
          avatar: string | null
          avatar_color: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          download_count: number | null
          is_kortix_team: boolean | null
          is_public: boolean | null
          marketplace_published_at: string | null
          mcp_requirements: Json | null
          metadata: Json | null
          name: string | null
          system_prompt: string | null
          tags: string[] | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          agentpress_tools?: Json | null
          avatar?: string | null
          avatar_color?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          is_kortix_team?: boolean | null
          is_public?: boolean | null
          marketplace_published_at?: string | null
          mcp_requirements?: Json | null
          metadata?: Json | null
          name?: string | null
          system_prompt?: string | null
          tags?: string[] | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agentpress_tools?: Json | null
          avatar?: string | null
          avatar_color?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          is_kortix_team?: boolean | null
          is_public?: boolean | null
          marketplace_published_at?: string | null
          mcp_requirements?: Json | null
          metadata?: Json | null
          name?: string | null
          system_prompt?: string | null
          tags?: string[] | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_triggers: {
        Row: {
          agent_id: string
          config: Json
          created_at: string | null
          description: string | null
          execution_type: string | null
          is_active: boolean | null
          name: string
          trigger_id: string
          trigger_type: Database["public"]["Enums"]["agent_trigger_type"]
          updated_at: string | null
          workflow_id: string | null
        }
        Insert: {
          agent_id: string
          config?: Json
          created_at?: string | null
          description?: string | null
          execution_type?: string | null
          is_active?: boolean | null
          name: string
          trigger_id?: string
          trigger_type: Database["public"]["Enums"]["agent_trigger_type"]
          updated_at?: string | null
          workflow_id?: string | null
        }
        Update: {
          agent_id?: string
          config?: Json
          created_at?: string | null
          description?: string | null
          execution_type?: string | null
          is_active?: boolean | null
          name?: string
          trigger_id?: string
          trigger_type?: Database["public"]["Enums"]["agent_trigger_type"]
          updated_at?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_triggers_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_triggers_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "agent_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_versions: {
        Row: {
          agent_id: string
          change_description: string | null
          config: Json
          created_at: string | null
          created_by: string | null
          is_active: boolean | null
          previous_version_id: string | null
          updated_at: string | null
          version_id: string
          version_name: string
          version_number: number
        }
        Insert: {
          agent_id: string
          change_description?: string | null
          config?: Json
          created_at?: string | null
          created_by?: string | null
          is_active?: boolean | null
          previous_version_id?: string | null
          updated_at?: string | null
          version_id?: string
          version_name: string
          version_number: number
        }
        Update: {
          agent_id?: string
          change_description?: string | null
          config?: Json
          created_at?: string | null
          created_by?: string | null
          is_active?: boolean | null
          previous_version_id?: string | null
          updated_at?: string | null
          version_id?: string
          version_name?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_versions_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
            referencedColumns: ["version_id"]
          },
        ]
      }
      agent_workflows: {
        Row: {
          agent_id: string
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          status: Database["public"]["Enums"]["agent_workflow_status"] | null
          steps: Json | null
          trigger_phrase: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          status?: Database["public"]["Enums"]["agent_workflow_status"] | null
          steps?: Json | null
          trigger_phrase?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          status?: Database["public"]["Enums"]["agent_workflow_status"] | null
          steps?: Json | null
          trigger_phrase?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_workflows_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      agents: {
        Row: {
          account_id: string
          agent_id: string
          avatar: string | null
          avatar_color: string | null
          created_at: string | null
          current_version_id: string | null
          description: string | null
          icon_background: string | null
          icon_color: string | null
          icon_name: string | null
          is_default: boolean | null
          is_public: boolean | null
          metadata: Json | null
          name: string
          profile_image_url: string | null
          tags: string[] | null
          updated_at: string | null
          version_count: number | null
        }
        Insert: {
          account_id: string
          agent_id?: string
          avatar?: string | null
          avatar_color?: string | null
          created_at?: string | null
          current_version_id?: string | null
          description?: string | null
          icon_background?: string | null
          icon_color?: string | null
          icon_name?: string | null
          is_default?: boolean | null
          is_public?: boolean | null
          metadata?: Json | null
          name: string
          profile_image_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          version_count?: number | null
        }
        Update: {
          account_id?: string
          agent_id?: string
          avatar?: string | null
          avatar_color?: string | null
          created_at?: string | null
          current_version_id?: string | null
          description?: string | null
          icon_background?: string | null
          icon_color?: string | null
          icon_name?: string | null
          is_default?: boolean | null
          is_public?: boolean | null
          metadata?: Json | null
          name?: string
          profile_image_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          version_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_current_version_id_fkey"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
            referencedColumns: ["version_id"]
          },
        ]
      }
      agents_backup_cleanup_20250729: {
        Row: {
          account_id: string | null
          agent_id: string | null
          avatar: string | null
          avatar_color: string | null
          config: Json | null
          created_at: string | null
          current_version_id: string | null
          description: string | null
          download_count: number | null
          is_default: boolean | null
          is_public: boolean | null
          marketplace_published_at: string | null
          metadata: Json | null
          name: string | null
          tags: string[] | null
          updated_at: string | null
          version_count: number | null
        }
        Insert: {
          account_id?: string | null
          agent_id?: string | null
          avatar?: string | null
          avatar_color?: string | null
          config?: Json | null
          created_at?: string | null
          current_version_id?: string | null
          description?: string | null
          download_count?: number | null
          is_default?: boolean | null
          is_public?: boolean | null
          marketplace_published_at?: string | null
          metadata?: Json | null
          name?: string | null
          tags?: string[] | null
          updated_at?: string | null
          version_count?: number | null
        }
        Update: {
          account_id?: string | null
          agent_id?: string | null
          avatar?: string | null
          avatar_color?: string | null
          config?: Json | null
          created_at?: string | null
          current_version_id?: string | null
          description?: string | null
          download_count?: number | null
          is_default?: boolean | null
          is_public?: boolean | null
          marketplace_published_at?: string | null
          metadata?: Json | null
          name?: string | null
          tags?: string[] | null
          updated_at?: string | null
          version_count?: number | null
        }
        Relationships: []
      }
      api_data_cache: {
        Row: {
          cache_key: string
          created_at: string | null
          endpoint_id: string | null
          expires_at: string
          id: string
          response_data: Json
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          endpoint_id?: string | null
          expires_at: string
          id?: string
          response_data: Json
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          endpoint_id?: string | null
          expires_at?: string
          id?: string
          response_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "api_data_cache_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "api_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      api_endpoints: {
        Row: {
          cache_duration: number | null
          created_at: string | null
          endpoint_path: string
          http_method: string | null
          id: string
          integration_id: string | null
          is_active: boolean | null
          metadata: Json | null
          name: string
          request_params: Json | null
          response_format: string | null
          updated_at: string | null
        }
        Insert: {
          cache_duration?: number | null
          created_at?: string | null
          endpoint_path: string
          http_method?: string | null
          id?: string
          integration_id?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          request_params?: Json | null
          response_format?: string | null
          updated_at?: string | null
        }
        Update: {
          cache_duration?: number | null
          created_at?: string | null
          endpoint_path?: string
          http_method?: string | null
          id?: string
          integration_id?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          request_params?: Json | null
          response_format?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_endpoints_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "api_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      api_integrations: {
        Row: {
          auth_config: Json | null
          auth_type: string | null
          base_url: string
          created_at: string | null
          created_by: string | null
          description: string | null
          headers: Json | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          auth_config?: Json | null
          auth_type?: string | null
          base_url: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          auth_config?: Json | null
          auth_type?: string | null
          base_url?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          account_id: string
          created_at: string | null
          description: string | null
          expires_at: string | null
          key_id: string
          last_used_at: string | null
          public_key: string
          secret_key_hash: string
          status: Database["public"]["Enums"]["api_key_status"] | null
          title: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          key_id?: string
          last_used_at?: string | null
          public_key: string
          secret_key_hash: string
          status?: Database["public"]["Enums"]["api_key_status"] | null
          title: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          key_id?: string
          last_used_at?: string | null
          public_key?: string
          secret_key_hash?: string
          status?: Database["public"]["Enums"]["api_key_status"] | null
          title?: string
        }
        Relationships: []
      }
      api_usage_logs: {
        Row: {
          created_at: string | null
          created_by: string | null
          endpoint_id: string | null
          error_message: string | null
          id: string
          integration_id: string | null
          request_url: string | null
          response_status: number | null
          response_time_ms: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          endpoint_id?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string | null
          request_url?: string | null
          response_status?: number | null
          response_time_ms?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          endpoint_id?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string | null
          request_url?: string | null
          response_status?: number | null
          response_time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "api_endpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "api_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_balance: {
        Row: {
          balance_dollars: number
          last_updated: string | null
          metadata: Json | null
          total_purchased: number
          total_used: number
          user_id: string
        }
        Insert: {
          balance_dollars?: number
          last_updated?: string | null
          metadata?: Json | null
          total_purchased?: number
          total_used?: number
          user_id: string
        }
        Update: {
          balance_dollars?: number
          last_updated?: string | null
          metadata?: Json | null
          total_purchased?: number
          total_used?: number
          user_id?: string
        }
        Relationships: []
      }
      credit_purchases: {
        Row: {
          amount_dollars: number
          completed_at: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount_dollars: number
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount_dollars?: number
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      credit_usage: {
        Row: {
          amount_dollars: number
          created_at: string | null
          description: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          subscription_tier: string | null
          thread_id: string | null
          usage_type: string | null
          user_id: string
        }
        Insert: {
          amount_dollars: number
          created_at?: string | null
          description?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          subscription_tier?: string | null
          thread_id?: string | null
          usage_type?: string | null
          user_id: string
        }
        Update: {
          amount_dollars?: number
          created_at?: string | null
          description?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          subscription_tier?: string | null
          thread_id?: string | null
          usage_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_usage_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "credit_usage_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          account_id: string
          agent_id: string | null
          bucket_name: string
          content_type: string | null
          created_at: string | null
          file_size: number
          id: string
          metadata: Json | null
          original_filename: string
          project_id: string | null
          signed_url: string | null
          storage_path: string
          thread_id: string | null
          updated_at: string | null
          url_expires_at: string | null
          user_id: string | null
        }
        Insert: {
          account_id: string
          agent_id?: string | null
          bucket_name: string
          content_type?: string | null
          created_at?: string | null
          file_size: number
          id?: string
          metadata?: Json | null
          original_filename: string
          project_id?: string | null
          signed_url?: string | null
          storage_path: string
          thread_id?: string | null
          updated_at?: string | null
          url_expires_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_id?: string
          agent_id?: string | null
          bucket_name?: string
          content_type?: string | null
          created_at?: string | null
          file_size?: number
          id?: string
          metadata?: Json | null
          original_filename?: string
          project_id?: string | null
          signed_url?: string | null
          storage_path?: string
          thread_id?: string | null
          updated_at?: string | null
          url_expires_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "file_uploads_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      messages: {
        Row: {
          agent_id: string | null
          agent_version_id: string | null
          content: Json
          created_at: string
          is_llm_message: boolean
          message_id: string
          metadata: Json | null
          thread_id: string
          type: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          agent_version_id?: string | null
          content: Json
          created_at?: string
          is_llm_message?: boolean
          message_id?: string
          metadata?: Json | null
          thread_id: string
          type: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          agent_version_id?: string | null
          content?: Json
          created_at?: string
          is_llm_message?: boolean
          message_id?: string
          metadata?: Json | null
          thread_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "messages_agent_version_id_fkey"
            columns: ["agent_version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
            referencedColumns: ["version_id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      projects: {
        Row: {
          account_id: string
          created_at: string
          description: string | null
          is_public: boolean | null
          name: string
          project_id: string
          sandbox: Json | null
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          description?: string | null
          is_public?: boolean | null
          name: string
          project_id?: string
          sandbox?: Json | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          description?: string | null
          is_public?: boolean | null
          name?: string
          project_id?: string
          sandbox?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      template_share_links: {
        Row: {
          created_at: string | null
          created_by: string
          last_viewed_at: string | null
          metadata: Json | null
          share_id: string
          template_id: string
          views_count: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          last_viewed_at?: string | null
          metadata?: Json | null
          share_id: string
          template_id: string
          views_count?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          last_viewed_at?: string | null
          metadata?: Json | null
          share_id?: string
          template_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_share_links_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "agent_templates"
            referencedColumns: ["template_id"]
          },
        ]
      }
      threads: {
        Row: {
          account_id: string | null
          created_at: string
          is_public: boolean | null
          metadata: Json | null
          project_id: string | null
          thread_id: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          is_public?: boolean | null
          metadata?: Json | null
          project_id?: string | null
          thread_id?: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          is_public?: boolean | null
          metadata?: Json | null
          project_id?: string | null
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      user_mcp_credential_profiles: {
        Row: {
          account_id: string
          config_hash: string
          created_at: string | null
          display_name: string
          encrypted_config: string
          is_active: boolean | null
          is_default: boolean | null
          last_used_at: string | null
          mcp_qualified_name: string
          profile_id: string
          profile_name: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          config_hash: string
          created_at?: string | null
          display_name: string
          encrypted_config: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          mcp_qualified_name: string
          profile_id?: string
          profile_name: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          config_hash?: string
          created_at?: string | null
          display_name?: string
          encrypted_config?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          mcp_qualified_name?: string
          profile_id?: string
          profile_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { lookup_invitation_token: string }
        Returns: Json
      }
      add_agent_to_library: {
        Args: { p_original_agent_id: string; p_user_account_id: string }
        Returns: string
      }
      add_credits: {
        Args: { p_amount: number; p_purchase_id?: string; p_user_id: string }
        Returns: number
      }
      count_suna_agents_by_version: {
        Args: { p_version: string }
        Returns: number
      }
      create_account: {
        Args: { name?: string; slug?: string }
        Returns: Json
      }
      create_agent_kb_processing_job: {
        Args: {
          p_account_id: string
          p_agent_id: string
          p_job_type: string
          p_source_info: Json
        }
        Returns: string
      }
      create_agent_version: {
        Args: {
          p_agent_id: string
          p_agentpress_tools?: Json
          p_configured_mcps?: Json
          p_created_by?: string
          p_custom_mcps?: Json
          p_system_prompt: string
        }
        Returns: string
      }
      create_invitation: {
        Args: {
          account_id: string
          account_role: "owner" | "member"
          invitation_type: "one_time" | "24_hour"
        }
        Returns: Json
      }
      create_template_from_agent: {
        Args: { p_agent_id: string; p_creator_id: string }
        Returns: string
      }
      current_user_account_role: {
        Args: { account_id: string }
        Returns: Json
      }
      delete_invitation: {
        Args: { invitation_id: string }
        Returns: undefined
      }
      find_suna_agents_needing_update: {
        Args: { p_target_version: string }
        Returns: {
          account_id: string
          agent_id: string
          current_version: string
          last_central_update: string
          name: string
        }[]
      }
      find_suna_default_agent_for_account: {
        Args: { p_account_id: string }
        Returns: {
          account_id: string
          agent_id: string
          agentpress_tools: Json
          avatar: string
          avatar_color: string
          configured_mcps: Json
          created_at: string
          current_version_id: string
          custom_mcps: Json
          description: string
          download_count: number
          is_active: boolean
          is_default: boolean
          is_public: boolean
          marketplace_published_at: string
          metadata: Json
          name: string
          system_prompt: string
          tags: string[]
          updated_at: string
          version_count: number
        }[]
      }
      get_account: {
        Args: { account_id: string }
        Returns: Json
      }
      get_account_billing_status: {
        Args: { account_id: string }
        Returns: Json
      }
      get_account_by_slug: {
        Args: { slug: string }
        Returns: Json
      }
      get_account_id: {
        Args: { slug: string }
        Returns: string
      }
      get_account_invitations: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_account_members: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_accounts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_agent_config: {
        Args: { p_agent_id: string }
        Returns: Json
      }
      get_agent_kb_processing_jobs: {
        Args: { p_agent_id: string; p_limit?: number }
        Returns: {
          completed_at: string
          created_at: string
          entries_created: number
          error_message: string
          job_id: string
          job_type: string
          result_info: Json
          source_info: Json
          status: string
          total_files: number
        }[]
      }
      get_agent_knowledge_base: {
        Args: { p_agent_id: string; p_include_inactive?: boolean }
        Returns: {
          content: string
          content_tokens: number
          created_at: string
          description: string
          entry_id: string
          is_active: boolean
          name: string
          updated_at: string
          usage_context: string
        }[]
      }
      get_agent_knowledge_base_context: {
        Args: { p_agent_id: string }
        Returns: string
      }
      get_agent_restrictions: {
        Args: { agent_row: Database["public"]["Tables"]["agents"]["Row"] }
        Returns: Json
      }
      get_agent_version_config: {
        Args: { p_version_id: string }
        Returns: Json
      }
      get_all_suna_default_agents: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_id: string
          agent_id: string
          agentpress_tools: Json
          avatar: string
          avatar_color: string
          centrally_managed: boolean
          configured_mcps: Json
          created_at: string
          custom_mcps: Json
          description: string
          is_active: boolean
          is_default: boolean
          management_version: string
          metadata: Json
          name: string
          system_prompt: string
          updated_at: string
        }[]
      }
      get_credit_balance: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_llm_formatted_messages: {
        Args: { p_thread_id: string }
        Returns: Json
      }
      get_marketplace_agents: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_tags?: string[]
        }
        Returns: {
          agent_id: string
          agentpress_tools: Json
          avatar: string
          avatar_color: string
          configured_mcps: Json
          created_at: string
          creator_name: string
          description: string
          download_count: number
          marketplace_published_at: string
          name: string
          system_prompt: string
          tags: string[]
        }[]
      }
      get_missing_credentials_for_template: {
        Args: { p_account_id: string; p_template_id: string }
        Returns: {
          display_name: string
          qualified_name: string
          required_config: string[]
        }[]
      }
      get_personal_account: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_suna_default_agent_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_agents: number
          creation_dates: Json
          inactive_agents: number
          total_agents: number
          version_distribution: Json
        }[]
      }
      get_thread_knowledge_base: {
        Args: { p_include_inactive?: boolean; p_thread_id: string }
        Returns: {
          content: string
          created_at: string
          description: string
          entry_id: string
          is_active: boolean
          name: string
          usage_context: string
        }[]
      }
      get_user_account_by_email: {
        Args: { email_input: string }
        Returns: Json
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_template_download_count: {
        Args: { template_id_param: string }
        Returns: undefined
      }
      install_template_as_instance: {
        Args: {
          p_account_id: string
          p_instance_name?: string
          p_template_id: string
        }
        Returns: string
      }
      is_centrally_managed_agent: {
        Args: { agent_row: Database["public"]["Tables"]["agents"]["Row"] }
        Returns: boolean
      }
      is_suna_default_agent: {
        Args: { agent_row: Database["public"]["Tables"]["agents"]["Row"] }
        Returns: boolean
      }
      lookup_invitation: {
        Args: { lookup_invitation_token: string }
        Returns: Json
      }
      migrate_agents_to_versioned: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      publish_agent_to_marketplace: {
        Args: { p_agent_id: string }
        Returns: undefined
      }
      remove_account_member: {
        Args: { account_id: string; user_id: string }
        Returns: undefined
      }
      sanitize_config_for_template: {
        Args: { input_config: Json }
        Returns: Json
      }
      schedule_trigger_http: {
        Args: {
          body?: Json
          headers?: Json
          job_name: string
          schedule: string
          timeout_ms?: number
          url: string
        }
        Returns: number
      }
      service_role_upsert_customer_subscription: {
        Args: { account_id: string; customer?: Json; subscription?: Json }
        Returns: undefined
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      switch_agent_version: {
        Args: {
          p_agent_id: string
          p_changed_by?: string
          p_version_id: string
        }
        Returns: undefined
      }
      unpublish_agent_from_marketplace: {
        Args: { p_agent_id: string }
        Returns: undefined
      }
      unschedule_job_by_name: {
        Args: { job_name: string }
        Returns: undefined
      }
      update_account: {
        Args: {
          account_id: string
          name?: string
          public_metadata?: Json
          replace_metadata?: boolean
          slug?: string
        }
        Returns: Json
      }
      update_account_user_role: {
        Args: {
          account_id: string
          make_primary_owner?: boolean
          new_account_role: "owner" | "member"
          user_id: string
        }
        Returns: undefined
      }
      update_agent_kb_job_status: {
        Args: {
          p_entries_created?: number
          p_error_message?: string
          p_job_id: string
          p_result_info?: Json
          p_status: string
          p_total_files?: number
        }
        Returns: undefined
      }
      use_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_message_id?: string
          p_thread_id?: string
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      agent_trigger_type:
        | "telegram"
        | "slack"
        | "webhook"
        | "schedule"
        | "email"
        | "github"
        | "discord"
        | "teams"
      agent_workflow_status: "draft" | "active" | "paused" | "archived"
      api_key_status: "active" | "revoked" | "expired"
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
      agent_trigger_type: [
        "telegram",
        "slack",
        "webhook",
        "schedule",
        "email",
        "github",
        "discord",
        "teams",
      ],
      agent_workflow_status: ["draft", "active", "paused", "archived"],
      api_key_status: ["active", "revoked", "expired"],
    },
  },
} as const
