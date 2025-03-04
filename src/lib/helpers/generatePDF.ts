import puppeteer from "puppeteer";

export async function htmlToPdf(
  html: string,
  options: {
    format?: "A4" | "Letter" | "Legal";
    landscape?: boolean;
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    headerTemplate?: string;
    footerTemplate?: string;
    displayHeaderFooter?: boolean;
  } = {},
): Promise<string> {
  const pdfOptions = {
    format: options.format || "A4",
    landscape: options.landscape || false,
    margin: options.margin || {
      top: "40px",
      right: "40px",
      bottom: "40px",
      left: "40px",
    },
    printBackground: true,
    displayHeaderFooter: options.displayHeaderFooter || false,
    headerTemplate: options.headerTemplate || "",
    footerTemplate: options.footerTemplate || "",
  };

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf(pdfOptions);

    return Buffer.from(pdfBuffer).toString("base64");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
