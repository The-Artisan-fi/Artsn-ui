// POST /v3.6/workflow_runs HTTP/1.1
// Host: api.eu.onfido.com
// Authorization: Token token=<YOUR_API_TOKEN>
// Content-Type: application/json

// {
//   "workflow_id": "<WORKFLOW_ID>",
//   "applicant_id": "<APPLICANT_ID"
// }

export async function POST( request: Request ) {
    console.log('onfido route pinged')
    const workflow_id = process.env.ONFIDO_WORKFLOW;
    const { applicant_id } = await request.json();
    try {
        const response = await fetch('https://api.eu.onfido.com/v3.6/workflow_runs/', {
            method: 'POST',
            headers: {
                'Authorization': `Token token=${process.env.ONFIDO_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                workflow_id: workflow_id,
                applicant_id: applicant_id,
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