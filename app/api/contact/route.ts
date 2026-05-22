import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { name, email, phone, message } = await req.json()

    // Basic server-side validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    // Sanitise inputs to prevent HTML injection
    const safe = (str: string) =>
      str.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')

    await resend.emails.send({
      from: 'AdeGrange Contact Form <info@adegrangefoundation.org>',
      to: ['info@adegrangefoundation.org'],
      replyTo: email,
      subject: `New Contact Form Message from ${safe(name)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">

          <h2 style="color: #111827; margin-bottom: 4px;">
            New Contact Form Submission
          </h2>
          <p style="color: #6b7280; font-size: 14px; margin-top: 0;">
            AdeGrange Child Foundation Website
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 13px; width: 120px; vertical-align: top;">
                Full Name
              </td>
              <td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">
                ${safe(name)}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">
                Email
              </td>
              <td style="padding: 10px 0; font-size: 15px;">
                <a href="mailto:${safe(email)}" style="color: #db2777;">
                  ${safe(email)}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">
                Phone
              </td>
              <td style="padding: 10px 0; color: #111827; font-size: 15px;">
                ${safe(phone)}
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 0 10px; color: #6b7280; font-size: 13px; vertical-align: top;">
                Message
              </td>
              <td style="padding: 16px 0 10px; color: #111827; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">
                ${safe(message)}
              </td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Sent from the contact form at adegrangefoundation.org
          </p>

        </div>
      `
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
