import IPAddressClient from "./IPAddressClient.mjs";

/**
 * A simple client for the Porkbun DNS API.
 */
export default class PorkbunClient {
    constructor({ apiKey, apiSecret }) {
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.baseUrl = "https://api.porkbun.com/api/json/v3"
    }

    /**
     * Get all DNS records for a domain.
     * @param {string} domain 
     * @returns {Promise<Object>}
     */
    async getDNSRecords(domain) {
        const target = `${this.baseUrl}/dns/retrieve/${domain}`
        const response = await fetch(target, {
            method: "POST", // Porkbun API often expects POST even for retrieval to pass credentials securely
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                apikey: this.apiKey,
                secretapikey: this.apiSecret
            })
        })

        if (!response.ok) {
            throw new Error(`Failed to retrieve records for ${domain}: ${response.statusText}`)
        }

        return await response.json()
    }

    /**
     * Update an existing DNS record.
     * @param {string} domain 
     * @param {string} id 
     * @param {Object} record 
     * @returns {Promise<Object>}
     */
    async updateDNSRecord(domain, id, { type, content, ttl, prio }) {
        const target = `${this.baseUrl}/dns/edit/${domain}/${id}`
        const response = await fetch(target, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                apikey: this.apiKey,
                secretapikey: this.apiSecret,
                type,
                content,
                ttl,
                prio
            })
        })

        if (!response.ok) {
            throw new Error(`Failed to update record ${id}: ${response.statusText}`)
        }

        return await response.json()
    }

    async updateMatches(domain, matchstring) {

        // 1. Get current IPs
        const [ipv4, ipv6] = await Promise.all([
            IPAddressClient.getMyIpv4(),
            IPAddressClient.getMyIpv6()
        ]);

        if (!ipv4 && !ipv6) {
            throw new Error("Could not detect any external IP address.");
        }

        // 2. Fetch DNS records
        const response = await this.getDNSRecords(domain);
        const records = response.records || [];

        // 3. Filter and update
        let updatedCount = 0;
        for (const record of records) {
            if (record.notes?.includes(matchstring)) {
                const currentIp = record.type === "AAAA" ? ipv6 : ipv4;

                if (!currentIp) continue;
                if (record.content === currentIp) continue;

                await this.updateDNSRecord(domain, record.id, {
                    type: record.type,
                    content: currentIp,
                    ttl: record.ttl,
                    prio: record.prio
                });
                updatedCount++;
            }
        }
    }
}
