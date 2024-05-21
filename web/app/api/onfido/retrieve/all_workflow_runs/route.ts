// GET /v3.6/workflow_runs HTTP/1.1
// Host: api.eu.onfido.com
// Authorization: Token token=<YOUR_API_TOKEN>


export async function GET() {
    console.log('onfido check route pinged')
    try {
        const response = await fetch('https://api.eu.onfido.com/v3.6/workflow_runs?status=processing,approved,declined', {
            method: 'GET',
            headers: {
                'Authorization': `Token token=${process.env.ONFIDO_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('onfido get all runs response', data);
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