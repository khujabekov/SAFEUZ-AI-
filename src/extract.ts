import fs from "fs";

async function run() {
  const url = "https://api.github.com/";
  console.log("Fetching geojson...");
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
  
  // Let's print all shapeNames to see them
  const names = geojson.features.map((f: any) => f.properties.shapeName);
  console.log("All shapeNames inside geojson:", JSON.stringify(names, null, 2));
}

run().catch(console.error);
