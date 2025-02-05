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
    doc.addImage(logoUrl, "PNG", 10, 10, 15, 15);

    // Add company name near the logo
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("603 The Coworking Space", 50, 25);

    // Add a horizontal line below the header
    doc.setLineWidth(0.5);
    doc.line(10, 40, doc.internal.pageSize.width - 10, 40);

    // Prepare table data
    const headers = ["Product Details", "Product Image", "Addons"];
    const rows = [];

    for (const item of selectedData) {
      const productDetails = `
Title: ${item.product_variant.variant_title || "N/A"}
Category: ${item.category || "N/A"}
Subcategory: ${item.subcategory || "N/A"}
Price: ${item.product_variant.variant_price || "N/A"}/-
Description: ${item.product_variant.variant_details || "N/A"}
      `;

      let productImage = "No image available";
      if (item.product_variant.variant_image) {
        try {
          const fileName = new URL(item.product_variant.variant_image).pathname
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
Addon Price: ${addon.addon_price || "N/A"}/-
          `;
          addonDetails.push(addonText);
        }
      }

      const addonTextCombined = addonDetails.join("\n");

      rows.push([
        { content: productDetails, styles: { halign: "left", fontSize: 10 } },
        productImage !== "No image available"
          ? { content: "", styles: { cellPadding: 5 }, image: productImage }
          : "No image available",
        {
          content: addonTextCombined,
          styles: { halign: "left", fontSize: 10 },
        },
      ]);
    }

    // Render table
    doc.autoTable({
      head: [headers],
      body: rows.map((row) =>
        row.map((cell) => {
          if (cell.image) {
            return {
              content: "",
              styles: { cellPadding: 5 },
              image: cell.image,
            };
          }
          return cell;
        })
      ),
      didDrawCell: (data) => {
        // Ensure the image is added only once
        if (data.cell.raw && data.cell.raw.image && !data.cell.raw.imageAdded) {
          doc.addImage(
            data.cell.raw.image,
            "PNG",
            data.cell.x + 10,
            data.cell.y + 5,
            30,
            30
          );
          // Mark the image as added to prevent duplication
          data.cell.raw.imageAdded = true;
        }
      },
      columnStyles: {
        0: { cellWidth: 70, valign: "top" },
        1: { cellWidth: 50, valign: "middle" },
        2: { cellWidth: 70, valign: "top" },
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5,
      },
      startY: 45,
      margin: { top: 10, left: 15, right: 15 },
    });

    // Now fetch the final Y position **after** rendering the table
    const finalY = doc.autoTable.previous.finalY + 10;

    // Calculate the Grand Total position
    const grandTotalText = `Grand Total: ${calculateGrandTotal()}/-`;
    const pageWidth = doc.internal.pageSize.width;
    const marginRight = 15;
    const textWidth = doc.getTextWidth(grandTotalText);
    const xPos = pageWidth - textWidth - marginRight;

    // Add grand total at the bottom right
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(grandTotalText, xPos, finalY);

    // Save the PDF
    doc.save("products_table.pdf");
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
