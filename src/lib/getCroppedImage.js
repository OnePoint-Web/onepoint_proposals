export const getCroppedImage = async (imageSrc, cropPixels) => {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], "cropped.jpg", {
        type: "image/jpeg",
      });
      resolve(file);
    }, "image/jpeg");
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });