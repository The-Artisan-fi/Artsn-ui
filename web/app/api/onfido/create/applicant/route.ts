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
    
    try {
        const { first_name, last_name, dob, address } = await request.json();
        console.log('incoming request for applicant', first_name, last_name, dob, address)
        const applicant = {
            first_name,
            last_name,
            dob,
            address,
        };
        console.log('onfido applicant route pinged CREATE APPLICANT', applicant);
        const test_applicant = {
            first_name: 'Jane',
            last_name: 'Doe',
            dob: '1990-01-31',
            address: {
                building_number: '100',
                street: 'Main Street',
                town: 'London',
                postcode: 'SW4 6EH',
                country: 'GBR',
            },
        };
        const response = await fetch('https://api.eu.onfido.com/v3.6/applicants/', {
            method: 'POST',
            headers: {
                'Authorization': `Token token=${process.env.ONFIDO_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                // applicant
                test_applicant
            ),
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
    }
}