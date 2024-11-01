import puppeteer, { PDFOptions } from 'puppeteer';

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: 'load' }); 
 
    const pdfOptions: PDFOptions = {
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    };

    const pdfBuffer = await page.pdf(pdfOptions);

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("Error during PDF generation:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
