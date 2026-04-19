import PorkbunClient from "./PorkbunClient.mjs";

// Load .env file if it exists
try {
    process.loadEnvFile('.env');
} catch (err) {
    console.warn("Notice: .env file not found or could not be loaded.");
}

const API_KEY = process.env.PORKBUN_API_KEY;
const API_SECRET = process.env.PORKBUN_API_SECRET;
const DOMAIN = process.env.PORKBUN_DOMAIN // "example.com"
const MATCH_NOTE = "match:reverse-proxy-ddns";

if (!API_KEY || !API_SECRET) {
    console.error("Error: PORKBUN_API_KEY and PORKBUN_API_SECRET must be set in environment.");
    process.exit(1);
}

async function sync() {
    const porkbun = new PorkbunClient({ apiKey: API_KEY, apiSecret: API_SECRET });
    await porkbun.updateMatches(DOMAIN, MATCH_NOTE);
}

sync();
