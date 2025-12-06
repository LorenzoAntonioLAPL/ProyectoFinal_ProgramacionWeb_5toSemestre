const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
const bwipjs = require("bwip-js");

// ======= DATOS SIMULADOS ======= //
const req = {
    userId: 1,
    body: {
        name: "Nota / Compra",
        companyName: "Papa´s Donutería",
        companySlogan: "Donut worry, be happy",
        clientName: "Juan Pérez",
        paymentMethod: "transfer",      // card | transfer | oxxo
        cardLast4: "1234",
        bankAccount: "552211009988",
        oxxoReference: "019203948495", // si es OXXO
        cartItems: [
            { name: "Caja de Donas Clásicas", qty: 1, price: 120 },
            { name: "Dona Chocolate Extra", qty: 2, price: 25 },
            { name: "Café Latte", qty: 1, price: 45 }
        ],
        subtotal: 215,
        impuestos: 34.4,
        envio: 50,
        cupon: 20,
        total: 279.4
    }
};

const stream = fs.createWriteStream("nota-compra.pdf");

async function testGeneratePDF() {

  const {
    companyName,
    companySlogan,
    clientName,
    cartItems,
    subtotal,
    impuestos,
    envio,
    cupon,
    total,
    paymentMethod,
    cardLast4,
    bankAccount,
    oxxoReference
  } = req.body;

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(stream);

  // ======= COLORES ======= //
  const BORDER = '#b4845d';
  const TITLE = '#5a3725';
  const TEXT = '#7a5b4a';
  const LIGHT = '#8a6a58';

  // Marco decorativo
  doc.save()
     .lineWidth(5)
     .strokeColor(BORDER)
     .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
     .stroke()
     .restore();

  // Título
  doc.moveDown(5);
  doc.fontSize(26).fillColor(TITLE).font('Helvetica-Bold')
     .text(companyName, { align: 'center' });

  doc.fontSize(14).fillColor(LIGHT).font('Helvetica-Oblique')
     .text(companySlogan, { align: 'center' });

  doc.moveDown(2);

  // Fecha
  const fecha = new Date();
  doc.fontSize(12).fillColor(TEXT).font('Helvetica')
     .text(`Fecha: ${fecha.toLocaleDateString()}`, { align: 'right' })
     .text(`Hora: ${fecha.toLocaleTimeString()}`, { align: 'right' });

  doc.moveDown(1.5);

  // Cliente
  doc.fontSize(14).fillColor(TEXT).font('Helvetica')
     .text(`Cliente: ${clientName}`)
     .moveDown(1.5);

  // ======= PRODUCTOS ======= //
  doc.fontSize(16).fillColor(TITLE).font('Helvetica-Bold')
     .text("Productos")
     .moveDown(0.5);

  doc.fontSize(13).fillColor(TEXT).font('Helvetica');

  const priceX = doc.page.width - 100;

  if (cartItems.length === 0) {
    doc.text("No se recibieron productos.");
  } else {
    cartItems.forEach((item) => {
      const totalProducto = item.qty * item.price;

      doc.text(`${item.name} (${item.qty})`, { continued: true });
      doc.text(`$${totalProducto.toFixed(2)}`, { align: "right" });
    });
  }

  doc.moveDown(2);

  // ======= MÉTODO DE PAGO ======= //
  doc.fontSize(16).fillColor(TITLE).font('Helvetica-Bold')
    .text("Método de Pago")
    .moveDown(0.5);

  doc.fontSize(14).fillColor(TEXT).font('Helvetica');

  if (paymentMethod === "card") {
      doc.text(`Pago con Tarjeta (terminación ${cardLast4})`);
  }
  else if (paymentMethod === "transfer") {
      doc.text("Transferencia Bancaria");
      doc.text(`Cuenta: ${bankAccount}`);
  }
  else if (paymentMethod === "oxxo") {
      doc.text("Pago en OXXO");
      doc.text(`Referencia: ${oxxoReference}`);

      // ======= CÓDIGO DE BARRAS OXXO ======= //
      try {
          const png = await bwipjs.toBuffer({
              bcid: "code128",
              text: oxxoReference,
              scale: 2,      // más pequeño
              height: 8,     // más bajito
              includetext: true,
              textxalign: "center"
          });

          doc.moveDown(1);

          // Centrar
          const imgWidth = 200;
          const centerX = (doc.page.width - imgWidth) / 2;

          doc.image(png, centerX, doc.y, { width: imgWidth });
          doc.moveDown(2);

      } catch (err) {
          console.log("Error al generar código de barras:", err);
          doc.text("Error al generar código de barras");
      }
  }

  doc.moveDown(4);

  // ======= COSTOS ======= //
  doc.fontSize(16).fillColor(TITLE).font('Helvetica-Bold')
     .text("Detalles del Pago");

  doc.moveDown(0.8);
  doc.fontSize(14).fillColor(TEXT).font('Helvetica');

  doc.text(`Subtotal: $${subtotal.toFixed(2)}`);
  doc.text(`Impuestos: $${impuestos.toFixed(2)}`);
  doc.text(`Envío: $${envio.toFixed(2)}`);

  if (cupon) doc.text(`Cupón aplicado: -$${cupon.toFixed(2)}`);

  doc.moveDown(1.5);

  doc.fontSize(18).fillColor(TITLE).font('Helvetica-Bold')
     .text(`TOTAL: $${total.toFixed(2)}`, { align: 'right' });

  doc.end();
}

testGeneratePDF();
console.log("PDF generado → nota-compra.pdf");
