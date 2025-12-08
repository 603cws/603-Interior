// MultiImageCropper.jsx
import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";

export default function MultiImageCropper({
  open,
  files = [],
  onDone,
  onClose,
}) {
  const [imageURLs, setImageURLs] = useState([]);
  const [current, setCurrent] = useState(0);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [cropAreas, setCropAreas] = useState({});
  const [croppedFiles, setCroppedFiles] = useState({});

  // Convert File[] → Preview URLs
  useEffect(() => {
    if (!files.length) return;

    const urls = files.map((f) => URL.createObjectURL(f));
    setImageURLs(urls);
    setCurrent(0);
    setCroppedFiles({});
    setCropAreas({});
  }, [files]);

  function debounce(fn, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }

  const getCroppedImg = (src, cropAreaPixels, originalFile) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = src;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropAreaPixels.width;
        canvas.height = cropAreaPixels.height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          image,
          cropAreaPixels.x,
          cropAreaPixels.y,
          cropAreaPixels.width,
          cropAreaPixels.height,
          0,
          0,
          cropAreaPixels.width,
          cropAreaPixels.height
        );

        canvas.toBlob(
          (blob) => {
            const file = new File([blob], originalFile.name, {
              type: originalFile.type,
            });
            resolve(file);
          },
          originalFile.type,
          1
        );
      };
    });
  };

  const autoCropCenter = (src, originalFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;

      img.onload = async () => {
        const ratio = 4 / 3;

        let cropW = img.width;
        let cropH = cropW / ratio;

        if (cropH > img.height) {
          cropH = img.height;
          cropW = cropH * ratio;
        }

        const x = (img.width - cropW) / 2;
        const y = (img.height - cropH) / 2;

        const autoArea = { x, y, width: cropW, height: cropH };

        const file = await getCroppedImg(src, autoArea, originalFile);
        resolve(file);
      };
    });
  };

  // Save current crop
  //   const saveCurrentCrop = async () => {
  //     const area = cropAreas[current];
  //     if (!area) {
  //       alert("No crop area found");
  //       return;
  //     }

  //     const file = await getCroppedImg(imageURLs[current], area, files[current]);

  //     setCroppedFiles((prev) => ({
  //       ...prev,
  //       [current]: file,
  //     }));
  //   };

  const autoSave = useCallback(
    debounce(async (index, area) => {
      const file = await getCroppedImg(imageURLs[index], area, files[index]);

      setCroppedFiles((prev) => ({
        ...prev,
        [index]: file,
      }));
    }, 400),
    [imageURLs, files]
  );
  // Crop callback
  const onCropComplete = useCallback(
    (_, croppedAreaPixels) => {
      setCropAreas((prev) => ({
        ...prev,
        [current]: croppedAreaPixels,
      }));
      autoSave(current, croppedAreaPixels);
    },
    [current, autoSave]
  );

  // Finalization
  const handleDone = async () => {
    const result = [];

    for (let i = 0; i < files.length; i++) {
      if (croppedFiles[i]) {
        result.push(croppedFiles[i]);
      } else {
        const auto = await autoCropCenter(imageURLs[i], files[i]);
        result.push(auto);
      }
    }

    onDone(result);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="w-[90%] max-w-3xl bg-white rounded-xl p-4">
            {files.length > 1 && (
              <h2 className="text-lg font-semibold mb-3">
                Crop Images ({current + 1}/{files.length})
              </h2>
            )}

            {/* Cropper */}
            <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden">
              <Cropper
                image={imageURLs[current]}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md"
                onClick={handleDone}
                type="button"
              >
                Done
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto mt-4 p-1">
              {imageURLs.map((url, idx) => (
                <div
                  key={idx}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 cursor-pointer 
                  ${current === idx ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => setCurrent(idx)}
                >
                  <img
                    src={url}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
