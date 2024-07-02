// Ondato APIs use OAuth2 Access Tokens to authenticate each request. 

import { auth } from "@/lib/constants";

// To obtain Access Token - a 
// POST
//  request must be done to our authorization server URL:

// Production: https://id.ondato.com/connect/token

// Sandbox: https://sandbox-id.ondato.com/connect/token

// Request to the authorization server must use 'Content-Type: application/x-www-form-urlencoded' header and has to contain the following information in the body:


export async function POST( request: Request ) {
    const setupId = process.env.SANDBOX_SETUPID
    console.log('setupId', setupId)
//     curl -X 'POST' \
//   'https://kycid.ondato.com/v1/identifications/filter' \
//   -H 'accept: application/json' \
//   -H 'Return-Total-Count: true' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "createdUtc": {
//     "from": "2024-07-01T14:35:28.120Z",
//     "to": "2024-07-01T14:35:28.120Z"
//   }'
    
    try {
        const auth_token = await fetch(`https://sandbox-id.ondato.com/connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=app.ondato.timeverse-labs.730fb&client_secret=7aa6ce886867d6bb4086fecfae3a4c222fa377ef6d4bbaf04ebe8331795dff8a`,
        });

        console.log('auth_token', auth_token)
        const token = await auth_token.json();
        console.log('token', token)

        if(auth_token.status !== 200) {
            throw new Error(token.message);
        }

        const response = await fetch(`https://sandbox-id.ondato.com/v1/identifications/filter`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Return-Total-Count': 'true',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access_token}`,
            },
            body: JSON.stringify({
                "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "createdUtc": {
                    "from": "2024-07-01T14:35:28.120Z",
                    "to": "2024-07-01T14:35:28.120Z",
                },
            }),
        });
        console.log('ondato response', response)
        const data = await response.json();
        console.log('ondato response', data)


        if (response.status !== 201) {
            throw new Error(data.message);
        }

        return new Response(JSON.stringify({
            'message': 'success',
        }), {
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (e) {
        console.log(e);
        

        return new Response(JSON.stringify({
            'message': 'error',
        }), {
            headers: {
                'content-type': 'application/json',
            },
        });
    }
}

// write a curl command to test the API at `localhost:3000/api/ondato/fetch`:
// curl -X 'POST' \
//   'http://localhost:3000/api/ondato/fetch' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "createdUtc": {
//     "from": "2024-07-01T14:35:28.120Z",
//     "to": "2024-07-01T14:35:28.120Z"
//   }
// }'