import { UPDATE_USER_IDV} from "@/lib/mutations";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import * as Realm from 'realm-web';

export async function POST( request: Request ) {
    try {
        const auth_header = request.headers.get('Authorization');
        const encodedCreds = auth_header!.split(' ')[1]
        const plainCreds = encodedCreds.toString().split(':')
        const username = plainCreds[0]
        const password = plainCreds[1]

        // `
        //  curl -H 'Content-Type: application/json' \
        //     -H 'Authorization : Basic ondato:ARTiXFSdAqtvh3MQi8GaxVa8dULaz67pwe77pGdyvkDp' \
        //   -d '{"id": "123", "payload": {"status": "accepted", "identityVerificationId": "d1a76177-00d5-494e-bbba-557527501a0e"}}' \
        //   -X POST \
        //   http://localhost:3000/api/ondato/idv/update
        // `

        // example payload
        // {
    //     "id": "00b6c3c8-8219-4206-a4ab-04554c97fa1a",
    //     "applicationId": "00cabb1f-4d7c-41d9-9a97-55482d920160",
    //     "createdUtc": "2023-01-16T23:40:52.4886646Z",
    //     "payload": {
    //         "id": "4c0000ac-f116-4dec-93ba-493f3809ca9b",
    //         "applicationId": "00cabb1f-4d7c-41d9-9a97-55482d920160",
    //         "createdUtc": "2023-01-16T23:40:42.77Z",
    //         "setup": {
    //             "id": "04b803f3-6c62-4560-bf5f-9ef75397ce1d",
    //             "versionId": "fde54820-00ec-4da0-87fa-c70f81729b0e"
    //         },
    //         "identityVerificationId": "d1a76177-00d5-494e-bbba-557527501a0e",
    //         "status": "Approved",
    //         "statusReason": "AutomaticallyIdentified",
    //         "isCrossChecked": false,
    //         "document": {
    //             "fullName": "NAME MIDDLE SURNAME",
    //             "firstName": "NAME MIDDLE",
    //             "lastName": "SURNAME",
    //             "documentNumber": "1740931767",
    //             "dateOfIssue": "2018-12-03",
    //             "dateOfExpiration": "2023-12-01",
    //             "dateOfBirth": "1985-02-27",
    //             "personalCode": "000.000.000-17",
    //             "countryIso3": "BRA",
    //             "type": "DriverLicense",
    //             "mrzVerified": true,
    //             "category": "B",
    //             "files": [
    //                 {
    //                     "createdUtc": "2023-01-16T23:40:43Z",
    //                     "fileId": "e2ec5e00-0000-40f3-9e1c-c7a435d1fe2f",
    //                     "fileName": "4c4811acf1164dec93ba493f3809ca9b_front_234040000.jpeg",
    //                     "fileExtension": "jpeg",
    //                     "part": "Front",
    //                     "fileType": "DocumentPhoto"
    //                 },
    //                 {
    //                     "createdUtc": "2023-01-16T23:40:43Z",
    //                     "fileId": "717e98b1-00a-0000-ab51-655b8cf0bb2d",
    //                     "fileName": "4c4811acf1164dec93ba493f3809ca9b_back_234043541.jpeg",
    //                     "fileExtension": "jpeg",
    //                     "part": "Back",
    //                     "fileType": "DocumentPhoto"
    //                 }
    //             ],
    //             "ocrValidations": [
    //                 {
    //                     "key": "Address",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "Category",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "DateOfBirth",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "DateOfExpiration",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "DateOfIssue",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "DocumentNumber",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "FirstName",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "LastName",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "Gender",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "Nationality",
    //                     "isValid": true
    //                 },
    //                 {
    //                     "key": "PersonalCode",
    //                     "isValid": true
    //                 }
    //             ]
    //         },
    //         "rules": [
    //             {
    //                 "name": "DocumentHasBothSides",
    //                 "status": "Success"
    //             },
    //             {
    //                 "name": "DocumentNotExpired",
    //                 "status": "Success"
    //             },
    //             {
    //                 "name": "DocumentHasFace",
    //                 "status": "Success"
    //             },
    //             {
    //                 "name": "DocumentTypeNotProhibited",
    //                 "status": "Success"
    //             },
    //             {
    //                 "name": "NotUnder18",
    //                 "status": "Success"
    //             }
    //         ],
    //         "registries": [],
    //         "fraudChecks": [
    //             {
    //                 "name": "DocumentManipulation",
    //                 "status": "Success"
    //             }
    //         ],
    //         "completedUtc": "2023-01-16T23:40:51Z"
    //     },
    //     "type": "KycIdentification.Approved"
    // }

        if (username !== process.env.ONDATO_USERNAME || password !== process.env.ONDATO_PASSWORD) {
            return new Response('Unauthorized', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Access to the API"',
                },
            });
        }
        const {
            payload,
        }= await request.json();

        const idvId = payload.identityVerificationId;
        const status = payload.status;
        
        console.log('idvId', idvId)
        console.log('status', status)

        const graphqlUri = process.env.NEXT_PUBLIC_MONGO_ENDPOINT;
        const app = new Realm.App('artisan-gql-scrtu');
        async function getValidAccessToken() {
            if (!app.currentUser) {
                await app.logIn(Realm.Credentials.anonymous());
            } else {
                await app.currentUser.refreshAccessToken();
            }
            return app.currentUser!.accessToken;
        }
        const client = new ApolloClient({
            link: new HttpLink({
                uri: graphqlUri,
                fetch: async (uri, options) => {
                const accessToken = await getValidAccessToken();
                // @ts-expect-error : 'headers' does not exist on type 'RequestInit'
                options.headers.Authorization = `Bearer ${accessToken}`;
                return fetch(uri, options);
                },
            }),
            cache: new InMemoryCache(),
        });

        const _data = await client.mutate({
            mutation: UPDATE_USER_IDV,
            variables: {
                idvId: idvId,
                idvStatus: status,
            },
        });


        // TODO UPDATE SOLANA PROGRAM -- BUYERPROFILE VERIFY
        

        console.log('__data,', _data)
        
        if( _data) {
            return new Response(
                JSON.stringify({
                    message: 'success',
                }),
                {
                    headers: {
                        'content-type': 'application/json',
                    },
                }
            );
        } else {
            return new Response(JSON.stringify({
                message: 'error',
            }), {
                headers: {
                    'content-type': 'application/json',
                },
            });
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function OPTIONS( request: Request ) {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        },
    });
};