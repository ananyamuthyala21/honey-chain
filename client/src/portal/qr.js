import QRCode from "qrcode";

export async function createQrDataUrl(value) {
  return QRCode.toDataURL(value, {
    width: 320,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#24180d", light: "#ffffff" },
  });
}
