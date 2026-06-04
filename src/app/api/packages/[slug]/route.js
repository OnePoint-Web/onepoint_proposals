import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server"
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

export async function GET(_req, { params }) {
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


export async function DELETE(_req, { params }) {
  const { slug } = await params

  try {
    const user = await requireUser()

    const existing = await prisma.package.findUnique({
      where: { slug },
      select: { packageId: true, package: true }
    })

    if (!existing) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.package.delete({ where: { slug } })

      await recordActivity({
        tx,
        action: 'package_deleted',
        userId: user.userId,
        title: 'Package Deleted',
        message: `Deleted package "${existing.package}"`,
        entityType: 'packages',
        entityId: slug
      })
    })

    return NextResponse.json({ message: "Package deleted successfully" })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json(
      { error: "Package not found or could not be deleted" },
      { status: 404 }
    )
  }
}