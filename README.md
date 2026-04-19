# 🐷 @javagt/porkbun-client

A lightweight, modern, and reliable Dynamic DNS (DDNS) client for Porkbun. This package helps you keep your DNS records in sync with your external IPv4 and IPv6 addresses.

## ✨ Features

- **Dual Stack Support**: Automatically detects and updates both `A` (IPv4) and `AAAA` (IPv6) records.
- **Note-Based Syncing**: Target specific records for updates using a custom note (e.g., `match:reverse-proxy-ddns`).
- **Redundant IP Detection**: Queries multiple providers (ipify, icanhazip, etc.) to ensure accurate IP detection even if one provider is down.
- **Developer Friendly**: Clean, modern ES modules with JSDoc support.

## 🚀 Installation

Ensure you have [Node.js](https://nodejs.org/) installed, then clone or copy this library into your project.

```bash
git clone https://github.com/javagt/porkbun-client.git
cd porkbun-client
npm install
```

## ⚙️ Configuration

Create a `.env` file in the root of the project with your Porkbun API credentials:

```env
PORKBUN_API_KEY=pk1_...
PORKBUN_API_SECRET=sk1_...
PORKBUN_DOMAIN=yourdomain.com
```

> [!TIP]
> You can generate API keys in the [Porkbun Account Settings](https://porkbun.com/account/api).

## 📖 Usage

### Using the DDNS Sync Script

The easiest way to use this client is via the built-in sync script. By default, it looks for DNS records that have the note: `match:reverse-proxy-ddns`.

1. Go to your Porkbun DNS settings.
2. Add a record (e.g., `A` or `AAAA`).
3. Set the **Notes** field to `match:reverse-proxy-ddns`.
4. Run the sync:

```bash
npm start
```

### Programmatic API

You can also use the `PorkbunClient` class directly in your own applications:

```javascript
import PorkbunClient from "./PorkbunClient.mjs";

const porkbun = new PorkbunClient({
    apiKey: process.env.PORKBUN_API_KEY,
    apiSecret: process.env.PORKBUN_API_SECRET
});

// Update all records matching a specific note
await porkbun.updateMatches("example.com", "match:reverse-proxy-ddns");
```

## 🛠️ API Reference

### `PorkbunClient`

#### `constructor({ apiKey, apiSecret })`
Initializes the client with your Porkbun credentials.

#### `getDNSRecords(domain)`
Retrieves all DNS records for the specified domain.

#### `updateDNSRecord(domain, recordId, { type, content, ttl, prio })`
Updates a specific DNS record by ID.

#### `updateMatches(domain, matchstring)`
High-level helper that:
1. Detects your current IPv4/IPv6 addresses.
2. Fetches all records for the domain.
3. Updates any record whose notes contain the `matchstring` if the IP has changed.

## 📝 License

ISC License. Free for personal and commercial use.
