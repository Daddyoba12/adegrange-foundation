// /api/donate/route.ts
export async function POST(req: Request) {
  const body = await req.json()

  const { error } = await supabase.from('donations').insert({
    email: body.email,
    amount: body.amount,
    type: body.type || 'donor'
  })

  if (error) return new Response(error.message, { status: 500 })

  return Response.json({ success: true })
}