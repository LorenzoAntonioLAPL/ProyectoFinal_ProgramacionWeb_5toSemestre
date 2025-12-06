
import PDFDocument from "pdfkit";
import bwipjs from "bwip-js";

// ======= GENERAR PDF ======= //

export const generatePDF = async (
    userId,
    name,
    method,
    lastDigits,
    items,
    rSubtotal,
    iva,
    envio,
    cupon,
    rTotal
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40 });
            const chunks = [];

            // Acumular data en buffer
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));

            // === TITULO ===
            doc.fontSize(24).text("Nota de Compra", { align: "center" });
            doc.moveDown(1);

            // === DATOS DEL CLIENTE ===
            doc.fontSize(14).text(`Cliente: ${name}`);
            doc.text(`Método de pago: ${method}`);
            doc.text(`Últimos dígitos: ${lastDigits}`);
            doc.text(`Usuario ID: ${userId}`);
            doc.moveDown(2);

            // === TABLA DE PRODUCTOS ===

            doc.fontSize(16).text("Productos:", { underline: true });
            doc.moveDown(1);

            doc.fontSize(12);
            doc.text("Nombre", { continued: true, width: 200 });
            doc.text("Cant.", { continued: true, width: 60 });
            doc.text("Precio", { continued: true, width: 100 });
            doc.text("Total");
            doc.moveDown(0.5);

            doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);

            items.forEach((item, i) => {
                if (!item) return;

                const cantidad = item.cantidad || 1;
                const totalLinea = item.precio * cantidad;

                doc.text(item.nombre, { continued: true, width: 200 });
                doc.text(cantidad.toString(), { continued: true, width: 60 });
                doc.text(`$${item.precio.toFixed(2)}`, { continued: true, width: 100 });
                doc.text(`$${totalLinea.toFixed(2)}`);
                doc.moveDown(0.3);
            });

            doc.moveDown(2);
            doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);

            // === RESUMEN DE PAGO ===
            doc.fontSize(14);
            doc.text(`Subtotal: $${rSubtotal.toFixed(2)}`);
            doc.text(`IVA (${(iva * 100).toFixed(0)}%): $${(rSubtotal * iva).toFixed(2)}`);
            doc.text(`Envío: $${envio.toFixed(2)}`);
            doc.text(`Cupón: ${cupon}`);
            doc.fontSize(16).text(`Total: $${rTotal.toFixed(2)}`, { underline: true });

            // === CÓDIGO DE BARRAS ===
            doc.moveDown(3);
            doc.fontSize(14).text("Código de compra:", { align: "left" });
            doc.moveDown(0.5);

            const barcode = await bwipjs.toBuffer({
                bcid: "code128",
                text: `${userId}-${Date.now()}`,
                scale: 3,
                height: 10,
                includetext: false
            });

            doc.image(barcode, { width: 300 });

            // === FINALIZAR DOCUMENTO ===
            doc.end();

        } catch (err) {
            console.error("Error en generatePDF:", err);
            reject(err);
        }
    });
};
