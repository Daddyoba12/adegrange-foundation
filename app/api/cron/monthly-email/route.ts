import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {

  // 1. Check CRON secret — reject if missing or wrong
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Validate Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Supabase credentials not configured' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // 3. Fetch all donors from Supabase
  const { data: donors, error } = await supabase
    .from('donors')
    .select('name, email, amount, type, partner')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!donors || donors.length === 0) {
    return NextResponse.json({
      success: true,
      sent: 0,
      message: 'No donors found',
    })
  }

  const isDecember = new Date().getMonth() === 11
  const results: { email: string; id?: string; error?: string }[] = []

  // 4. Send email to each donor — wrapped in try/catch so one failure
  //    does not abort the entire loop
  for (const donor of donors) {
    try {
      const subject = isDecember
        ? 'A Personal Message from Our Founder — AdeGrange Child Foundation'
        : 'Thank You for Your Continued Support — AdeGrange Child Foundation'

      const html = isDecember
        ? founderLetterTemplate(donor.name)
        : monthlyThankYouTemplate(donor.name, donor.amount, donor.type)

      const result = await resend.emails.send({
        from: 'AdeGrange Foundation <no-reply@adegrangefoundation.org>',
        to: donor.email,
        subject,
        html,
      })

      results.push({ email: donor.email, id: result.data?.id })

    } catch (err: any) {
      // Log the failure but continue sending to other donors
      console.error(`Failed to send to ${donor.email}:`, err.message)
      results.push({ email: donor.email, error: err.message })
    }
  }

  const sent      = results.filter(r => !r.error).length
  const failed    = results.filter(r =>  r.error).length

  return NextResponse.json({
    success: true,
    sent,
    failed,
    month: new Date().toLocaleString('en-GB', { month: 'long' }),
    results,
  })
}

// =====================
// EMAIL TEMPLATES
// =====================

function monthlyThankYouTemplate(
  name: string,
  amount: number | null,
  type: string
) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #111;">

      <div style="text-align: center; margin-bottom: 32px;">
        <img
          src="https://adegrangefoundation.org/images/logo.JPG"
          alt="AdeGrange Child Foundation"
          style="height: 60px; object-fit: contain;"
        />
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">Dear ${name},</p>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">
        On behalf of everyone at <strong>AdeGrange Child Foundation</strong>, we want to take a
        moment this month to say a heartfelt <strong>thank you</strong>.
      </p>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">
        ${
          amount
            ? `Your generous ${type === 'recurring' ? 'ongoing' : ''} gift of <strong>&pound;${amount}</strong> continues to make a real difference`
            : 'Your generous support continues to make a real difference'
        }
        in the lives of mothers and children across Africa.
        Because of people like you, we are able to fund healthcare programmes,
        educational initiatives, and community empowerment projects that protect the most vulnerable.
      </p>

      <div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 20px 24px; margin: 32px 0; border-radius: 4px;">
        <p style="font-size: 15px; line-height: 1.8; color: #333; margin: 0; font-style: italic;">
          &ldquo;Healthy mothers raise healthy nations.&rdquo;
        </p>
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">
        Your support is not just a donation &mdash; it is an investment in a generation.
        We are grateful for your trust and commitment to our mission.
      </p>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">
        With gratitude,<br/>
        <strong>The AdeGrange Child Foundation Team</strong>
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />

      <p style="font-size: 12px; color: #999; text-align: center; line-height: 1.6;">
        AdeGrange Child Foundation &bull; United Kingdom &amp; Nigeria<br/>
        <a href="https://adegrangefoundation.org" style="color: #db2777;">adegrangefoundation.org</a>
        &bull;
        <a href="mailto:info@adegrangefoundation.org" style="color: #db2777;">info@adegrangefoundation.org</a>
      </p>

    </body>
    </html>
  `
}

function founderLetterTemplate(name: string) {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `
    <!DOCTYPE html>
    <html lang="en">
    <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #111;">

      <div style="text-align: center; margin-bottom: 32px;">
        <img
          src="https://adegrangefoundation.org/images/logo.JPG"
          alt="AdeGrange Child Foundation"
          style="height: 60px; object-fit: contain;"
        />
      </div>

      <p style="font-size: 14px; color: #999; text-align: right;">
        ${date}
      </p>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">Dear ${name},</p>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">
        As we come to the close of another year, I wanted to write to you personally
        to express my deepest gratitude for your support of <strong>AdeGrange Child Foundation</strong>.
      </p>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">
        This year, because of generous people like yourself, we have been able to reach
        more mothers, protect more children, and strengthen more communities than ever before.
        Your belief in our mission means the world to us.
      </p>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">
        From the bottom of my heart &mdash; <strong>thank you</strong>.
        You are part of this family, and everything we achieve, we achieve together.
      </p>

      <div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 20px 24px; margin: 32px 0; border-radius: 4px;">
        <p style="font-size: 15px; line-height: 1.8; color: #333; margin: 0; font-style: italic;">
          &ldquo;Every child deserves to grow up healthy, loved and full of possibility.
          Thank you for making that possible.&rdquo;
        </p>
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #333;">
        Wishing you and your family a joyful and peaceful new year.
      </p>

      <p style="font-size: 16px; line-height: 1.8; color: #333; margin-top: 32px;">
        With deepest gratitude,
      </p>

      <p style="font-size: 18px; font-style: italic; color: #111; margin-top: 8px;">
        The Founder<br/>
        <span style="font-size: 14px; font-style: normal; color: #666;">
          AdeGrange Child Foundation
        </span>
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />

      <p style="font-size: 12px; color: #999; text-align: center; line-height: 1.6;">
        AdeGrange Child Foundation &bull; United Kingdom &amp; Nigeria<br/>
        <a href="https://adegrangefoundation.org" style="color: #db2777;">adegrangefoundation.org</a>
        &bull;
        <a href="mailto:info@adegrangefoundation.org" style="color: #db2777;">info@adegrangefoundation.org</a>
      </p>

    </body>
    </html>
  `
}
