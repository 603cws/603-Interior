import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoicePDF = () => {
  const doc = new jsPDF();

  // === Company Logo ===
  doc.addImage("/logo/workved-interior.png", "PNG", 14, 10, 40, 20);

  // === Invoice number block (right aligned) ===
  doc.setFontSize(11);
  doc.text("#2023-00", 200, 18, { align: "right" });
  doc.setTextColor("#484B4E");
  doc.text("INVOICE NUMBER", 200, 24, { align: "right" });
  doc.setTextColor("#000000");

  // === Seller info ===
  doc.setTextColor("#374A75");
  doc.setFont("helvetica", "bold");
  doc.text("SOLD BY", 14, 52);
  doc.setTextColor("#000000");
  doc.text("WORKVED INTERIORS", 14, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#484B4E");
  doc.text("Makhija Arcade, 35th Rd, Khar,", 14, 65);
  doc.text("Khar West, Mumbai, Maharashtra", 14, 70);
  doc.text("400052", 14, 75);
  doc.text("GSTIN : 567 3252 20", 14, 82);
  doc.setTextColor("#000000");

  // === Buyer info ===
  doc.setFontSize(11);
  doc.setTextColor("#374A75");
  doc.setFont("helvetica", "bold");
  doc.text("TO", 80, 52);
  doc.setTextColor("#000000");
  doc.text("SOLO", 80, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#484B4E");
  doc.text("Thakur Complex, Kandivali,", 80, 65);
  doc.text("Mumbai, Maharashtra", 80, 70);
  doc.text("400101", 80, 75);
  doc.setTextColor("#000000");

  // === Order details ===
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Order Id", 140, 52);
  doc.setFont("helvetica", "normal");
  doc.text(":   1340588965", 172, 52);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Date", 140, 59);
  doc.setFont("helvetica", "normal");
  doc.text(":   26-Sep-2025", 172, 59);
  doc.setFont("helvetica", "bold");
  doc.text("Place of Supply", 140, 66);
  doc.setFont("helvetica", "normal");
  doc.text(":   Maharashtra", 172, 66);
  doc.setFont("helvetica", "normal");

  // === Table ===
  const columns = [
    { header: "Sr. no.", dataKey: "no" },
    { header: "Description", dataKey: "desc" },
    { header: "Qty.", dataKey: "qty" },
    { header: "MRP (per unit)", dataKey: "mrp" },
    { header: "Discount (per unit)", dataKey: "discount" },
    { header: "GST (%)", dataKey: "gst" },
    { header: "Total", dataKey: "total" },
  ];
  const rows = [
    {
      no: 1,
      desc: "Chair",
      qty: 20,
      mrp: "$ 100 USD",
      discount: "$ 5 USD",
      gst: "20%",
      total: "$ 1,900 USD",
    },
    {},
    {
      no: 2,
      desc: "Sofa",
      qty: 30,
      mrp: "$ 50 USD",
      discount: "$ 2 USD",
      gst: "20%",
      total: "$ 1,440 USD",
    },
    {},
    {
      no: 3,
      desc: "Table",
      qty: 10,
      mrp: "$ 100 USD",
      discount: "$ 5 USD",
      gst: "20%",
      total: "$ 950 USD",
    },
    {},
    {
      no: 4,
      desc: "Light",
      qty: 5,
      mrp: "$ 100 USD",
      discount: "$ 5 USD",
      gst: "20%",
      total: "$ 475 USD",
    },
    {},
    {
      no: 5,
      desc: "Plant",
      qty: 10,
      mrp: "$ 100 USD",
      discount: "$ 7 USD",
      gst: "20%",
      total: "$ 930 USD",
    },
  ];

  doc.autoTable({
    startY: 100,
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey])),
    theme: "plain", // removes all borders & grid lines
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 11,
    },
    styles: {
      fontSize: 11,
    },
    bodyStyles: { fillColor: [242, 242, 242] },
    alternateRowStyles: {
      fillColor: [242, 242, 242],
    },
    didParseCell: (data) => {
      if (data.section === "head" && data.column.index === 6) {
        data.cell.styles.halign = "right";
      }
      if (data.section === "body" && data.column.index === 6) {
        data.cell.styles.halign = "right";
      }
      if (
        data.section === "body" &&
        (data.row.index === 1 ||
          data.row.index === 3 ||
          data.row.index === 5 ||
          data.row.index === 7)
      ) {
        data.cell.styles.fillColor = [255, 255, 255];
        data.cell.styles.cellPadding = 0;
      }
    },
  });

  // === Totals ===
  let finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("SUBTOTAL", 130, finalY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#484B4E");
  doc.text("$ 5,695 USD", 195, finalY, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#000");
  doc.text("DISCOUNT (10%)", 130, finalY + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#484B4E");
  doc.text("$ 569.50 USD", 195, finalY + 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#000");
  doc.text("TAX (20%)", 130, finalY + 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#484B4E");
  doc.text("$ 1,025.10 USD", 195, finalY + 12, { align: "right" });
  doc.setFontSize(12);
  doc.setTextColor("#000");
  doc.text("FINAL AMOUNT", 195, finalY + 22, { align: "right" });
  doc.setFontSize(20);
  doc.setTextColor("#374A75");
  doc.setFont("helvetica", "bold");
  doc.text("$ 6,150.60 USD", 195, finalY + 30, { align: "right" });

  // === Declaration ===
  doc.setFontSize(10);
  doc.setTextColor("#000");
  doc.setFont("helvetica", "bold");
  doc.text("DECLARATION", 14, finalY + 45);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#484B4E");
  doc.text(
    "The goods sold as part of this shipment are intended for end-user consumption and are not for retail sale",
    14,
    finalY + 51,
    { maxWidth: 180 }
  );

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  import.meta.env.MODE === "development"
    ? window.open(url, "_blank")
    : doc.save("invoice.pdf");
};
