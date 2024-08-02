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
    const {
        dob,
        email,
        firstName,
        lastName,
        middleName,
        personalCode,
        phoneNumber,
        address,
    } = await request.json();
    // console.log('backend request', dob, email, firstName, lastName, middleName, personalCode, phoneNumber, countryCode, setupId)
    console.log('url', `${process.env.ONDATO_SANDBOX_URL}/identity-verifications`)
    // create a regex for the phone, it should remove any ( ) - and + signs and spaces, returning only the numbers
    const phoneSanitized = phoneNumber.replace(/[\s\-\+\(\)]/g, '');
    const test_user = {
        "externalReferenceId": "123",
        "registration": {
          "dateOfBirth": "2021-01-14",
          "email": "John@email.com",
          "firstName": "John",
          "lastName": "Johnson",
          "middleName": "Adam",
          "personalCode": "1214148111000",
          "phoneNumber": 370624515141,
          "countryCode": "LT"
        },
        "setupId": '76928bf2-fbbd-470a-8e1a-b257f1f9d502',
      };

      const user = {
        "registration": {
          "dateOfBirth": dob,
          "email": email,
          "firstName": firstName,
          "lastName": lastName,
          "middleName": middleName,
          "phoneNumber": phoneSanitized,
          "fullAddress": address,
          "countryCode": address.countryCode,
        },
        "setupId": setupId,
      };
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

        const response = await fetch(`https://sandbox-idvapi.ondato.com/v1/identity-verifications`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        console.log('ondato response', response)
        const data = await response.json();
        console.log('ondato response', data)
        const id = data.id;
        const idv_id = {
            'idv_id': id
        }

        if (response.status !== 201) {
            throw new Error(data.message);
        }

        return new Response(JSON.stringify(idv_id), {
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}