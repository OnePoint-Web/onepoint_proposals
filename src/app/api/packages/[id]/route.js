import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const selectedPackage = await prisma.package.findUnique({
      where: { packageId: parseInt(id) },
    });

    if (!selectedPackage) {
      return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(article), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}