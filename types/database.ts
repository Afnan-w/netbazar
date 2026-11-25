export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductStatus = "available" | "unavailable" | "draft";

export type ProductRequestStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "paid"
  | "shipped"
  | "closed"
  | "cancelled";

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          slug: string;
          description: string;
          specifications: Json;
          price_bdt: number;
          reference_price_bdt: number | null;
          category_id: string | null;
          status: ProductStatus;
          is_featured: boolean;
          is_popular: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          slug: string;
          description?: string;
          specifications?: Json;
          price_bdt: number;
          reference_price_bdt?: number | null;
          category_id?: string | null;
          status?: ProductStatus;
          is_featured?: boolean;
          is_popular?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          name?: string;
          slug?: string;
          description?: string;
          specifications?: Json;
          price_bdt?: number;
          reference_price_bdt?: number | null;
          category_id?: string | null;
          status?: ProductStatus;
          is_featured?: boolean;
          is_popular?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          sort_order: number;
          alt: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          sort_order?: number;
          alt?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          sort_order?: number;
          alt?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_requests: {
        Row: {
          id: string;
          name: string;
          phone: string;
          address: string;
          description: string;
          product_link: string | null;
          quantity: number;
          budget_bdt: number | null;
          status: ProductRequestStatus;
          admin_notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          address: string;
          description: string;
          product_link?: string | null;
          quantity?: number;
          budget_bdt?: number | null;
          status?: ProductRequestStatus;
          admin_notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          address?: string;
          description?: string;
          product_link?: string | null;
          quantity?: number;
          budget_bdt?: number | null;
          status?: ProductRequestStatus;
          admin_notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          whatsapp_number: string;
          announcement_text: string;
          contact_email: string;
          facebook_url: string;
          instagram_url: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          whatsapp_number?: string;
          announcement_text?: string;
          contact_email?: string;
          facebook_url?: string;
          instagram_url?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          whatsapp_number?: string;
          announcement_text?: string;
          contact_email?: string;
          facebook_url?: string;
          instagram_url?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          user_id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      product_status: ProductStatus;
      product_request_status: ProductRequestStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type ProductRequest =
  Database["public"]["Tables"]["product_requests"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
