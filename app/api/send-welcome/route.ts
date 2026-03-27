import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Guard — only initialise Resend at request time, not build time
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service not configured.' },
        { status: 500 }
      )
    }

    // Dynamically import so Resend is never instantiated at build time
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const { email, name } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'AdeGrange Foundation <noreply@adegrangefoundation.org>',
      to: email,
      subject: 'Welcome to AdeGrange Child Foundation',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 16px;">
            Welcome${name ? `, ${name}` : ''}!
          </h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
            Thank you for connecting with AdeGrange Child Foundation. We are committed to 
            advancing maternal and child health across Africa and are glad to have you with us.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            We will keep you updated on our programmes, events, and impact stories.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 13px;">
            AdeGrange Child Foundation &mdash; Empowering Mothers. Protecting Children.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })

  } catch (err) {
    console.error('Send welcome error:', err)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
