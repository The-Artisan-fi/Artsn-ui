// this is going to be serve as a route for the update idv from the ondato webhook
// when an idv is accepted or rejected it will send a payload to this route
// this route will then find the user in the MongoDB and update the idv status
import { UPDATE_USER_IDV} from "@/lib/mutations";
import { useMutation } from "@apollo/client";

export async function POST( request: Request ) {
    // the request will support a basic  authentication flow with the incoming request
    // the request will be a POST request, will have a username/password in the header, and will have a payload
    // the payload will have an id and a status

    //@ts-ignore
    const { username, password } = request.headers.get('authorization');

    if (username !== process.env.ONDATO_USERNAME || password !== process.env.ONDATO_PASSWORD) {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Access to the API"',
            },
        });
    }

    const [updateUserIdv, { loading, error, data }] = useMutation(UPDATE_USER_IDV);

    
    try {
        const { payload } = await request.json();
        const idv_id = payload.id;
        const status = payload.status;

        updateUserIdv({
            variables: {
                idvStatus: status,
                idvId: idv_id,
            },
        });

        if( loading && !error && !data) {
            console.log('loading')
        }

        if(!loading && !error && data) {
            console.log('success')
        
            return new Response(JSON.stringify({}), {
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