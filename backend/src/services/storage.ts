import ImageKit from "imagekit";

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey: (process.env.IMAGEKIT_PUBLIC_KEY || "").trim(),
  privateKey: (process.env.IMAGEKIT_PRIVATE_KEY || "").trim(),
  urlEndpoint: (process.env.IMAGEKIT_URL_ENDPOINT || "").trim(),
});

/**
 * Uploads a PNG buffer to ImageKit CDN and returns the public URL.
 */
export const uploadScreenshot = async (
  filename: string,
  imageBuffer: Buffer
): Promise<string> => {
  try {
    const response = await imagekit.upload({
      file: imageBuffer,
      fileName: filename,
      folder: "/screenshots",
    });

    console.log(`☁️ Cloud Upload Success (ImageKit): ${response.url}`);
    return response.url;
  } catch (error) {
    console.error(`❌ ImageKit upload failed for ${filename}, using local fallback:`, error);
    return `/screenshots/${filename}`;
  }
};