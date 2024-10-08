# Monaco Foundry <> Artisan

Register, Protect, Sell IP.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Solana Program](#solana-program)
- [API Routes](#api-routes)
   - [Auth](#auth)
      - [GraphQL](#graphql-api-route)
      - [Login](#login-api-route)
      - [Register](#register-api-route)
   - [AWS](#aws)
      - [Upload](#upload-api-route)
      - [Fetch](#fetch-api-route)
   - [Stripe](#stripe)
      - [Stripe API](#stripe-api-route)
      - [Process](#process-api-route)
   - [Protocol](#protocol)
      - [Create Profile](#create-profile-api-route)
- [Hooks](#hooks)
   - [Verify Upload](#verify-upload)
   - [Add to Waitlist](#add-to-waitlist)
   - [Use Auth](#use-user-mgmt)
   - [Use S3](#use-s3)
- [User Flow](#user-flow)
- [Contributing](#contributing)
- [License](#license)

## Features

- Upload Multimedia to AWS s3 bucket.
- `ProofHash` generated and stored with `IpAsset` Details in MongoDB
- `IPAsset` Details submited to custom Solana Program
- Solana Program stores `IPAsset` Details on-chain
    - IP Name
    - ProofHash
    - Upload Date
- Solana Program mints Metaplex-Core NFT and returns it to User's wallet (displays as certificate in on-site inventory)

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

List any software, tools, or dependencies that need to be installed before setting up the project.

- Node.js (version X.X.X or higher)
- npm

### Installation

Step-by-step guide to install and set up your project.

1. Clone the repository:
   ```
   git clone https://github.com/maweiche/monaco-foundry-solana.git
   ```

2. Navigate to the project directory:
   ```
   cd monaco-foundry-solana
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables (see [Environment Variables](#environment-variables) section).

5. Run the development server:
   ```
   npm run dev
   ```

## Usage

Provide instructions and examples on how to use your project.

## Environment Variables

This project uses environment variables for configuration. Create a `.env.local` file in the root directory of the project and add the following variables:

```
MONGODB_URI=
JWT_SECRET=

HELIUS_DEVNET=
PRIVATE_KEY=
UMI_KEY=
SIGNING_AUTHORITY=

AWS_REGION=
AWS_ACCESS_KEY_ID=C
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=

NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_SECRET_KEY=
SIGNING_AUTHORITY=
NEXT_PUBLIC_HOST=
```


## Solana Program

This project interacts with a Solana program. Here's a brief explanation of the program and its functionality:

[Provide a brief description of your Solana program, its purpose, and main features]

Key aspects of the Solana program:
- Program ID: `G56BJf467y89k5HwfvuPi4Fz7x1YRtugFUcp4evBh3A7`
- Main instructions: 
- Data structures: 

For more detailed information about the Solana program, please refer to the [Solana Program Documentation](#).

## WORK IN PROGRESS

### AUTH

The below endpoints are all located in the `/api/auth` section and handle the Web2 Database logic.

### GraphQL API Route

This project implements a GraphQL API route using Apollo Server integrated with Next.js. The route is located at `/api/graphql`.

### Features

- GraphQL query and mutation support
- JWT authentication
- MongoDB database connection
- CORS support

### How to Use

#### Sending Requests

To interact with the GraphQL API, send a POST request to `/api/graphql`. The request should include:

1. A `Content-Type: application/json` header
2. A JSON body with a `query` field containing your GraphQL query or mutation

Example using curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "query { hello }"}' \
  http://your-domain.com/api/graphql
```

#### Authentication

To authenticate requests, include a JWT token in the `Authorization` header:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "query { protectedResource }"}' \
  http://your-domain.com/api/graphql
```

#### CORS

The API supports CORS for cross-origin requests. The OPTIONS handler is set up to respond to preflight requests.

### Error Handling

- If you send a GET request, you'll receive a 405 Method Not Allowed response.
- Invalid JWT tokens will result in a null user in the GraphQL context.
- GraphQL errors will be returned in the response body according to the GraphQL specification.

### Development

To modify the GraphQL schema or resolvers, update the `typeDefs` and `resolvers` imported at the top of the file. Remember to restart your Next.js server after making changes.

## Login API Route

This project implements a login API route for user authentication. The route is located at `/api/login`.

### Features

- Email and password authentication
- JWT token generation
- MongoDB database integration
- Error handling for various scenarios

### How to Use

To authenticate a user, send a POST request to `/api/login`. The request should include:

1. A `Content-Type: application/json` header
2. A JSON body with `email` and `password` fields

#### Request Format

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

#### Response Format

On successful authentication:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "uuid": "user-uuid-here"
}
```

On failure:

```json
{
  "error": "Error message here"
}
```

#### Example using curl

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "userpassword"}' \
  http://your-domain.com/api/login
```

### Error Handling

The API returns different status codes based on the error:

- 400 Bad Request: Missing email or password, or invalid credentials
- 500 Internal Server Error: Database errors or other internal issues

### Security Notes

- Passwords are compared using bcrypt to prevent timing attacks
- JWT tokens are signed with a secret key and expire after 1 hour
- Always use HTTPS in production to protect user credentials

### Development

To modify the login logic or database integration, update the `POST` function in the `/api/login.ts` file. Remember to restart your Next.js server after making changes.

Ensure that the `JWT_SECRET` environment variable is set in your `.env` file:

```
JWT_SECRET=your-secret-key-here
```

## Register API Route

This project implements a register API route for user account creation. The route is located at `/api/auth/register`.

### Features

- User registration with email and password
- Password hashing using bcrypt
- Unique UUID generation for each user
- MongoDB database integration
- Error handling for various scenarios

### How to Use

To register a new user, send a POST request to `/api/auth/register`. The request should include:

1. A `Content-Type: application/json` header
2. A JSON body with `email` and `password` fields

#### Request Format

```json
{
  "email": "newuser@example.com",
  "password": "securepassword"
}
```

#### Response Format

On successful registration:

```json
{
  "message": "User registered successfully."
}
```

On failure:

```json
{
  "error": "Error message here"
}
```

#### Example using curl

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "password": "securepassword"}' \
  http://your-domain.com/api/auth/register
```

### Error Handling

The API returns different status codes based on the error:

- 400 Bad Request: Missing email or password, or user already exists
- 500 Internal Server Error: Database errors or other internal issues

### Security Notes

- Passwords are hashed using bcrypt before storage
- Each user is assigned a unique UUID
- Always use HTTPS in production to protect user data during transmission

### Development

To modify the registration logic or database integration, update the `POST` function in the `/api/auth/register.ts` file. Remember to restart your Next.js server after making changes.

Ensure that your MongoDB connection string is properly configured in your environment variables.


### AWS

The below endpoints are all located in the `/api/aws` section and handle the logic for uploading and fetching items from the S3 bucket.

## Upload API Route

This project implements an AWS S3 upload API route for file uploads. The route is located at `/api/aws/upload`. The logic within the route generates a unique `proofHash` for each upload which can be compared and verified against using the [Verify Upload](#verify-upload) hook.

### Features

- File upload to AWS S3
- Generation of signed URLs for secure file access
- Unique file UUID generation
- File content hashing for integrity verification
- Proof of upload generation with cryptographic hash

### How to Use

To upload a file, send a POST request to `/api/aws/upload`. The request should be a `multipart/form-data` request containing:

1. `file`: The file to be uploaded
2. `userId`: The ID of the user uploading the file

#### Request Format

```
POST /api/aws/upload
Content-Type: multipart/form-data

file: [binary data]
userId: user123
```

#### Response Format

On successful upload:

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "https://s3-presigned-url...",
  "key": "user123/file-uuid/filename.ext",
  "uuid": "file-uuid",
  "proofOfUpload": {
    "fileHash": "sha256-hash-of-file-content",
    "s3ETag": "s3-etag-value",
    "uploadTimestamp": "2023-04-20T12:00:00Z",
    "fileUuid": "file-uuid",
    "fileName": "filename.ext",
    "fileSize": 1234
  },
  "proofHash": "sha256-hash-of-proof-of-upload"
}
```

On failure:

```json
{
  "success": false,
  "message": "Error message here"
}
```

#### Example using curl

```bash
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/file.jpg" \
  -F "userId=user123" \
  http://your-domain.com/api/aws/upload
```

### Error Handling

The API returns different status codes based on the error:

- 400 Bad Request: Missing file or userId
- 500 Internal Server Error: S3 upload errors or other internal issues

### Security Notes

- Use environment variables for AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
- The S3 bucket name should be set in the S3_BUCKET_NAME environment variable
- Signed URLs expire after 1 hour (3600 seconds)
- File integrity can be verified using the returned fileHash

### Development

To modify the upload logic or S3 integration, update the `POST` function in the `/api/aws/upload.ts` file. Remember to restart your Next.js server after making changes.

Ensure that all required environment variables are set in your `.env` file:

```
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
```
## Fetch API Route

This project implements an AWS S3 fetch API route for retrieving files. The route is located at `/api/aws/fetch`.

### Features

- Fetch all items for a specific user
- Fetch a specific item by ID
- Generate signed URLs for secure file access
- Error handling for various scenarios

### How to Use

To fetch files, send a GET request to `/api/aws/fetch`. The request should include query parameters:

1. `userId`: To fetch all items for a specific user
   OR
2. `itemId`: To fetch a specific item by its ID

#### Request Format

To fetch items for a user:
```
GET /api/aws/fetch?userId=user123
```

To fetch a specific item:
```
GET /api/aws/fetch?itemId=users/user123/file.jpg
```

#### Response Format

For fetching user items:

```json
{
  "success": true,
  "message": "Items fetched successfully",
  "items": [
    {
      "key": "users/user123/file1.jpg",
      "lastModified": "2023-04-20T12:00:00Z",
      "size": 1234,
      "url": "https://s3-presigned-url..."
    },
    // ... more items
  ]
}
```

For fetching a specific item:

```json
{
  "success": true,
  "message": "Item fetched successfully",
  "item": {
    "key": "users/user123/file.jpg",
    "lastModified": "2023-04-20T12:00:00Z",
    "size": 1234,
    "url": "https://s3-presigned-url..."
  }
}
```

On failure:

```json
{
  "success": false,
  "message": "Error message here"
}
```

#### Example using curl

```bash
curl -X GET 'http://your-domain.com/api/aws/fetch?userId=user123'
```

### Error Handling

The API returns different status codes based on the error:

- 400 Bad Request: Missing userId or itemId
- 404 Not Found: Specific item not found
- 500 Internal Server Error: S3 fetch errors or other internal issues

### Security Notes

- Use environment variables for AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
- The S3 bucket name should be set in the S3_BUCKET_NAME environment variable
- Signed URLs expire after 1 hour (3600 seconds)

### Development

To modify the fetch logic or S3 integration, update the functions in the `/api/aws/fetch.ts` file. Remember to restart your Next.js server after making changes.

Ensure that all required environment variables are set in your `.env` file:

```
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
```

### Stripe

The below endpoints are all located in the `/api/stripe` section and handle the logic for initiating the Stripe payment flow and the the route to process the payment and initiate any post-payment logic.

### Stripe API Route

This project implements a Stripe checkout API route for processing payments. The route is located at `/api/stripe`.

### Features

- Creates a Stripe checkout session
- Handles idempotent requests
- Configurable product name and amount
- Customizable success and cancel URLs

### How to Use

To create a Stripe checkout session, send a POST request to `/api/stripe`. The request should include:

1. An `Idempotency-Key` header for ensuring idempotent requests
2. A JSON body with payment details

#### Request Format

Headers:
```
Content-Type: application/json
Idempotency-Key: <unique-idempotency-key>
```

Body:
```json
{
  "uuid": "unique-invoice-id",
  "amount": 1000,
  "user": "user-id"
}
```

#### Response Format

On success:

```json
{
  "sessionId": "cs_test_..."
}
```

On failure:

```json
{
  "error": "Error message here"
}
```

### Example using curl

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-key-123" \
  -d '{"uuid": "inv-123", "amount": 1000, "user": "user123"}' \
  http://your-domain.com/api/stripe
```

### Error Handling

The API returns different status codes based on the error:

- 400 Bad Request: Missing Idempotency-Key header
- 500 Internal Server Error: Stripe API errors or other internal issues

### Security Notes

- Use environment variables for Stripe secret key (NEXT_PUBLIC_STRIPE_SECRET_KEY)
- The host URL should be set in the NEXT_PUBLIC_HOST environment variable
- Always use HTTPS in production to protect sensitive data

### Development

To modify the Stripe integration or checkout process, update the POST function in the `/api/stripe/route.ts` file. Remember to restart your Next.js server after making changes.

Ensure that all required environment variables are set in your `.env` file:

```
NEXT_PUBLIC_STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_HOST=https://your-domain.com
```

### Important Notes

- The product name is set as 'INV-' followed by the provided UUID
- The amount should be provided in the smallest currency unit (e.g., cents for USD)
- The success URL includes query parameters for amount, user, invoice ID, and Stripe session ID

### Process API Route

This API route handles the processing of Stripe payments and creates IP certificates on the Solana blockchain.

### Features

- Verifies Stripe payment sessions
- Interacts with MongoDB to retrieve user and IP asset data
- Creates and uploads metadata to Irys (formerly Arweave)
- Generates and sends Solana transactions for IP certificate creation

### Usage

Send a POST request to `/api/stripe/process` with the following JSON body:

```json
{
  "amount": "100.00",
  "user": "user-uuid",
  "id": "ip-asset-uuid",
  "session_id": "stripe-session-id"
}
```

#### Response

On success, the API returns a JSON object containing the serialized Solana transaction:

```json
{
  "txn": "base64-encoded-transaction"
}
```

On failure, it returns an error message with an appropriate HTTP status code.

### Security Considerations

- Always use HTTPS in production
- Validate and sanitize all input data
- Use environment variables for sensitive information (API keys, private keys)
- Implement rate limiting to prevent abuse

### Development Setup

1. Set up environment variables:
   - `NEXT_PUBLIC_STRIPE_SECRET_KEY`: Your Stripe secret key
   - `NEXT_PUBLIC_UMI_KEY`: Your UMI key (JSON format)
   - `PRIVATE_KEY`: Your Solana private key
   - `SIGNING_AUTHORITY`: Your signing authority private key

2. Ensure MongoDB is set up and connected

3. Install dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

### Error Handling

The API uses try-catch blocks to handle errors. Common errors include:
- Missing parameters
- Payment verification failures
- Database connection issues
- Blockchain transaction failures

All errors are logged and return appropriate HTTP status codes.

### Solana Transaction Flow

1. Create IP
2. Create IP Certificate
3. Buy IP Certificate

Each step involves creating and sending Solana transactions.

### Important Notes

- This route is designed for the Solana devnet. Adjust the connection URL for mainnet deployment.
- Ensure all required collections (`users`, `ipAsset`) exist in your MongoDB database.
- The route uses Stripe's latest API version. Update as needed.

## Protocol

The below endpoints are all located in the `/api/protocol` section and handle the Web3 Solana Program logic.

## Create Profile API Route

This API route handles the creation of user profiles on the Solana blockchain for the Artisan protocol.

### Features

- Creates a user profile on the Solana blockchain
- Handles different profile types (Creator or Artisan)
- Uses a fee payer account for transaction costs
- Confirms transaction completion

### Usage

Send a POST request to `/api/protocol/create/profile` with the following JSON body:

```json
{
  "publicKey": "user_solana_public_key",
  "username": "desired_username",
  "profileType": "Creator",
  "isPublic": true
}
```

#### Parameters

- `publicKey`: The Solana public key of the user (string)
- `username`: The desired username for the profile (string)
- `profileType`: Either "Creator" or "Artisan" (string)
- `isPublic`: Whether the profile should be public (boolean)

#### Response

On success, the API returns a JSON object containing the transaction signature:

```json
{
  "signature": "transaction_signature"
}
```

On failure, it returns an error message with a 500 status code.

### Security Considerations

- The route uses a fee payer account. Ensure the private key for this account is securely stored in environment variables.
- Always use HTTPS in production to protect sensitive data.
- Implement additional authentication and authorization as needed.

### Development Setup

1. Set up environment variables:
   - `HELIUS_DEVNET`: (Optional) Helius devnet RPC URL
   - `PRIVATE_KEY`: Private key for the fee payer account

2. Ensure the Solana web3.js and Anchor libraries are installed.

3. The `getArtisanProgram` function should be properly implemented to return the Artisan program.

### Error Handling

The API uses try-catch blocks to handle errors. Common errors include:
- Invalid input data
- Solana RPC connection issues
- Insufficient balance for transaction fees
- Program execution errors

All errors are logged and return a 500 status code with error details.

### Solana Transaction Flow

1. Generate a new transaction using `VersionedTransaction`
2. Sign the transaction with the fee payer
3. Send and confirm the transaction

### Important Notes

- This route is designed for the Solana devnet. Adjust the connection URL for mainnet deployment.
- The profile creation is handled by the Artisan program on Solana. Ensure the program is properly deployed and configured.
- Transaction priority fees are commented out but can be uncommented if needed during high network congestion.


## Hooks

## Verify Upload

The `useVerifyUpload` hook is a custom React hook designed to verify the integrity of uploaded files. It compares a stored proof hash against a recalculated hash based on the file's content and metadata.

### How It Works

1. **Hook Initialization**
   - The hook initializes three state variables:
     - `isVerifying`: Indicates if verification is in progress
     - `isValid`: Stores the result of the verification
     - `error`: Stores any error messages

2. **Verification Process**
   The `verifyUploadProof` function is the core of this hook. It takes three parameters:
   - `storedProofHash`: The original proof hash generated during upload
   - `proofData`: An object containing file metadata
   - `fileUrl`: URL to fetch the uploaded file

   The verification process follows these steps:

   a. **Fetch the File**
      - The file is fetched from the provided URL using the Fetch API.

   b. **Calculate File Hash**
      - A SHA-256 hash of the file content is calculated.
      - This hash is compared with the `fileHash` in the `proofData`.
      - If they don't match, it throws an error, indicating the file has been tampered with.

   c. **Recreate Proof of Upload**
      - A new `ProofOfUpload` object is created using the calculated file hash and the provided metadata.

   d. **Generate Proof Hash**
      - The recreated proof object is stringified and hashed using SHA-256.

   e. **Compare Hashes**
      - The calculated proof hash is compared with the `storedProofHash`.
      - If they match, the file is considered valid and unaltered.

3. **Error Handling**
   - Any errors during the process are caught and stored in the `error` state.

4. **State Updates**
   - `isVerifying` is set to `true` at the start and `false` at the end of the process.
   - `isValid` is updated with the result of the verification.

### Usage

To use this hook in a component:

```typescript
const { verifyUploadProof, isVerifying, isValid, error } = useVerifyUpload();

// Later in your component...
const handleVerify = async () => {
  const result = await verifyUploadProof(storedHash, proofData, fileUrl);
  if (result) {
    console.log('File is valid and unaltered');
  } else {
    console.log('File verification failed');
  }
};
```

### Security Considerations

- This method assumes that the `storedProofHash` is securely stored and hasn't been tampered with.
- The integrity of the verification process depends on the security of the client-side environment.
- For highly sensitive applications, server-side verification should be considered in addition to client-side checks.

## Add to Waitlist

The `useAddToWaitlist` hook is a custom React hook designed to add users to a waitlist using a Google Apps Script endpoint. It manages the submission process, including loading states and error handling.

### How It Works

1. **Hook Initialization**
   - The hook initializes three state variables:
     - `isLoading`: Indicates if a submission is in progress
     - `error`: Stores any error messages
     - `addToWaitlist`: The main function to add a user to the waitlist

2. **Submission Process**
   The `addToWaitlist` function is the core of this hook. It takes a single parameter:
   - `entry`: An object containing the user's information (name, email, userType, etc.)

   The submission process follows these steps:

   a. **Prepare URL**
      - The base URL is fetched from the environment variable `NEXT_PUBLIC_WAITLIST_API_URL`.
      - Query parameters are added to the URL based on the `entry` object.

   b. **Send Request**
      - A GET request is sent to the constructed URL using the Fetch API.

   c. **Process Response**
      - The response is checked for success (status code 200-299).
      - If successful, the response is parsed as JSON.

   d. **Return Data**
      - The parsed data is returned to the caller.

3. **Error Handling**
   - Any errors during the process are caught and stored in the `error` state.
   - Network errors, non-OK responses, and JSON parsing errors are all captured.

4. **State Updates**
   - `isLoading` is set to `true` at the start and `false` at the end of the process.
   - `error` is updated if any error occurs during the submission.

### Usage

To use this hook in a component:

```typescript
const { addToWaitlist, isLoading, error } = useAddToWaitlist();

// Later in your component...
const handleSubmit = async (event) => {
  event.preventDefault();
  const result = await addToWaitlist({
    name: 'John Doe',
    email: 'john@example.com',
    userType: 'Creator',
    interest: 'Blockchain',
    vipAccess: true,
    referOthers: false,
    updatePreference: 'Weekly',
    blockchainFamiliarity: 'Intermediate'
  });
  if (result) {
    console.log('Successfully added to waitlist');
  }
};
```

### Security Considerations

- Ensure that the `NEXT_PUBLIC_WAITLIST_API_URL` is properly set and secured.
- Be cautious about exposing sensitive information in URL parameters.
- For highly sensitive applications, consider using POST requests instead of GET, and implement proper CORS and authentication mechanisms.

### Environment Setup

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_WAITLIST_API_URL=https://script.google.com/macros/s/your-script-id/exec
```

Replace `your-script-id` with the actual ID of your Google Apps Script.

### TypeScript Support

The hook uses TypeScript for type safety. The `WaitlistEntry` interface defines the structure of the entry object:

```typescript
interface WaitlistEntry {
  name: string;
  email: string;
  userType: 'Creator' | 'Investor' | 'Both';
  interest: string;
  vipAccess: boolean;
  referOthers: boolean;
  updatePreference: string;
  blockchainFamiliarity: string;
}
```

Ensure you provide an object matching this interface when calling `addToWaitlist`.

### Google App Script

This Google Apps Script is designed to manage a waitlist by adding user information to a Google Sheets spreadsheet. It handles both GET and POST requests, making it versatile for different integration scenarios.

#### Script

```javascript
/**
 * Handles both GET and POST requests to add a user to the waitlist.
 * @param {Object} e - The event object containing request parameters.
 * @return {Object} JSON response indicating success or failure.
 */
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

/**
 * Processes the request and adds the user to the waitlist.
 * @param {Object} e - The event object containing request parameters.
 * @return {Object} JSON response indicating success or failure.
 */
function handleRequest(e) {
  try {
    const requiredParams = ['name', 'email', 'userType', 'interest', 'vipAccess', 'referOthers', 'updatePreference', 'blockchainFamiliarity'];
    const params = extractParams(e.parameter, requiredParams);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Waitlist');
    if (!sheet) {
      throw new Error('Waitlist sheet not found');
    }

    sheet.appendRow(Object.values(params));

    return createJsonResponse({ status: 200, message: 'Success' });
  } catch (error) {
    console.error('Error processing request:', error);
    return createJsonResponse({ status: 400, message: error.message }, 400);
  }
}

/**
 * Extracts and validates required parameters from the request.
 * @param {Object} params - The parameters object from the request.
 * @param {Array} requiredParams - Array of required parameter names.
 * @return {Object} Object containing all required parameters.
 * @throws {Error} If any required parameter is missing.
 */
function extractParams(params, requiredParams) {
  const extractedParams = {};
  for (const param of requiredParams) {
    if (!params[param]) {
      throw new Error(`Missing required parameter: ${param}`);
    }
    extractedParams[param] = params[param];
  }
  return extractedParams;
}

/**
 * Creates a JSON response.
 * @param {Object} data - The data to be sent in the response.
 * @param {number} [responseCode=200] - The HTTP response code.
 * @return {Object} ContentService TextOutput object with JSON mime type.
 */
function createJsonResponse(data, responseCode = 200) {
  const response = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  if (responseCode !== 200) {
    response.setStatusCode(responseCode);
  }
  
  return response;
}
```

#### Features

- Handles both GET and POST requests
- Validates required parameters
- Adds user information to a specified Google Sheets spreadsheet
- Provides error handling and appropriate responses

#### Setup

1. Open your Google Sheets document where you want to store the waitlist.
2. Go to Extensions > Apps Script.
3. Replace the existing code with the provided script.
4. Save the project and give it a name (e.g., "Waitlist Manager").

#### Spreadsheet Structure

Ensure your Google Sheets document has a sheet named "Waitlist" with the following columns:

1. Name
2. Email
3. User Type
4. Interest
5. VIP Access
6. Refer Others
7. Update Preference
8. Blockchain Familiarity

#### Deploying as a Web App

1. In the Apps Script editor, click on "Deploy" > "New deployment".
2. Choose "Web app" as the type of deployment.
3. Set the following options:
   - Execute as: Your account
   - Who has access: Anyone
4. Click "Deploy" and authorize the application.
5. Copy the provided Web app URL. This is the endpoint you'll use to submit data to the waitlist.

#### Submitting Data

To add a user to the waitlist, send a GET or POST request to the Web app URL with the following parameters:

- `name`: User's name
- `email`: User's email address
- `userType`: Type of user (e.g., "Creator", "Investor", "Both")
- `interest`: User's area of interest
- `vipAccess`: Whether the user has VIP access (boolean)
- `referOthers`: Whether the user wants to refer others (boolean)
- `updatePreference`: User's preference for updates
- `blockchainFamiliarity`: User's familiarity with blockchain

Example URL (for GET request):
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?name=John%20Doe&email=john@example.com&userType=Investor&interest=DeFi&vipAccess=true&referOthers=false&updatePreference=Weekly&blockchainFamiliarity=Intermediate
```

#### Response

The script returns a JSON response with the following structure:

```json
{
  "status": 200,
  "message": "Success"
}
```

In case of an error, it will return:

```json
{
  "status": 400,
  "message": "Error message describing the issue"
}
```

#### Security Considerations

- Ensure that sensitive data is not exposed in URL parameters when using GET requests.
- Implement additional authentication mechanisms if the waitlist contains sensitive information.
- Regularly review and update the script's permissions and access settings.

#### Troubleshooting

- If you encounter errors, check the Apps Script execution log for detailed error messages.
- Ensure all required parameters are provided in the request.
- Verify that the "Waitlist" sheet exists in your Google Sheets document.


## Use User Mgmt

The `useAuth` hook from `@/hooks/use-user-mgmt` is a comprehensive custom React hook that manages user authentication, dashboard data fetching, and user registration status checking using Apollo Client for GraphQL operations.
Features

Manages user authentication state
Performs automatic authentication check on mount
Provides login and logout functionality
Fetches user dashboard data when authenticated
Checks if a user is registered based on their email
Integrates with Apollo Client for GraphQL operations
Supports token-based authentication

## Features

- Manages user authentication state
- Performs automatic authentication check on mount
- Provides login and logout functionality
- Fetches user dashboard data when authenticated
- Integrates with Apollo Client for GraphQL operations
- Supports token-based authentication

The `useAuth` hook returns an object with the following properties and methods:

- `user` (User | null): The current user object if authenticated, null otherwise.
- `loading` (boolean): Indicates whether authentication check or dashboard data fetching is in progress.
- `error` (string | null): Contains error message if any operation fails.
- `login(token: string, userData: User)`: Function to log in a user.
- `logout()`: Function to log out the current user.
- `checkAuth()`: Function to manually check the authentication status.
- `dashboardData` (DashboardData | undefined): Contains the user's dashboard data when fetched.
- `checkUserRegistration` (email: string): Promise<boolean | null>: Function to check if a user is registered based on their email.

### Authentication Flow

1. On mount, the hook automatically checks for a stored token and verifies it with the server.
2. If a valid token is found, the user data is fetched and stored in the `user` state.
3. If authenticated, the hook automatically fetches the user's dashboard data.
4. The `login` function can be called to authenticate a user, storing the token and user data.
5. The `logout` function clears the stored token and user data.

### Dashboard Data

The hook automatically fetches dashboard data when a user is authenticated. Access this data through the `dashboardData` property.

### Error Handling

- If the authentication check or dashboard data fetch fails, an error message is stored in the `error` state.
- The hook uses Apollo Client's `'all'` error policy for dashboard queries, allowing partial data to be returned along with errors.

### Performance Considerations

- The dashboard query uses `fetchPolicy: 'network-only'`, ensuring fresh data but potentially impacting performance for frequently accessed dashboards. Consider adjusting this if caching is preferred.
- The dashboard query is skipped if no user is authenticated, preventing unnecessary network requests.

## Use S3

The `useS3` hook is a custom React hook designed to manage S3 operations in a React application. It provides a clean interface for fetching user items, getting specific items by ID, and uploading files to S3.

## Features

- Fetch all S3 items for a user
- Fetch a specific S3 item by ID
- Upload a file to S3
- Manages loading state and error handling for all operations

##
The `useS3` hook returns an object with the following properties and methods:

- `getUserItems(userId: string): Promise<S3Item[] | null>`
  Fetches all S3 items for a given user ID.

- `getItemById(userId: string, fileUuid: string): Promise<S3Item | null>`
  Fetches a specific S3 item by user ID and file UUID.

- `uploadFileToS3(file: File, userId: string): Promise<S3Item | null>`
  Uploads a file to S3 for a given user ID.

- `loading: boolean`
  Indicates whether any S3 operation is currently in progress.

- `error: string | null`
  Contains an error message if the last operation failed, or null if successful.

## Error Handling

The hook provides built-in error handling:

- All errors are logged to the console for debugging purposes.
- User-friendly error messages are stored in the `error` state.
- In case of an error, the operations return `null`.

## Performance Considerations

- The hook uses `useCallback` to memoize functions, preventing unnecessary re-renders.
- Each operation sets the loading state, allowing for UI updates during long-running operations.

## Types

```typescript
interface S3Item {
  // Define your S3Item properties here
}
```





## User Flow

### User Login
The user flow begins with sign in that takes place within the `@/components/navbar/navbar-ui.tsx` component.

![Sign In](/public/readme/sign-in.png)

When a user connects to the site using Web3Auth Social Logins, the off-chain database signs the user in with a combination of their email and publicKey.

![Sign In 2](/public/readme/sign-in-2.png)

If user is connected and has a profile created, they are shown a dropdown menu in place of the sign in button.

![Sign In 3](/public/readme/sign-in-3.png)
![Sign In 4](/public/readme/sign-in-4.png)

The `<RegisterForm />` component within the `<Navbar>` handles the logic for:
   - Connecting to Web3Auth
   - Verifying if the connected user has a Profile in our system

If the User connects, but does not have a profile in our system then they are instantly prompted to create one. The user can choose not to, but will eventually need to in order to use any site functionality.

![Sign In 5](/public/readme/sign-in-5.png)

### User Dashboard

The `<Dashboard />` component is located `@/components/dashboard` and takes in optional props (more on this later). 

![Dashboard 1](/public/readme/dashboard.png)

The main logic here is to display items `Registered` by the User and `Created` (i.e. registered then sold).

The logic for the dashboard pulls from User's off-chain and on-chain profile.

For the off-chain logic, the MongoDB is queried using the `useAuth()` hook, this pulls the `publicKey`, and additional info. The `publicKey` is then used to query that User's certificates on-chain.

The on-chain logic takes place using the `useProgramAccount()` hook from the `@/components/solana/protocol/protocol-data-access.tsx` file.

![Dashboard 2](/public/readme/dashboard2.png)

### Create Page

On the `/create` page a User can perform 2 actions:
   - Create a Creator Profile
   - Register IP

![Create 1](/public/readme/create.png)

The `<CreatorProfileForm />` collects the data for the Creator's Profile that is stored on their `user` object in the MongoDB.

![Create 2](/public/readme/create-2.png)

The `<UploadDialog />` component located at `@/components/upload/upload-dialog.tsx` handles the logic for uploading and registering an IP.

![Create 3](/public/readme/create-3.png)
![Create 4](/public/readme/create-3.png)

## Contributing

Instructions for how to contribute to your project. Include guidelines for submitting pull requests, reporting issues, and any coding standards you want contributors to follow.

## License

This project is licensed under the [#] - see the [LICENSE.md](LICENSE.md) file for details.