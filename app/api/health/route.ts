import notificationService from '@/lib/notification';

export async function GET() {
  try {
    //     const info = await notificationService.sendEmail({
    //       from: 'no-reply@bprepped.ai',
    //       to: 'your-email@example.com',
    //       subject: 'Test Email from B-Prepped AI',
    //       markdown: `
    // # Hello!
    // This is a **test email** sent using the new Notification Service.
    //
    // - Markdown supported
    // - HTML sanitized
    // - CSS inlined
    // - Template applied automatically
    //
    // Enjoy 🚀
    //       `,
    //     });

    return new Response(JSON.stringify({ message: 'ok' }), {
      status: 200,
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ message: 'error', error: String(err) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
