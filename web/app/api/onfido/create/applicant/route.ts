// POST /v3.6/applicants/ HTTP/1.1
// Host: api.eu.onfido.com
// Authorization: Token token=<YOUR_API_TOKEN>
// Content-Type: application/json

// {
//   "first_name": "Jane",
//   "last_name": "Doe",
//   "dob": "1990-01-31",
//   "address": {
//     "building_number": "100",
//     "street": "Main Street",
//     "town": "London",
//     "postcode": "SW4 6EH",
//     "country": "GBR"
//   }
// }

export async function POST( request: Request ) {
    console.log('onfido route pinged')
    console.log('onfido token', process.env.ONFIDO_TOKEN)
    
    try {
        const { first_name, last_name, dob, address } = await request.json();
        const applicant = {
            first_name,
            last_name,
            dob,
            address,
        };
        const response = await fetch('https://api.eu.onfido.com/v3.6/applicants/', {
            method: 'POST',
            headers: {
                'Authorization': `Token token=${process.env.ONFIDO_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicant),
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