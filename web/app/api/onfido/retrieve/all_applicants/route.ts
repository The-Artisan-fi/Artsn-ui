// GET /v3.6/applicants?page=1&per_page=5 HTTP/1.1
// Host: api.eu.onfido.com
// Authorization: Token token=<YOUR_API_TOKEN>

export async function GET() {
    console.log('onfido check route pinged')
    try {
        const response = await fetch(`https://api.eu.onfido.com/v3.6/applicants?page=1&per_page=5   `, {
            method: 'GET',
            headers: {
                'Authorization': `Token token=${process.env.ONFIDO_TOKEN}`,
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            // }),
        });

        const data = await response.json();
        console.log('onfido response', data);
        return new Response(JSON.stringify(data), {
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}