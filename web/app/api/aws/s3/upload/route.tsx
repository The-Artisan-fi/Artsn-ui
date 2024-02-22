import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_WS_SECRET_ACCESS_KEY as string,
  },
});

// endpoint to get the list of files in the bucket
export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  console.log('response', response?.Contents ?? [])
  return NextResponse.json(response?.Contents ?? []);
}

// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("file") as File[];

  const response = await Promise.all(
    files.map(async (file) => {
      // not sure why I have to override the types here
      const Body = (await file.arrayBuffer()) as Buffer;
      s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));
    })
  );
    console.log('upload response', response)
  return NextResponse.json(response);
}