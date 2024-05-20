import { NextResponse } from "next/server";
import path from "path";
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config({ path: path.join('/home/lvnvn/test_site', '.env') });
// AWS S3 설정
const ses = new AWS.SES({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});

export const POST = async (req, res) => {
  const formData = await req.formData();
  console.log(formData);
  try {
    console.log(formData);
    return NextResponse.json({Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
