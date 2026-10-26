import { createClient } from '@supabase/supabase-js'

// Values come from .env (see .env.example). The publishable key is safe to
// ship to the browser: the table's RLS only allows inserting messages.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null
export const isSupabaseConfigured = !!supabase

export const CONTACT_TABLE = 'skillbridge_contact_messages'
