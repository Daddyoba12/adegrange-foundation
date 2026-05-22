import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'info@adegrangefoundation.org'

export async function POST(req: NextRequest) {
  try {
    const { name, email, amount, currency, frequency, donorRef } = await req.json()

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
    }

    const sym = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '₦'
    const amountStr = `${sym}${Number(amount).toLocaleString()}`
    const freqStr = frequency === 'monthly' ? 'per month' : 'one-time'

    const donorHtml = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff">
        <div style="background:linear-gradient(135deg,#db2777,#9d174d);padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:26px;font-weight:900">AdeGrange Child Foundation</h1>
          <p style="color:rgba(255,255,255,.85);margin:8px 0 0;font-size:14px">Protecting Mothers &amp; Children Across Africa</p>
        </div>
        <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;font-size:22px;margin:0 0 8px">Thank you, ${name}!</h2>
          <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px">
            Your generous donation of <strong style="color:#db2777">${amountStr} ${freqStr}</strong> has been received.
            You are helping protect mothers and children across Africa.
          </p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:24px">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af">Donation Details</p>
            ${[
              ['Donor Reference', donorRef],
              ['Amount', `${amountStr} ${freqStr}`],
              ['Status', 'Confirmed ✓'],
            ].map(([label, value]) => `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb">
                <span style="color:#6b7280;font-size:13px">${label}</span>
                <span style="font-weight:600;font-size:13px;color:#111827">${value}</span>
              </div>
            `).join('')}
          </div>
          <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0 0 24px">
            Please keep your donor reference <strong>${donorRef}</strong> for your records.
            You will receive a quarterly impact update showing how your donation is making a difference.
          </p>
          <div style="text-align:center">
            <a href="https://adegrangefoundation.org" style="display:inline-block;background:#db2777;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">
              Visit Our Website
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
          <p style="color:#9ca3af;font-size:11px;text-align:center;margin:0">
            AdeGrange Child Foundation · Registered Charity<br/>
            This is an automated confirmation — please do not reply to this email.
          </p>
        </div>
      </div>
    `

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#db2777">New Donation Received</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${[
            ['Reference', donorRef],
            ['Donor', name],
            ['Email', email],
            ['Amount', `${amountStr} ${freqStr}`],
          ].map(([label, value]) => `
            <tr>
              <td style="padding:8px;border:1px solid #e5e7eb;color:#6b7280;width:40%">${label}</td>
              <td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">${value}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `

    // Send both emails in parallel
    await Promise.all([
      // Thank-you to donor
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'AdeGrange Foundation <info@adegrangefoundation.org>',
          to: email,
          subject: `Thank you for your donation — Ref: ${donorRef}`,
          html: donorHtml,
        }),
      }),
      // Notification to admin
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'AdeGrange Donations <info@adegrangefoundation.org>',
          to: ADMIN_EMAIL,
          subject: `New donation: ${amountStr} from ${name} — ${donorRef}`,
          html: adminHtml,
        }),
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send thank-you error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
