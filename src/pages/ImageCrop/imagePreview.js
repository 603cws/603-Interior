import { canvasPreview } from "./canvasPreview";
let previewUrl = "";

// Convert canvas to Blob (Promise-based)
function toBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

// Returns a preview image URL (use inside <img src={previewSrc} />)
export async function imgPreview(image, crop, scale = 1, rotate = 0) {
  const canvas = document.createElement("canvas");

  canvasPreview(image, canvas, crop, scale, rotate);

  const blob = await toBlob(canvas);

  if (!blob) {
    console.error("Failed to create blob");
    return "";
  }

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  previewUrl = URL.createObjectURL(blob);
  return previewUrl;
}
