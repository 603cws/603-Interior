import { jsPDF } from "jspdf";
import "jspdf-autotable";

function normalize(str) {
  return str.toLowerCase().replace(/[\s-]+/g, "");
}

function findKeyWithExactAndPartialMatch(subCategory, dataObject) {
  if (!subCategory || !dataObject) return null;
  const normalizedSubCat = normalize(subCategory);

  const exactMatch = Object.keys(dataObject).find(
    (key) => normalizedSubCat === normalize(key)
  );
  if (exactMatch) return exactMatch;

  return (
    Object.keys(dataObject).find((key) => {
      const normalizedKey = normalize(key);
      return (
        normalizedSubCat.includes(normalizedKey) ||
        normalizedKey.includes(normalizedSubCat)
      );
    }) || null
  );
}

function getAreaAndQuantity(subCategory, areas, quantities) {
  if (!subCategory) return { area: "—", qty: "—" };
  const matchedKey = findKeyWithExactAndPartialMatch(subCategory, areas);
  if (!matchedKey) return { area: "—", qty: "—" };
  return {
    area: areas[matchedKey] ?? "—",
    qty: quantities[matchedKey] ?? "—",
  };
}

const PDFGenerator = {
  generatePDF: async (
    selectedData,
    boqTotal,
    companyName,
    location,
    quantityData,
    areasData,
    categories,
    BOQTitle,
    userResponses
  ) => {
    const areas = areasData[0];
    const quantities = quantityData[0];

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const blue = [55, 74, 117];

    // ================= HEADER =================
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.rect(0, 0, pageWidth, 120, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("Workved Interiors", 20, 72);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Makhija Arcade, 35th Rd, Khar West,", 20, 86);
    doc.text("Mumbai Maharashtra 400052", 20, 98);
    doc.text("partners@workved.com", 20, 110);

    const logoUrl = "../logo/workved-logo.png";
    doc.addImage(logoUrl, "PNG", 240, 38, 100, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(25);
    doc.text("Invoice", pageWidth - 100, 95);
    doc.setFontSize(10);
    doc.text(
      `INVOICE DATE: ${new Date().toLocaleDateString("en-GB")}`,
      pageWidth - 145,
      110
    );

    // ================= BOQ DETAILS =================
    let y = 140;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`BOQ Name: ${BOQTitle}`, 20, y);

    doc.setTextColor(128, 128, 128);
    doc.setFont("helvetica", "normal");
    doc.text(`Height: ${userResponses.height} ft`, 20, y + 15);
    doc.text(`HVAC: ${userResponses.hvacType}`, 20, y + 30);
    doc.text(`Flooring: ${userResponses.flooring}`, 20, y + 45);

    const rightMargin = 20;
    const layoutX = pageWidth - rightMargin;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Layout Details", layoutX, y, { align: "right" });

    doc.setTextColor(128, 128, 128);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Area: ${areas.totalArea} sq ft.`, layoutX, y + 15, {
      align: "right",
    });
    doc.text(`Used Area: ${areas.usedSpace} sq ft.`, layoutX, y + 30, {
      align: "right",
    });
    doc.text(
      `Unused Area: ${areas.totalArea - areas.usedSpace} sq ft.`,
      layoutX,
      y + 45,
      { align: "right" }
    );

    // ================= GROUP DATA =================
    const grouped = {};
    selectedData.forEach((item) => {
      const cat = item.category || "Uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    let currentY = y + 70;
    let firstCategory = true;

    for (const [categoryName, items] of Object.entries(grouped)) {
      if (!firstCategory) {
        doc.addPage();
        currentY = 50;
      }

      // Category Heading
      doc.setTextColor(0, 0, 0); // reset to black
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(categoryName, 250, currentY);
      currentY += 10;

      // ✅ Check if category has any addons
      const hasAddons = items.some(
        (item) => item.addons && Object.keys(item.addons).length > 0
      );

      // ✅ Build headers dynamically
      const headers = [
        [
          "No.",
          "Image",
          "Product",
          ...(hasAddons ? ["Add Ons"] : []),
          "Specification",
          "Qty",
          "Area\n(sqft)",
          "Price",
          "Amount",
        ],
      ];

      // ✅ Build rows
      const rows = await Promise.all(
        items.map(async (item, idx) => {
          const rowNo = idx + 1;

          let productImage = null;
          if (item.product_variant?.variant_image) {
            try {
              productImage = await loadImage(
                item.product_variant.variant_image
              );
            } catch {}
          }

          let addonCell = "—";
          if (hasAddons && item.addons) {
            let addonImages = await Promise.all(
              Object.values(item.addons).map(async (addon) => {
                if (addon?.image) {
                  try {
                    return await loadImage(addon.image);
                  } catch {
                    return null;
                  }
                }
                return null;
              })
            );
            addonImages = addonImages.filter(Boolean);

            addonCell = {
              content: "",
              images: addonImages,
              texts: Object.values(item.addons).map(
                (a) => `${a.title}\nRs. ${a.finalPrice}`
              ),
            };
          }

          const { area, qty } = getAreaAndQuantity(
            item.subcategory,
            areas,
            quantities
          );

          return [
            rowNo,
            productImage ? { content: "", image: productImage } : "—",
            `${item.product_variant?.variant_title || "N/A"}\n${
              item.product_variant?.variant_details || ""
            }`,
            ...(hasAddons ? [addonCell] : []),
            `${item.subcategory}-${item.subcategory1}`,
            qty,
            area,
            `Rs. ${
              item.product_variant?.variant_price.toLocaleString("en-IN") || 0
            }`,
            `Rs. ${item.finalPrice.toLocaleString("en-IN") || 0}`,
          ];
        })
      );

      // ✅ Column styles adjust automatically
      const columnStyles = hasAddons
        ? {
            0: { halign: "center", cellWidth: 25 },
            1: { halign: "center", cellWidth: 50 },
            2: { cellWidth: 100 },
            3: { cellWidth: 120 }, // Add Ons
            4: { cellWidth: 90 },
            5: { halign: "center", cellWidth: 25 },
            6: { halign: "center", cellWidth: 32 },
            7: { halign: "right", cellWidth: 60 },
            8: { halign: "right", cellWidth: 60 },
          }
        : {
            0: { halign: "center", cellWidth: 25 },
            1: { halign: "center", cellWidth: 50 },
            2: { cellWidth: 120 },
            3: { cellWidth: 90 }, // Specification
            4: { halign: "center", cellWidth: 25 },
            5: { halign: "center", cellWidth: 40 },
            6: { halign: "right", cellWidth: 60 },
            7: { halign: "right", cellWidth: 80 },
          };

      // ✅ Render table
      doc.autoTable({
        head: headers,
        body: rows,
        startY: currentY,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 9,
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: "#E0F8FF",
          textColor: 0,
          halign: "center",
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        columnStyles,
        margin: hasAddons
          ? { left: 18, right: 15 } // when addons exist
          : { left: 52, right: 10 }, // when no addons
        didParseCell: (data) => {
          if (hasAddons && data.section === "body" && data.column.index === 3) {
            const addonsCount = data.cell.raw.images?.length || 0;
            if (addonsCount > 0) {
              const imgSize = 20;
              const spacing = 15;
              const neededHeight = addonsCount * (imgSize + spacing);
              data.cell.height = Math.max(data.cell.height, neededHeight);
            }
          }
        },
        didDrawCell: (data) => {
          if (data.section === "body") {
            const cell = data.cell;

            // Add Ons column
            if (
              hasAddons &&
              data.column.index === 3 &&
              cell.raw.images &&
              !cell.raw.imagesAdded
            ) {
              const colWidth = cell.width;
              const imgSize = 20;
              const spacing = 15;
              let offsetY = cell.y + 5;

              cell.raw.images.forEach((img, i) => {
                const imgX = cell.x + (colWidth / 2 - imgSize) / 2;
                doc.addImage(img, "PNG", imgX, offsetY, imgSize, imgSize);

                const txt = cell.raw.texts[i] || "";
                const lines = txt.split("\n");
                let textY = offsetY + 10;

                lines.forEach((line) => {
                  doc.text(line, cell.x + colWidth / 2 + 5, textY, {
                    maxWidth: colWidth / 2 - 10,
                  });
                  textY += 10;
                });

                offsetY += imgSize + spacing;
              });

              cell.raw.imagesAdded = true;
            }

            // Product image column
            if (
              data.column.index === 1 &&
              cell.raw.image &&
              !cell.raw.imageAdded
            ) {
              const imgWidth = 35;
              const imgHeight = 35;
              const x = cell.x + (cell.width - imgWidth) / 2;
              const y = cell.y + (cell.height - imgHeight) / 2;
              doc.addImage(cell.raw.image, "PNG", x, y, imgWidth, imgHeight);
              cell.raw.imageAdded = true;
            }
          }
        },
      });

      currentY = doc.lastAutoTable.finalY + 20;
      firstCategory = false;
    }

    // ================= TOTALS =================
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Sub total (excl. GST)", pageWidth - 250, finalY);
    doc.text(
      `Rs. ${boqTotal.toLocaleString("en-IN")}`,
      pageWidth - 150,
      finalY
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total Amount", pageWidth - 250, finalY + 20);
    doc.text(
      `Rs. ${boqTotal.toLocaleString("en-IN")}`,
      pageWidth - 150,
      finalY + 20
    );

    import.meta.env.MODE === "development"
      ? doc.output("dataurlnewwindow")
      : doc.save("products_summary.pdf");
  },
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const maxWidth = 50;
      const maxHeight = 40;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export default PDFGenerator;
