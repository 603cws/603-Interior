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
    userResponses,
    productQuantity
  ) => {
    const areas = areasData[0];
    const quantities = quantityData[0];

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const blue = [55, 74, 117];

    let hasAddons, hideQty;

    // ================= HEADER =================
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.rect(0, 0, pageWidth, 125, "F");

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
    doc.addImage(logoUrl, "PNG", 250, 25, 100, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(25);
    doc.text("BOQ", pageWidth - 73, 95);
    doc.setFontSize(10);
    doc.text(
      `BOQ DATE: ${new Date().toLocaleDateString("en-GB")}`,
      pageWidth - 128,
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
    doc.text(
      `HVAC: ${userResponses.hvacType ? userResponses.hvacType : "N/A"}`,
      20,
      y + 30
    );
    doc.text(
      `Flooring: ${userResponses.flooring ? userResponses.flooring : "N/A"}`,
      20,
      y + 45
    );

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

    // ================= SUMMARY SECTION =================
    const categoryTotals = {};
    const categorizedProducts = {};

    // Calculate totals per category (including addons)
    categories.forEach((cat) => {
      const category = cat.category;

      const productsInCategory = selectedData.filter(
        (item) => item.category === category
      );

      const totalPrice = productsInCategory.reduce((acc, item) => {
        // Base price
        let itemTotal = item.finalPrice || 0;

        // Add all addon prices if present
        if (item.addons) {
          const addonSum = Object.values(item.addons).reduce(
            (addonAcc, addon) => addonAcc + (addon.finalPrice || 0),
            0
          );
          itemTotal += addonSum;
        }

        return acc + itemTotal;
      }, 0);

      categoryTotals[category] = totalPrice;
      categorizedProducts[category] = productsInCategory;
    });

    let yOffset = y + 80;

    // Plain Summary Heading (no background)
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Summary", 290, yOffset, {
      align: "center",
    });
    yOffset += 20;

    // Calculate grand total
    const grandTotalAmount = Object.values(categoryTotals).reduce(
      (acc, val) => acc + val,
      0
    );

    // Prepare summary rows
    const summaryRows = Object.entries(categoryTotals).map(
      ([category, total]) => [
        { content: category, styles: { halign: "center", fontSize: 10 } },
        {
          content: `Rs. ${total.toLocaleString("en-IN")}/-`,
          styles: { halign: "center", fontSize: 10 },
        },
      ]
    );

    // Add Grand Total Row
    summaryRows.push([
      {
        content: "Grand Total",
        styles: { halign: "center", fontSize: 12, fontStyle: "bold" },
      },
      {
        content: `Rs. ${grandTotalAmount.toLocaleString("en-IN")}/-`,
        styles: {
          halign: "center",
          fontSize: 12,
          fontStyle: "bold",
        },
      },
    ]);

    // Render summary table with black borders everywhere
    doc.autoTable({
      head: [["Category", "Total"]],
      body: summaryRows,
      startY: yOffset,
      theme: "grid", // ensures table + borders
      styles: {
        font: "helvetica",
        fontSize: 9,
        lineColor: [0, 0, 0], // black border
        lineWidth: 0.5, // thickness of border
        valign: "middle",
        cellPadding: 10,
      },
      headStyles: {
        fillColor: false, // no background
        textColor: 0, // black text
        fontStyle: "bold",
        halign: "center",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        fontSize: 14,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 275 },
        1: { halign: "center", cellWidth: 285 },
      },
      margin: { left: 18, right: 18 }, // 🔥 controls how much space is left at the page sides
    });

    y = doc.lastAutoTable.finalY + 30; // push Y further down after summary

    // ================= GROUP DATA =================
    const grouped = {};
    selectedData.forEach((item) => {
      const cat = item.category || "Uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    let currentY = y + 20;
    let firstCategory = true;

    for (const [categoryName, items] of Object.entries(grouped)) {
      if (!firstCategory) {
        doc.addPage();
        currentY = 50;
      }

      // Category Heading
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(categoryName, 250, currentY);
      currentY += 10;

      hasAddons = items.some(
        (item) => item.addons && Object.keys(item.addons).length > 0
      );

      // Exclude Qty for these categories
      const excludedQtyCategories = [
        "Lighting",
        "HVAC",
        "Partitions / Ceilings",
      ];
      hideQty = excludedQtyCategories.includes(categoryName);

      // ✅ Define columns (with titles and keys)
      const columns = [
        { header: "No.", dataKey: "no" },
        { header: "Image", dataKey: "image" },
        { header: "Product", dataKey: "product" },
        ...(hasAddons ? [{ header: "Add Ons", dataKey: "addons" }] : []),
        { header: "Specification", dataKey: "spec" },
        ...(hideQty ? [] : [{ header: "Qty", dataKey: "qty" }]),
        { header: "Area (sqft)", dataKey: "area" },
        { header: "Price", dataKey: "price" },
        { header: "Amount", dataKey: "amount" },
      ];

      // ✅ Build rows as plain objects with keys matching dataKey
      const rows = await Promise.all(
        items.map(async (item, idx) => {
          let productImage = null;
          if (item.product_variant?.variant_image) {
            try {
              productImage = await loadImage(
                item.product_variant.variant_image
              );
            } catch {}
          }

          let addonCell = [];
          let addonTotal = 0; // 🔥 track total addon price

          if (hasAddons && item.addons) {
            addonCell = await Promise.all(
              Object.values(item.addons).map(async (a) => {
                let addonImage = null;
                if (a.image) {
                  try {
                    addonImage = await loadImage(a.image);
                  } catch {}
                }
                addonTotal += a.finalPrice || 0; // 🔥 add each addon price
                return {
                  title: a.title,
                  price: a.finalPrice,
                  _imgData: addonImage,
                };
              })
            );
          }

          const { area } = getAreaAndQuantity(
            item.subcategory,
            areas,
            quantities
          );
          const qty = item.quantity || "-";

          // total amount = base finalPrice + sum of addons
          const totalAmount = (item.finalPrice || 0) + addonTotal;

          return {
            no: idx + 1,
            image: " ", // placeholder cell content
            _imgData: productImage || null,
            product: `${item.product_variant?.variant_title || "N/A"}\n${
              item.product_variant?.variant_details || ""
            }`,
            ...(hasAddons
              ? { addons: "", _addons: addonCell, _hasAddons: true } //, _hasAddons: true
              : {}),
            spec: `${item.subcategory}-${item.subcategory1}`,
            subcategory1: item.subcategory1, // ✅ add this line
            ...(hideQty ? {} : { qty }),
            area,
            price: `Rs. ${
              item.product_variant?.variant_price.toLocaleString("en-IN") || 0
            }`,
            amount: `Rs. ${totalAmount.toLocaleString("en-IN")}`,
          };
        })
      );

      // ✅ Sort rows by subcategory1 order defined in categories prop
      const categoryObj = categories.find((c) => c.category === categoryName);
      if (categoryObj && categoryObj.subcategory1) {
        const order = categoryObj.subcategory1;
        rows.sort((a, b) => {
          const ia = order.indexOf(a.subcategory1);
          const ib = order.indexOf(b.subcategory1);
          return (
            (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib)
          );
        });
      }

      // ✅ Column styles with keys (not indexes)
      const columnStyles = {
        no: { halign: "center", cellWidth: 25 },
        image: { halign: "center", cellWidth: 50 },
        ...(hasAddons
          ? { product: { cellWidth: 100 } }
          : { product: { cellWidth: 120 } }),
        // product: { cellWidth: 100 },
        ...(hasAddons ? { addons: { cellWidth: 100 } } : {}),
        spec: { cellWidth: 90 },
        qty: { halign: "center", cellWidth: 25 },
        area: { halign: "center", cellWidth: 40 },
        price: { halign: "right", cellWidth: 60 },
        ...(hasAddons
          ? { amount: { halign: "right", cellWidth: 70 } }
          : { amount: { halign: "right", cellWidth: 80 } }),

        // amount: { halign: "right", cellWidth: 70 },
      };

      // ✅ Render table with columns + rows
      doc.autoTable({
        columns,
        body: rows,
        startY: currentY,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 9,
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: "#fff",
          textColor: 0,
          halign: "center",
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        columnStyles,
        margin: hasAddons
          ? { left: 18, right: 15 }
          : hideQty
          ? { left: 65, right: 10 }
          : { left: 52, right: 10 },
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.dataKey === "image") {
            const rowData = data.row.raw;

            if (rowData._imgData && !data.cell.imageDrawn) {
              const img = rowData._imgData;

              const padding = 2;
              const cellW = data.cell.width - padding * 2;
              const cellH = data.cell.height - padding * 2;

              const size = Math.min(cellW, cellH);
              const x = data.cell.x + (data.cell.width - size) / 2;
              const y = data.cell.y + (data.cell.height - size) / 2;

              doc.addImage(img, "PNG", x, y, size, size);

              // ✅ mark as drawn so it won’t draw again on next page
              data.cell.imageDrawn = true;
            }
          }

          // ✅ Addon Images inside Addons column
          if (data.section === "body" && data.column.dataKey === "addons") {
            const rowData = data.row.raw;
            if (Array.isArray(rowData._addons) && rowData._addons.length > 0) {
              const cellPadding = 4;
              const imgSize = 20;
              const vGap = 8;

              const contentX = data.cell.x + cellPadding;
              const maxWidth = data.cell.width - cellPadding * 2;
              let yOffset = data.cell.y + 6;

              rowData._addons.forEach((addon) => {
                // left: image
                if (addon._imgData) {
                  doc.addImage(
                    addon._imgData,
                    "PNG",
                    contentX,
                    yOffset,
                    imgSize,
                    imgSize
                  );
                }

                // right: title (top) + price (below)
                const textX = contentX + imgSize + 6;
                const textWidth = maxWidth - imgSize - 6;

                doc.setFontSize(8);
                doc.text(addon.title || "", textX, yOffset + 8, {
                  maxWidth: textWidth,
                });
                doc.text(
                  `Rs. ${Number(addon.price || 0).toLocaleString("en-IN")}`,
                  textX,
                  yOffset + 18,
                  { maxWidth: textWidth }
                );

                yOffset += imgSize + vGap; // stack vertically
              });

              // don’t let autotable draw its own text
              data.cell.text = [];
            }
          }
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.dataKey === "addons") {
            const rowData = data.row.raw;
            if (Array.isArray(rowData._addons) && rowData._addons.length > 0) {
              const imgSize = 20;
              const vGap = 8; // vertical spacing between addons
              const topPad = 6; // top padding inside the cell
              const bottomPad = 6;

              // each addon takes roughly img height + spacing
              const required =
                rowData._addons.length * (imgSize + vGap) + topPad + bottomPad;

              // 🔥 make the WHOLE ROW at least this tall
              data.row.height = Math.max(data.row.height || 0, required);

              // prevent default text (avoid "[object Object]")
              data.cell.text = [];
              // ensure this cell can grow; helpful on some versions
              data.cell.styles.minCellHeight = Math.max(
                data.cell.styles.minCellHeight || 0,
                required
              );
            }
          }
        },
      });

      currentY = doc.lastAutoTable.finalY + 20;
      firstCategory = false;
    }

    // ================= TOTALS =================
    const finalY = doc.lastAutoTable.finalY + 30;
    const rightMargin2 = hasAddons ? 20 : hideQty ? 65 : 50; // leave 40px from right edge (you can adjust)

    // Sub total row
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Sub total (excl. GST)", pageWidth - 250, finalY);
    doc.text(
      `Rs. ${boqTotal.toLocaleString("en-IN")}`,
      pageWidth - rightMargin2,
      finalY,
      { align: "right" } // 🔥 right align the number
    );

    // Total Amount row
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total Amount", pageWidth - 250, finalY + 25);
    doc.text(
      `Rs. ${boqTotal.toLocaleString("en-IN")}`,
      pageWidth - rightMargin2,
      finalY + 25,
      { align: "right" } // 🔥 right align again
    );

    // import.meta.env.MODE === "development"
    //   ? doc.output("dataurlnewwindow")
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    import.meta.env.MODE === "development"
      ? window.open(url, "_blank")
      : doc.save("products_summary.pdf");
  },
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const maxWidth = 150;
      const maxHeight = 120;
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

      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/png", 1.0));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export default PDFGenerator;
