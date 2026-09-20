import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/v1/connect/leads
 * Submit lead or contact submission from external website to creator's EarnSpace dashboard
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateApiRequest(req, 'write:leads');
    let targetUserId = auth.userId;

    const bodyData = await req.json().catch(() => ({}));
    const { name, email, phone, message, username } = bodyData;

    if (!auth.authenticated) {
      if (username) {
        const user = await prisma.user.findUnique({ where: { username: String(username).toLowerCase() } });
        if (user) targetUserId = user.id;
        else return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
      } else {
        return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
      }
    }

    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Email and message are required' }, { status: 400 });
    }

    if (!targetUserId) {
      return NextResponse.json({ success: false, error: 'Target creator ID not resolved' }, { status: 400 });
    }

    // Record lead as a notification to creator
    const notification = await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'lead_submission',
        title: `📩 New Contact Lead: ${name || email}`,
        body: `Lead from ${name || 'Visitor'} (${email}${phone ? `, Phone: ${phone}` : ''}): "${message}"`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully to creator workspace',
      leadId: notification.id,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
