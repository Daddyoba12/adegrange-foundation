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
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <title>Welcome to AdeGrange Child Foundation</title>
            <style>
              /* Reset */
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #f9fafb;
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              /* Wrapper */
              .email-wrapper {
                width: 100%;
                padding: 32px 16px;
              }
              /* Card */
              .email-card {
                max-width: 480px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                border: 1px solid #e5e7eb;
              }
              /* Header */
              .email-header {
                background: #db2777;
                padding: 28px 32px;
                text-align: center;
              }
              .email-header h1 {
                color: #ffffff;
                font-size: 20px;
                font-weight: 700;
                margin: 0;
                line-height: 1.3;
              }
              .email-header p {
                color: rgba(255,255,255,0.85);
                font-size: 13px;
                margin-top: 4px;
              }
              /* Body */
              .email-body {
                padding: 32px;
              }
              .email-body h2 {
                font-size: 18px;
                font-weight: 600;
                color: #111827;
                margin: 0 0 16px;
              }
              .email-body p {
                color: #6b7280;
                font-size: 15px;
                line-height: 1.7;
                margin: 0 0 14px;
              }
              /* Divider */
              .divider {
                border: none;
                border-top: 1px solid #f3f4f6;
                margin: 24px 0;
              }
              /* CTA button */
              .cta-wrap {
                text-align: center;
                margin: 28px 0;
              }
              .cta-btn {
                display: inline-block;
                background: #db2777;
                color: #ffffff !important;
                font-size: 15px;
                font-weight: 600;
                text-decoration: none;
                padding: 14px 36px;
                border-radius: 10px;
                letter-spacing: 0.01em;
              }
              /* Small note */
              .email-note {
                color: #9ca3af;
                font-size: 13px;
                line-height: 1.6;
              }
              .email-note a {
                color: #db2777;
                text-decoration: none;
              }
              /* Footer */
              .email-footer {
                border-top: 1px solid #f3f4f6;
                padding: 20px 32px;
                text-align: center;
              }
              .email-footer p {
                color: #9ca3af;
                font-size: 12px;
                margin: 0;
                line-height: 1.6;
              }

              /* =====================
                 MOBILE RESPONSIVE
              ===================== */
              @media only screen and (max-width: 480px) {
                .email-wrapper {
                  padding: 16px 12px;
                }
                .email-card {
                  border-radius: 12px;
                }
                .email-header {
                  padding: 24px 20px;
                }
                .email-header h1 {
                  font-size: 18px;
                }
                .email-body {
                  padding: 24px 20px;
                }
                .email-body h2 {
                  font-size: 17px;
                }
                .email-body p {
                  font-size: 14px;
                }
                .cta-btn {
                  display: block;
                  text-align: center;
                  padding: 14px 20px;
                  font-size: 15px;
                }
                .email-footer {
                  padding: 16px 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-card">

                <!-- Header -->
                <div class="email-header">
                  <h1>AdeGrange Child Foundation</h1>
                  <p>Empowering Mothers. Protecting Children.</p>
                </div>

                <!-- Body -->
                <div class="email-body">
                  <h2>Welcome aboard!</h2>

                  <p>
                    Thank you for creating an account with AdeGrange Child Foundation.
                    We are glad to have you with us as we work towards advancing
                    maternal and child health across Africa.
                  </p>

                  <p>
                    Your account has been created successfully. You can now access
                    your dashboard and explore our programmes.
                  </p>

                  <!-- CTA -->
                  <div class="cta-wrap">
                    <a
                      href="https://adegrangefoundation.org/dashboard"
                      class="cta-btn"
                    >
                      Go to Dashboard
                    </a>
                  </div>

                  <hr class="divider" />

                  <p class="email-note">
                    If you did not create this account, please ignore this email
                    or contact us at
                    <a href="mailto:info@adegrangefoundation.org">
                      info@adegrangefoundation.org
                    </a>
                  </p>
                </div>

                <!-- Footer -->
                <div class="email-footer">
                  <p>&copy; 2025 AdeGrange Child Foundation. All rights reserved.</p>
                  <p style="margin-top: 4px;">United Kingdom &amp; Nigeria</p>
                </div>

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
