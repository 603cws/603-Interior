import { jsPDF } from "jspdf";
import "jspdf-autotable";
// import { supabase } from "../../services/supabase";

const PDFGenerator = {
  generatePDF: async (selectedData, calculateGrandTotal) => {
    const doc = new jsPDF();
    const baseImageUrl =
      "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

    const logoUrl = "./logo/logo.png";

    // Add the logo to the top-left corner
    doc.addImage(logoUrl, "PNG", 10, 10, 20, 20); // Slightly larger for better visibility

    // Add company name
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("603 The Coworking Space", 40, 18); // Align with the logo

    // Add client details neatly aligned
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Hardcoded values (replace with props)
    const clientName = "John Doe";
    const projectName = "ABC Corp Office";
    const location = "Mumbai, India";
    const date = new Date().toLocaleDateString("en-GB"); // en-GB ensures DD/MM/YYYY format

    const details = [
      `Client: ${clientName}`,
      `Project: ${projectName}`,
      `Location: ${location}`,
      `Date: ${date}`,
    ];

    // Arrange details in two columns (better space utilization)
    let headerYOffset = 25; // Renamed to prevent conflicts
    let xOffset = 40;
    details.forEach((detail, index) => {
      doc.text(detail, xOffset, headerYOffset);
      if (index % 2 === 1) {
        headerYOffset += 5; // Move to next row after every 2 items
        xOffset = 40; // Reset to starting position
      } else {
        xOffset = 130; // Move to the right column
      }
    });

    // Add a horizontal line below the header
    doc.setLineWidth(0.5);
    doc.line(
      10,
      headerYOffset + 5,
      doc.internal.pageSize.width - 10,
      headerYOffset + 5
    );

    // Format numbers with commas
    const formatNumber = (num) => num.toLocaleString("en-IN");

    // 1. Calculate Category Totals
    const categoryTotals = {};
    const categorizedProducts = {};

    selectedData.forEach((item) => {
      const category = item.category || "Uncategorized";
      const finalPrice = item.finalPrice || 0;

      categoryTotals[category] = (categoryTotals[category] || 0) + finalPrice;

      if (!categorizedProducts[category]) {
        categorizedProducts[category] = [];
      }
      categorizedProducts[category].push(item);
    });

    // 2. Create Summary Section
    let yOffset = 50;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", doc.internal.pageSize.width / 2, yOffset, {
      align: "center",
    });

    yOffset += 8;

    // Prepare summary table rows
    const categoryEntries = Object.entries(categoryTotals);
    const summaryRows = categoryEntries.map(([category, total]) => [
      { content: category, styles: { halign: "left", fontSize: 10 } }, // Left-aligned category name
      {
        content: `Rs. ${formatNumber(total)}/-`,
        styles: { halign: "right", fontSize: 10 },
      }, // Right-aligned price
    ]);

    // Add Summary Table
    doc.autoTable({
      head: [["Category", "Price"]],
      body: summaryRows,
      columnStyles: {
        0: { cellWidth: 90, halign: "left" }, // Category column
        1: { cellWidth: 40, halign: "right" }, // Price column
      },
      startY: yOffset,
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: {
        fillColor: [22, 160, 133], // Light green header
        textColor: [255, 255, 255], // White text
        fontStyle: "bold",
      },
    });

    yOffset = doc.autoTable.previous.finalY + 10;

    // 3. Add Grand Total (Bold)
    const grandTotal = Object.values(categoryTotals).reduce(
      (acc, val) => acc + val,
      0
    );
    const grandTotalTextt = `Grand Total: Rs. ${formatNumber(grandTotal)}/-`;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    // Positioning: Keep it aligned with "Price" column
    const textWidth2 = doc.getTextWidth(grandTotalTextt);
    const pageWidth2 = doc.internal.pageSize.width;
    const xPos2 = pageWidth2 - textWidth2 - 15;

    doc.text(grandTotalTextt, xPos2, yOffset);

    // 3. Process images asynchronously before table rendering
    for (const [category, products] of Object.entries(categorizedProducts)) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      // Adjusted width for better alignment
      const pageWidth = doc.internal.pageSize.width - 20;
      const textHeight = 10; // Define height of the background
      const textY = yOffset + textHeight / 2; // Center text vertically
      const bgX = (doc.internal.pageSize.width - pageWidth) / 2; // Center align the background

      doc.setFillColor(17, 69, 112); // Set background color
      doc.rect(bgX, yOffset, pageWidth, textHeight, "F"); // Center-aligned background

      doc.setTextColor(255, 255, 255); // Set text color to white
      doc.text(category, doc.internal.pageSize.width / 2, textY, {
        align: "center",
        baseline: "middle",
      }); // Center text

      yOffset += textHeight + 5; // Increase offset for next content

      const headers = ["Product Details", "Product Image", "Addons"];
      const rows = [];

      // Process images before constructing the table
      const productRows = await Promise.all(
        products.map(async (item) => {
          const productDetails = `
Title: ${item.product_variant.variant_title || "N/A"}
Subcategory: ${item.subcategory || "N/A"}
Price: Rs. ${item.product_variant.variant_price || "N/A"}/-
Description: ${item.product_variant.variant_details || "N/A"}
                `;

          let productImage = "No image available";
          if (item.product_variant.variant_image) {
            try {
              const fileName = new URL(
                item.product_variant.variant_image
              ).pathname
                .split("/")
                .pop();
              const imageUrl = baseImageUrl + fileName;
              productImage = await loadImage(imageUrl);
            } catch (err) {
              console.error("Failed to load product image:", err);
            }
          }

          const addonDetails = [];
          if (item.addons) {
            for (const addon of Object.values(item.addons)) {
              const addonText = `
Addon Title: ${addon.addon_title || "N/A"}
Addon Price: Rs. ${addon.addon_price || "N/A"}/-
                        `;
              addonDetails.push(addonText);
            }
          }

          const addonTextCombined = addonDetails.join("\n");

          return [
            {
              content: productDetails,
              styles: { halign: "left", fontSize: 10 },
            },
            productImage !== "No image available"
              ? { content: "", styles: { cellPadding: 5 }, image: productImage }
              : "No image available",
            {
              content: addonTextCombined,
              styles: { halign: "left", fontSize: 10 },
            },
          ];
        })
      );

      rows.push(...productRows);

      // Render table for each category
      doc.autoTable({
        head: [headers],
        body: rows.map((row) =>
          row.map((cell, colIndex) => {
            if (cell.image) {
              return {
                content: "",
                styles: { cellPadding: 5, minCellHeight: 40, valign: "middle" }, // Ensure uniform height
                image: cell.image,
              };
            }
            return {
              ...cell,
              styles: { ...cell.styles, minCellHeight: 40, valign: "middle" }, // Align text too
            };
          })
        ),
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 1) {
            // Image column
            const cellWidth = data.cell.width;
            const cellHeight = data.cell.height;
            const imgSize = 30; // Image size
            const xPos = data.cell.x + (cellWidth - imgSize) / 2; // Center horizontally
            const yPos = data.cell.y + (cellHeight - imgSize) / 2; // Center vertically

            if (data.cell.raw.image && !data.cell.raw.imageAdded) {
              doc.addImage(
                data.cell.raw.image,
                "PNG",
                xPos,
                yPos,
                imgSize,
                imgSize
              );
              data.cell.raw.imageAdded = true;
            }
          }
        },
        columnStyles: {
          0: { cellWidth: 70, valign: "middle" },
          1: { cellWidth: 50, valign: "middle" }, // Image column
          2: { cellWidth: 70, valign: "middle" },
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center", // Center align heading
          valign: "middle", // Vertically center align heading
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 5,
          valign: "middle",
        },
        startY: yOffset,
        tableWidth: "wrap",
        margin: {
          left: (doc.internal.pageSize.width - (70 + 50 + 70)) / 2,
          right: (doc.internal.pageSize.width - (70 + 50 + 70)) / 2,
        },
      });

      yOffset = doc.autoTable.previous.finalY + 10;
    }

    // Calculate available space on the page
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 20; // Space from bottom to avoid cutting off
    const requiredSpace = 10; // Estimated space for text

    if (yOffset + requiredSpace > pageHeight - bottomMargin) {
      doc.addPage();
      yOffset = 20; // Reset yOffset for new page
    }

    // 4. Add Grand Total at the bottom
    const grandTotalText = `Grand Total: Rs. ${calculateGrandTotal()}/-`;
    const pageWidth = doc.internal.pageSize.width;
    const marginRight = 15;
    const textWidth = doc.getTextWidth(grandTotalText);
    const xPos = pageWidth - textWidth - marginRight;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(grandTotalText, xPos, yOffset);

    // Save the PDF
    doc.save("products_summary.pdf");
  },
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 100; // Increase width for better resolution
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");

      // Use high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png")); // Use PNG for better quality
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

export default PDFGenerator;
