import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  const Bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;
  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_WS as string,
    },
  });
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    const Body = (await files[0].arrayBuffer()) as Buffer;
    const response = await s3.send(new PutObjectCommand({ Bucket, Key: files[0].name, Body }));
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
  }
}