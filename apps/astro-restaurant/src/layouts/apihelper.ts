import client from '../lib/apiClient'

export const testApiCall = async function () {
    // client.api.users
    const res = await client.api.users.$post({
        json: {
            name: 'kerem',
            email: 'kerem@example.com'
        }
    });

    console.log("res:👇")
    console.log(res);

    if (res.ok) {
        const data = await res.json()
        console.log(data)
    } else {
        const data = await res.json()
        console.warn(data)
    }



    // const res = await client.api.hello.$get({
    //     query: {
    //         name: 'kerem',
    //     },
    // })
    // console.log("res:👇");
    // console.log(res);

    // if (res.status === 500) { // status is typed with hono
    //     const data = await res.json()
    //     console.log(data)
    // }

    // if (res.ok) {
    //     const data = await res.json()
    //     console.log(data.message)
    // }
}
export const testApiCall2 = async function () {
    const res = await client.api.users.$get()
    console.log("res:👇")
    console.log(res)
    if (res.ok) {
        const data = await res.json()
        console.log(data)
        console.log(data.supabaseUser)
    }
}

document.getElementById('test-api')?.addEventListener('click', testApiCall)
document.getElementById('test-api-2')?.addEventListener('click', testApiCall2)