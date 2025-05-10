// app/api/bug/route.ts
import { NextRequest } from 'next/server'

const handler = async (req: NextRequest) => {
  const body = await req.json().catch(() => null)

  if (!body) {
    return new Response('Bug report data is required', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  try {
    const scriptUrl =
      'https://script.google.com/macros/s/AKfycbypkHmIgZ0aTEVIXQbgLRNydRVgt2CEFZKIPahJGaQykEhFvo_CmqG-oypyp_R_1JT8/exec'

    if (!scriptUrl) {
      throw new Error('Google Script URL is not configured')
    }

    console.log('Bug report data:', body)

    // Add deployment key to URL if provided
    const urlWithAuth = scriptUrl

    // Convert the body to URL encoded form data as required by Google Scripts
    const formData = new URLSearchParams()
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    const response = await fetch(urlWithAuth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: formData,
    })

    console.log('Response status:', response.status)
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    )

    // Handle non-200 responses
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Authentication failed with Google Script')
        return new Response(
          'Authentication failed with Google Script. Please check your deployment settings.',
          {
            status: 401,
            headers: { 'Content-Type': 'text/plain' },
          }
        )
      }

      const errorText = await response.text()
      console.error('Google Script error response:', errorText)
      return new Response(
        `Failed to submit bug report: ${response.status} ${response.statusText}`,
        {
          status: response.status,
          headers: { 'Content-Type': 'text/plain' },
        }
      )
    }

    // Try to parse JSON response
    const responseText = await response.text()
    console.log('Response text:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      console.error('Error parsing response:', error)
      console.error('Raw response:', responseText)
      return new Response(
        'Invalid response from Google Script. Please check the script configuration.',
        {
          status: 500,
          headers: { 'Content-Type': 'text/plain' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        issueId: data.issueId || 'UNKNOWN',
        message: 'Bug report submitted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in handler:', error)
    return new Response(`Error submitting bug report: ${error}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

export async function GET() {
  return new Response('Use POST for submitting bug reports', {
    status: 405,
    headers: { Allow: 'POST' },
  })
}

export async function POST(request: NextRequest) {
  console.log('Bug report POST request received')
  return handler(request)
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  })
}
