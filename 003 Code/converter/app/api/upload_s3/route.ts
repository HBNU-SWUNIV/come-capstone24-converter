import { NextResponse } from "next/server";
import path from "path";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config({ path: path.join('/Users/berey/capstone/come-capstone24-converter/003 Code/onverter', '.env') });

// AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});


export const POST = async (req, res) => {
  const formData = await req.formData();
  console.log('test_s3!!!');
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  console.log(filename);
  
  try {
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/11-04-2024/${filename}`,
      Body: buffer
    };
    await s3.upload(s3Params).promise();
    const fileurl = `https://${process.env.S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${s3Params.Key}`;
   
    // console.log("test + 1: " +  fileurl);
    return NextResponse.json({fileurl, Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};