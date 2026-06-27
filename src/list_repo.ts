async function run() {
  const repo = "akbartus/GeoJSON-Uzbekistan";
  const url = `https://api.github.com/repos/${repo}/contents/geojson`;
  console.log(`Fetching contents of ${repo}...`);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  const files = await res.json();
  console.log("Files in repo:", JSON.stringify(files.map((f: any) => ({ name: f.name, path: f.path, download_url: f.download_url })), null, 2));
}

run().catch(console.error);
