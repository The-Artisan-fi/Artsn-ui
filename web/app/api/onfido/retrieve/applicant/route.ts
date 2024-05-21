// GET /v3.6/applicants/<APPLICANT_ID> HTTP/1.1
// Host: api.eu.onfido.com
// Authorization: Token token=<YOUR_API_TOKEN>


export async function POST( request: Request ) {
    console.log('onfido check route pinged')
    const { applicant_id } = await request.json();
    try {
        const response = await fetch(`https://api.eu.onfido.com/v3.6/applicants/${applicant_id}`, {
            method: 'POST',
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