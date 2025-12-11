import { NextApiRequest } from 'next';

export async function POST(request: NextApiRequest) {
  const body = await request.json();
  console.log(body);
}
