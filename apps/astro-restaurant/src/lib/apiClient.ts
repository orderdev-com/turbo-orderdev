import type { AppType } from 'hono-api-drizzle/src/server'
import { hc } from 'hono/client'
// import { cookies } from 'astro:cookies'

const client = hc<AppType>('http://api.orderdev.local:3000/', {
    headers() {
        let token: string | null = null;
        if (import.meta.env.SSR) {
            token = globalThis.jwtTokenValue;
        } else {
            token = document.querySelector("head > meta[session-jwt-token-value]")?.getAttribute('session-jwt-token-value');
        }
        if (!token) {
            return {};
        }
        return {
            "Authorization": `Bearer ${token}`
        };

    },

});

export default client