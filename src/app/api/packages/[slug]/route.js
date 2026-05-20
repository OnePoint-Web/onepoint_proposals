import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  const { slug } = await params;

  try {
    const selectedPackage = await prisma.package.findUnique({
      where: { slug },
    });

    if (!selectedPackage) {
      return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(selectedPackage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  const { slug } = await params  // grabs slug from URL

  try {
    // Delete the package by slug
    const deletedPackage = await prisma.package.delete({
      where: { slug },
    })

    return NextResponse.json({
      message: "Package deleted successfully",
      data: deletedPackage
    })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json(
      { error: "Package not found or could not be deleted" },
      { status: 404 }
    )
  }
}