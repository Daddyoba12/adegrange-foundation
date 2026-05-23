import { NextResponse } from 'next/server'

// TEST ONLY — remove this file before going fully live
export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-thank-you`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Donor',
        email: 'daddyoba12@gmail.com',
        amount: 25,
        currency: 'GBP',
        frequency: 'once',
        donorRef: `ACF_TEST_${Date.now()}`,
      }),
    })
    const data = await res.json()
    return NextResponse.json({ sent: true, result: data })
  } catch (err: any) {
    return NextResponse.json({ sent: false, error: err.message }, { status: 500 })
  }
}
