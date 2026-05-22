import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { error } = await supabase.from('donations').insert({
      email: body.email,
      amount: body.amount,
      type: body.type || 'donor'
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
