import type { AppType } from 'hono-api/src/index'
import { hc } from 'hono/client'

export const testApiCall = async function () {
    const client = hc<AppType>('http://api.orderdev.local:3000/', {
        headers() {
            // generate random token
            const token = Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36)//.substring(7);
            return {
                "Authorization": `Bearer ${token}`
            };
        },
    });
    const res = await client.hello.$get({
        query: {
            name: 'kerem',
        },
    })
    console.log("res:👇");
    console.log(res);

    if (res.status === 500) { // status is typed with hono
        const data = await res.json()
        console.log(data)
    }

    if (res.ok) {
        const data = await res.json()
        console.log(data.message)
    }
}

document.getElementById('test-api')?.addEventListener('click', testApiCall)