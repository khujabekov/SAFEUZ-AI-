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
  
  // Print each feature's properties to verify tuman names
  geojson.features.forEach((f: any, idx: number) => {
    console.log(`Feature ${idx + 1}:`, JSON.stringify(f.properties, null, 2));
  });

  // Save the file as /src/components/sirdaryo.geojson
  const destPath = path.join(process.cwd(), "src", "components", "sirdaryo.geojson");
  fs.writeFileSync(destPath, JSON.stringify(geojson, null, 2), "utf-8");
  console.log(`Saved geojson to ${destPath}`);
}

run().catch(console.error);
