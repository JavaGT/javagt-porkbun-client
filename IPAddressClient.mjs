
export default class IPAddressClient {
    static redundancy = 3

    static ipv4Providers = {
        "api.ipify.org": "https://api.ipify.org",
        "icanhazip.com": "https://icanhazip.com",
        "ifconfig.me/ip": "https://ifconfig.me/ip",
        "ipinfo.io/ip": "https://ipinfo.io/ip",
        "ipapi.co/ip": "https://ipapi.co/ip",
    }

    static ipv6Providers = {
        "api6.ipify.org": "https://api6.ipify.org",
        "ipv6.icanhazip.com": "https://ipv6.icanhazip.com",
        "ifconfig.me/ip": "https://ifconfig.me/ip", // Usually handles dual stack
        "v6.ident.me": "https://v6.ident.me",
    }

    /**
     * Get the external IPv4 address.
     * @returns {Promise<string>}
     */
    static async getMyIpv4() {
        return this._getIpFromProviders(this.ipv4Providers)
    }

    /**
     * Get the external IPv6 address.
     * @returns {Promise<string>}
     */
    static async getMyIpv6() {
        return this._getIpFromProviders(this.ipv6Providers)
    }

    /**
     * Internal helper to fetch IP from multiple providers and return the most common result.
     * @param {Object} providers 
     * @returns {Promise<string|null>}
     * @private
     */
    static async _getIpFromProviders(providers) {
        const fetchPromises = Object.entries(providers).map(async ([name, url]) => {
            try {
                const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
                if (!response.ok) return null
                const text = await response.text()
                return text.trim()
            } catch (err) {
                // console.error(`Failed to fetch IP from ${name}:`, err.message)
                return null
            }
        })

        const results = (await Promise.all(fetchPromises)).filter(Boolean)
        
        if (results.length === 0) return null

        const counts = {}
        for (const result of results) {
            counts[result] = (counts[result] || 0) + 1
        }

        // Sort by occurrence
        const sortedResults = Object.keys(counts).sort((a, b) => counts[b] - counts[a])
        
        // Return the most common result if it meets redundancy (or just return the best guess if not)
        return sortedResults[0]
    }
}