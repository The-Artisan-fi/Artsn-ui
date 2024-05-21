// POST /v3.6/sdk_token HTTP/1.1
// Host: api.eu.onfido.com
// Authorization: Token token=<YOUR_API_TOKEN>
// Content-Type: application/json

// {
//   "applicant_id": "<APPLICANT_ID>",
//   "referrer:": "https://*.example.com/example_page/*",
//   "cross_device_url": "https://example.com"
// }

export async function POST( request: Request ) {
    console.log('onfido route pinged')
    const { applicant_id } = await request.json();
    try {
        const response = await fetch('https://api.eu.onfido.com/v3.6/sdk_token/', {
            method: 'POST',
            headers: {
                'Authorization': `Token token=${process.env.ONFIDO_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicant_id: applicant_id,
                // referrer: "https://*.localhost:3000/*",
            }),
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