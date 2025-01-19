import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import sharp from "sharp";
import * as cheerio from "cheerio";

const outputDir = path.resolve("public/assets/icons");
const jsonPath = path.resolve("content/link-sets.json");

async function fetchImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Check for og:image
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) {
      return new URL(ogImage, url).href;
    }

    // 2. Check for possible logo links
    const logoSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
    ];

    for (const selector of logoSelectors) {
      const logo = $(selector).attr("href");
      if (logo) {
        const fullLogoUrl = new URL(logo, url).href;

        // Optionally, fetch the image to check its size
        const logoResponse = await fetch(fullLogoUrl);
        const buffer = await logoResponse.buffer();
        const size = await sharp(buffer).metadata();

        if (size.width && size.width >= 48 && size.height && size.height >= 48) {
          return fullLogoUrl; // Return if size is acceptable
        }
      }
    }

    // 3. Fallback to null
    return null;
  } catch (error) {
    console.error(`Failed to fetch image for ${url}:`, error);
    return null;
  }
}

async function getBaseUrl(url: string): Promise<string> {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
  } catch (error) {
    console.error(`Failed to parse URL ${url}:`, error);
    return url;
  }
}

async function downloadAndSaveImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    await sharp(buffer).resize(48, 48).toFile(path.join(outputDir, filename));
    console.log(`Saved thumbnail: ${filename}`);
  } catch (error) {
    console.error(`Failed to download or process image from ${url}:`, error);
  }
}

async function processLinks() {
  try {
    const jsonContent = await fs.readFile(jsonPath, "utf-8");
    const data = JSON.parse(jsonContent);

    for (const linkSet of data["link-sets"]) {
      for (const link of linkSet.links) {
        if (link.thumbnail) continue;

        console.log(`Processing: ${link.url}`);
        let thumbnailUrl = await fetchImage(link.url);

        if (!thumbnailUrl) {
          const baseUrl = await getBaseUrl(link.url);
          thumbnailUrl = await fetchImage(baseUrl);
        }

        if (thumbnailUrl) {
          const filename = `${link.title.toLowerCase().replace(/\s+/g, "-")}.png`;
          await downloadAndSaveImage(thumbnailUrl, filename);
          link.thumbnail = `/assets/icons/${filename}`;
        } else {
          console.log(`No thumbnail found for ${link.url}`);
        }
      }
    }

    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), "utf-8");
    console.log("Updated JSON file with thumbnails.");
  } catch (error) {
    console.error("Failed to process links:", error);
  }
}

// Ensure output directory exists
(async () => {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    await processLinks();
  } catch (error) {
    console.error("Error initializing script:", error);
  }
})();
