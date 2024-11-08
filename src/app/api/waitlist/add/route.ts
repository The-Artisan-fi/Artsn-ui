import { NextRequest, NextResponse } from "next/server";

const handler = async(req: NextRequest) => {
    const body = await req.json().catch(() => null);

    if (!body) {
        return new Response('Request body is required', {
            status: 400,
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbyMAq0FYFRFbDp6l6fOEKdDyxmrjtRCuLQm_j-QbcI4yl8fqmDk6zMkMiN5QTfEGTAu6w/exec';
        console.log('Request body:', body);

        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log('Response text:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (error) {
            console.error('Error parsing response:', error);
            return new Response(`Error parsing response: ${responseText}`, {
                status: 500,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        if (!response.ok) {
            throw new Error(`Failed to add to waitlist: ${response.status} ${response.statusText}`);
        }

        console.log('Waitlist response:', data);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in handler:', error);
        return new Response(`Error adding to waitlist: ${error}`, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}

export async function GET() {
    return new Response('Use POST for adding to waitlist', {
        status: 405,
        headers: { 'Allow': 'POST' },
    });
}

export async function POST(request: NextRequest) {
    console.log('POST request received');
    return handler(request);
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
    });
}