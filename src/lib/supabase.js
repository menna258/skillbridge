import { createClient } from '@supabase/supabase-js'

// Values come from .env (see .env.example). The publishable key is safe to
// ship to the browser: Row Level Security decides what each visitor can do
// (see supabase/contact_messages.sql and supabase/shop.sql).
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null
export const isSupabaseConfigured = !!supabase

export const CONTACT_TABLE = 'skillbridge_contact_messages'
export const COURSES_TABLE = 'skillbridge_courses'
export const ORDERS_TABLE = 'skillbridge_orders'
export const LESSON_CONTENT_TABLE = 'skillbridge_lesson_content'
