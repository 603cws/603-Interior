import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { supabase } from "../../services/supabase";

const PDFGenerator = {
  generatePDF: async (selectedData) => {
    const doc = new jsPDF();
    const baseImageUrl =
      "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

    const logoUrl = "./logo/logo.png"; // Replace with the URL of your logo image

    // Add the logo to the top-left corner
    doc.addImage(logoUrl, "PNG", 10, 10, 15, 15); // Adjust the width and height for the logo

    // Add company name near the logo
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("603 The Coworking Space", 50, 25); // Adjust the position as needed

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

          // Insert data into Supabase for each addon dynamically
          await insertDataIntoSupabase(selectedData); // Passing entire item to extract IDs from selectedData
        }
      }

      const addonTextCombined = addonDetails.join("\n");

      // Prepare row for the table
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

    // Render table with styles
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
        if (data.cell.raw && data.cell.raw.image) {
          doc.addImage(
            data.cell.raw.image,
            "PNG",
            data.cell.x + 10,
            data.cell.y + 5,
            30,
            30 // Adjusted size for better appearance
          );
        }
      },
      columnStyles: {
        0: { cellWidth: 70, valign: "top" }, // Product Details
        1: { cellWidth: 50, valign: "middle" }, // Product Image
        2: { cellWidth: 70, valign: "top" }, // Addons
      },
      headStyles: {
        fillColor: [22, 160, 133], // Attractive teal header color
        textColor: [255, 255, 255], // White text
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5,
      },
      startY: 45, // Adjusted start position to leave space for the header
      margin: { top: 10, left: 15, right: 15 },
    });

    // Save the PDF
    doc.save("products_table.pdf");
  },
};

// Function to insert data into the Supabase `boqdata` table, now extracting IDs from the passed item directly
const insertDataIntoSupabase = async (selectedData) => {
  try {
    // Arrays to hold the IDs
    const productIds = [];
    const productVariantIds = [];
    const addonIds = [];
    const addonVariantIds = [];

    // Loop through selected data and collect the IDs
    selectedData.forEach((item) => {
      // Collect product IDs
      if (item.id) productIds.push(item.id);

      // Collect product variant IDs
      if (item.product_variant?.variant_id)
        productVariantIds.push(item.product_variant.variant_id);

      // Collect addon IDs and addon variant IDs
      if (item.addons) {
        Object.keys(item.addons).forEach((addonKey) => {
          const addon = item.addons[addonKey];
          if (addon.addonId) addonIds.push(addon.addonId);
          if (addon.variantID) addonVariantIds.push(addon.variantID);
        });
      }
    });

    // Join arrays into comma-separated strings
    const productIdStr = productIds.join(",");
    const productVariantIdStr = productVariantIds.join(",");
    const addonIdStr = addonIds.join(",");
    const addonVariantIdStr = addonVariantIds.join(",");

    // Create the formatted data object
    const formattedData = {
      product_id: productIdStr,
      product_variant_id: productVariantIdStr,
      addon_id: addonIdStr,
      addon_variant_id: addonVariantIdStr,
    };

    // Debugging logs to check the final data
    console.log("Formatted data to insert:", formattedData);

    // Insert the formatted data into Supabase as a single row
    const { data, error } = await supabase
      .from("boqdata")
      .insert([formattedData]);

    if (error) {
      console.error("Error inserting data into Supabase:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  } catch (error) {
    console.error("Error during insertion:", error);
  }
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 50; // Adjusted width for smaller image
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

export default PDFGenerator;
