import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { slug } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { slug },
    select: { proposalTitle: true },
  });

  const safeTitle = (proposal?.proposalTitle ?? slug)
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: true,
});
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    "x-pdf-secret": process.env.PDF_SECRET,
  });

  await page.goto(`${process.env.NEXT_PUBLIC_APP_URL}/pdf/proposals/${slug}`, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${safeTitle}.pdf"`,
    },
  });
}
