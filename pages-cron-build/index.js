//addEventListener('fetch', event => {
//  event.respondWith(handleRequest(event.request))
//})

addEventListener('scheduled', (event) => {
    event.waitUntil(handleSchedule(event))
})
  
async function handleSchedule(event) {
    const account_id = ENV_ACCOUNT_ID
    const pages_id = ENV_PAGES_ID
    const init = {
        method: 'POST',
        headers: {
            'X-Auth-Key': SECRET_AUTH_KEY,
            'X-Auth-Email': SECRET_AUTH_EMAIL
        }
    }
    return fetch(`https://api.cloudflare.com/client/v4/accounts/${account_id}/pages/projects/${pages_id}/deployments`, init)
}
