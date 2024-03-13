// app/api/documents/[key]/route.ts
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const Bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
<<<<<<< HEAD
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_WS_SECRET_ACCESS_KEY as string,
=======
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_WS as string,
>>>>>>> @{-1}
  },
});
export async function GET(_: Request, { params }: { params: { key : string } }) {
  const command = new GetObjectCommand({ Bucket, Key: params.key });
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return NextResponse.json({ src });
}