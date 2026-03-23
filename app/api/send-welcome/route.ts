import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'AdeGrange Foundation <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to AdeGrange Child Foundation',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                       background: #f9fafb; margin: 0; padding: 40px 16px;">
            <div style="max-width: 480px; margin: 0 auto; background: #ffffff; 
                        border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
              
              <!-- Header -->
              <div style="background: #db2777; padding: 32px 40px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0;">
                  AdeGrange Child Foundation
                </h1>
              </div>

              <!-- Body -->
              <div style="padding: 40px;">
                <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-top: 0;">
                  Welcome aboard!
                </h2>
                <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 16px 0;">
                  Thank you for creating an account with AdeGrange Child Foundation. 
                  We are glad to have you with us as we work towards advancing 
                  maternal and child health across Africa.
                </p>
                <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 16px 0;">
                  Your account has been created successfully. You can now access 
                  your dashboard and explore our programmes.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 32px 0;">
                  <a 
                    href="https://adegrangefoundation.org/dashboard"
                    style="display: inline-block; background: #db2777; color: #ffffff;
                           font-size: 15px; font-weight: 600; text-decoration: none;
                           padding: 14px 32px; border-radius: 10px;"
                  >
                    Go to Dashboard
                  </a>
                </div>

                <p style="color: #9ca3af; font-size: 13px; line-height: 1.6;">
                  If you did not create this account, please ignore this email 
                  or contact us at 
                  <a href="mailto:info@adegrangefoundation.org" 
                     style="color: #db2777;">
                    info@adegrangefoundation.org
                  </a>
                </p>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #f3f4f6; padding: 24px 40px; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  &copy; 2025 AdeGrange Child Foundation. All rights reserved.
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 6px 0 0;">
                  United Kingdom &amp; Nigeria
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Send welcome error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
