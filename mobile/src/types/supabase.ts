export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            bookings: {
                Row: {
                    client_id: string
                    created_at: string | null
                    id: string
                    provider_id: string
                    scheduled_at: string
                    service_id: string | null
                    status: Database["public"]["Enums"]["booking_status"] | null
                    total_amount: number | null
                    updated_at: string | null
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    id?: string
                    provider_id: string
                    scheduled_at: string
                    service_id?: string | null
                    status?: Database["public"]["Enums"]["booking_status"] | null
                    total_amount?: number | null
                    updated_at?: string | null
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    id?: string
                    provider_id?: string
                    scheduled_at?: string
                    service_id?: string | null
                    status?: Database["public"]["Enums"]["booking_status"] | null
                    total_amount?: number | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "bookings_client_id_fkey"
                        columns: ["client_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "bookings_provider_id_fkey"
                        columns: ["provider_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "bookings_service_id_fkey"
                        columns: ["service_id"]
                        referencedRelation: "services"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    address: string | null
                    avatar_url: string | null
                    bio: string | null
                    created_at: string | null
                    full_name: string | null
                    id: string
                    phone: string | null
                    role: Database["public"]["Enums"]["user_role"] | null
                    updated_at: string | null
                }
                Insert: {
                    address?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id: string
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string | null
                }
                Update: {
                    address?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id?: string
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            reviews: {
                Row: {
                    booking_id: string
                    comment: string | null
                    created_at: string | null
                    id: string
                    provider_id: string
                    rating: number | null
                    reviewer_id: string
                }
                Insert: {
                    booking_id: string
                    comment?: string | null
                    created_at?: string | null
                    id?: string
                    provider_id: string
                    rating?: number | null
                    reviewer_id: string
                }
                Update: {
                    booking_id?: string
                    comment?: string | null
                    created_at?: string | null
                    id?: string
                    provider_id?: string
                    rating?: number | null
                    reviewer_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reviews_booking_id_fkey"
                        columns: ["booking_id"]
                        referencedRelation: "bookings"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reviews_provider_id_fkey"
                        columns: ["provider_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reviews_reviewer_id_fkey"
                        columns: ["reviewer_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            services: {
                Row: {
                    category: string
                    created_at: string | null
                    description: string | null
                    id: string
                    image_url: string | null
                    price: number
                    provider_id: string
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    category: string
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    price: number
                    provider_id: string
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    category?: string
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    price?: number
                    provider_id?: string
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "services_provider_id_fkey"
                        columns: ["provider_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            booking_status: "pending" | "accepted" | "completed" | "cancelled"
            user_role: "client" | "provider"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
