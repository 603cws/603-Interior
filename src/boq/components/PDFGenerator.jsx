import { jsPDF } from "jspdf";
import "jspdf-autotable";
// import { supabase } from "../../services/supabase";

const PDFGenerator = {
  generatePDF: async (
    selectedData,
    calculateGrandTotal,
    companyName,
    location,
    areasData,
    categories
  ) => {
    const areas = areasData[0];
    const doc = new jsPDF();
    const baseImageUrl =
      "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

    const logoUrl = "/logo/logo.png";

    // Add the logo to the top-left corner
    doc.addImage(logoUrl, "PNG", 10, 10, 20, 20); // Slightly larger for better visibility

    // Add company name
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Workved Interiors", 40, 18); // Align with the logo

    // Add client details neatly aligned
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Hardcoded values (replace with props)
    const projectName = "ABC Corp Office";
    const date = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY format

    const details = [
      `Client: ${companyName}`,
      `Project: ${projectName}`,
      `Location: ${location}`,
      `Total Area: ${areas.totalArea} sq.ft`,
      `Date: ${date}`,
      `Used Space: ${areas.usedSpace} sq.ft`,
      ``,
      `Unused Space: ${areas.totalArea - areas.usedSpace} sq.ft`,
    ];

    // ✅ Arrange details in two columns
    let headerYOffset = 25; // Starting Y position
    let xOffset = 40;

    // ✅ Dynamically render details
    details.forEach((detail, index) => {
      doc.text(detail, xOffset, headerYOffset);

      // Shift Y-axis after 2 items
      if (index % 2 === 1) {
        headerYOffset += 5;
        xOffset = 40;
      } else {
        xOffset = 130;
      }
    });

    // ✅ Draw Line (with clear spacing after it)
    headerYOffset += 5;
    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.line(
      10,
      headerYOffset,
      doc.internal.pageSize.width - 10,
      headerYOffset
    );

    // ✅ ✅ ✅ Now declare yOffset globally (this was missing earlier)
    let yOffset = headerYOffset + 10; // ✅ Add clear space after the line

    // ✅ Format numbers with commas
    const formatNumber = (num) => num.toLocaleString("en-IN");

    // ✅ Calculate Category Totals (Show ₹0 Categories Too)
    const categoryTotals = {};
    const categorizedProducts = {};

    // ✅ Loop through categoriesData and ensure ALL categories are shown
    categories.forEach((cat) => {
      const category = cat.category;
      const productsInCategory = selectedData.filter(
        (item) => item.category === category
      );

      // ✅ Calculate the total price of products in this category
      const totalPrice = productsInCategory.reduce(
        (acc, item) => acc + (item.finalPrice || 0),
        0
      );

      // ✅ Always add the category, even if price is ₹0
      categoryTotals[category] = totalPrice;
      categorizedProducts[category] = productsInCategory;
    });

    // ✅ Create Summary Section (with box)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    // ✅ Calculate the full table width
    const tablePageWidth = doc.internal.pageSize.width - 20;
    const xOffsetCenter = 10;

    // ✅ Draw Blue Background for "Summary"
    doc.setFillColor(17, 69, 112);
    doc.rect(xOffsetCenter, yOffset, tablePageWidth, 10, "F");

    // ✅ Add "Summary" Text Centered
    doc.setTextColor(255, 255, 255);
    doc.text("Summary", doc.internal.pageSize.width / 2, yOffset + 7, {
      align: "center",
    });

    // ✅ Reset Text Color to Black
    doc.setTextColor(0, 0, 0);

    // ✅ ✅ ✅ Move yOffset further down after the Summary Header
    yOffset += 18;

    // ✅ Calculate Grand Total
    const grandTotalAmount = Object.values(categoryTotals).reduce(
      (acc, val) => acc + val,
      0
    );

    // ✅ Prepare summary table rows
    const categoryEntries = Object.entries(categoryTotals);
    const summaryRows = categoryEntries.map(([category, total]) => [
      { content: category, styles: { halign: "center", fontSize: 10 } },
      {
        content: `Rs. ${formatNumber(total)}/-`,
        styles: { halign: "center", fontSize: 10 },
      },
    ]);

    // ✅ Add Grand Total Row (Bold + Center)
    summaryRows.push([
      {
        content: "Grand Total",
        styles: { halign: "center", fontSize: 12, fontStyle: "bold" },
      },
      {
        content: `Rs. ${formatNumber(grandTotalAmount)}/-`,
        styles: {
          halign: "center",
          fontSize: 12,
          fontStyle: "bold",
          textColor: [0, 0, 0],
        },
      },
    ]);

    // ✅ Add Summary Table Center-Aligned
    doc.autoTable({
      head: [["Category", "Price"]],
      body: summaryRows,
      columnStyles: {
        0: { cellWidth: tablePageWidth / 2, halign: "center" },
        1: { cellWidth: tablePageWidth / 2, halign: "center" },
      },
      startY: yOffset,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        halign: "center",
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      tableWidth: "auto",
      margin: {
        left: xOffsetCenter,
        right: xOffsetCenter,
      },
    });

    // ✅ ✅ ✅ FINAL SPACE AFTER TABLE
    yOffset = doc.autoTable.previous.finalY + 15;

    // 3. Process images asynchronously before table rendering
    for (const [category, products] of Object.entries(categorizedProducts)) {
      if (products.length === 0) continue;
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
Subcategory1: ${item.subcategory1 || "N/A"}
Price: Rs. ${formatNumber(item.finalPrice) || "N/A"}/-
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

    // // 4. Add Grand Total at the bottom
    // const grandTotalText = `Grand Total: Rs. ${calculateGrandTotal()}/-`;
    // const pageWidth = doc.internal.pageSize.width;
    // const marginRight = 15;
    // const textWidth = doc.getTextWidth(grandTotalText);
    // const xPos = pageWidth - textWidth - marginRight;

    // doc.setFontSize(12);
    // doc.setFont("helvetica", "bold");
    // doc.text(grandTotalText, xPos, yOffset);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(
      "Thank you for choosing Workved Interiors.",
      10,
      doc.internal.pageSize.height - 10
    );

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);

      const pageText = `Page ${i} of ${pageCount}`;
      doc.text(
        pageText,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }

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
