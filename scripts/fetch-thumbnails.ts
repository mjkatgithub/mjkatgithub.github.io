import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import sharp from "sharp";

interface Link {
  title: string;
  url: string;
  thumbnail: string;
}

interface LinkSet {
  title: string;
  links: Link[];
}

interface LinkSets {
  "link-sets": LinkSet[];
}

const jsonPath = path.resolve(__dirname, "../content/link-sets.json");
const iconsPath = path.resolve(__dirname, "../public/assets/icons");

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await response.text();
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);
    return ogImageMatch && ogImageMatch[1] ? ogImageMatch[1] : null;
  } catch (error) {
    console.error(`Failed to fetch og:image for ${url}:`, (error as Error).message);
    return null;
  }
}

async function downloadAndResizeImage(imageUrl: string, savePath: string): Promise<void> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);
    const buffer = await response.buffer();
    await sharp(buffer)
      .resize(48, 48)
      .toFile(savePath);
    console.log(`Saved thumbnail: ${savePath}`);
  } catch (error) {
    console.error(`Failed to process image: ${imageUrl}`, (error as Error).message);
  }
}

async function processLinks(): Promise<void> {
  const linkSets: LinkSets = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  for (const linkSet of linkSets["link-sets"]) {
    for (const link of linkSet.links) {
      if (!link.thumbnail) {
        console.log(`Fetching og:image for: ${link.url}`);
        const ogImage = await fetchOgImage(link.url);
        if (ogImage) {
          const fileName = `${link.title.replace(/\s+/g, "_").toLowerCase()}.png`;
          const savePath = path.join(iconsPath, fileName);
          await downloadAndResizeImage(ogImage, savePath);
          // Update JSON with the new thumbnail path
          link.thumbnail = `/assets/icons/${fileName}`;
        } else {
          console.log(`No og:image found for: ${link.url}`);
        }
      }
    }
  }
  // Save updated JSON
  fs.writeFileSync(jsonPath, JSON.stringify(linkSets, null, 2));
  console.log("Updated link-sets.json with thumbnails.");
}

processLinks().catch((error) => {
  console.error("An error occurred:", (error as Error).message);
});
