import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

    const { slug } = await params;

  await page.setExtraHTTPHeaders({
    "x-pdf-secret": process.env.PDF_SECRET,
  });

  await page.goto(`http://localhost:3000/pdf/proposals/${slug}`, {
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
      "Content-Disposition": 'inline; filename="test.pdf"',
    },
  });
}