import { supabase } from '@/lib/supabase'

export async function logAction(action: string, userId: string, details: any) {
  await supabase.from('audit_logs').insert({
    action,
    user_id: userId,
    details
  })
}