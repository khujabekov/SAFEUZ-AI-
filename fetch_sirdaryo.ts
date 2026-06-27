import fs from "fs";
import path from "path";

async function run() {
  const url = "https://raw.githubusercontent.com/akbartus/GeoJSON-Uzbekistan/main/geojson/sirdaryo_region_districts.geojson";
  console.log("Fetching sirdaryo geojson...");
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  const geojson = await res.json();
  
  console.log(`Loaded ${geojson.features.length} features.`);
  
  // Save the file as /src/components/sirdaryo.geojson
  console.log(`Current working directory: ${process.cwd()}`);
  const destPath = path.join(process.cwd(), "src", "components", "sirdaryo.geojson");
  
  // Ensure the directory exists
  if (!fs.existsSync(path.dirname(destPath))){
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
  }

  fs.writeFileSync(destPath, JSON.stringify(geojson, null, 2), "utf-8");
  console.log(`Saved geojson to ${destPath}`);
}

run().catch(console.error);
