import type { AppType } from 'hono-api/src/index'
import { hc } from 'hono/client'

const client = hc<AppType>('http://api.orderdev.local:3000/', {
    headers() {
        // generate random token
        const token = Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36)//.substring(7);
        return {
            "Authorization": `Bearer ${token}`
        };
    },
});

export const testApiCall = async function () {

    const res = await client.api.hello.$get({
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
export const testApiCall2 = async function () {
    const res = await client.api.users.$get();
    console.log("res:👇")
    console.log(res)
    if (res.ok) {
        const data = await res.json()
        console.log(data)
    }
}

document.getElementById('test-api')?.addEventListener('click', testApiCall)
document.getElementById('test-api-2')?.addEventListener('click', testApiCall2)