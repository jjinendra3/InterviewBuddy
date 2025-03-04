import axios from "axios";
export async function htmlToPdf(html: string) {
  try {
    const options = {
      method: "POST",
      url: "https://api.pdfendpoint.com/v1/convert",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PDF_ENDPOINT}`,
      },
      data: JSON.stringify({
        html: html,
        sandbox: true,
        orientation: "vertical",
        page_size: "A4",
        margin_top: "2cm",
        margin_bottom: "2cm",
        margin_left: "2cm",
        margin_right: "2cm",
      }),
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("PDF generation error:", error);
    return null;
  }
}
