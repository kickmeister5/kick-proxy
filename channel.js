export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || 'batuhanfurkan5';

  const headers = {
    'Accept': 'application/json',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://kick.com/' + slug,
    'Origin': 'https://kick.com',
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
  };

  // Try v2 first, fallback to v1
  let data = null;
  let lastError = '';

  for (const endpoint of [
    `https://kick.com/api/v2/channels/${slug}`,
    `https://kick.com/api/v1/channels/${slug}`,
  ]) {
    try {
      const res = await fetch(endpoint, { headers });
      if (res.ok) {
        data = await res.json();
        break;
      }
      lastError = `${endpoint} → ${res.status}`;
    } catch (e) {
      lastError = e.message;
    }
  }

  if (!data) {
    return new Response(JSON.stringify({ error: lastError }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    },
  });
}
