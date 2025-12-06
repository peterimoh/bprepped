export async function GET() {
  try {
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
