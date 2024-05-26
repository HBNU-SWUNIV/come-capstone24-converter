import { NextResponse } from "next/server";
import path from "path";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config({ path: path.join('/home/lvnvn/test_site', '.env') });

// AWS S3 설정
const ses = new AWS.SES({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});

const transporter = nodemailer.createTransport({
  SES: ses,
});

const adminMail = "vheh502@gmail.com"

export const POST = async (req, res) => {
  const formData = await req.formData();
  const userEmail = formData.get('email');
  const link = "https://example.com"; // 링크 할당
  
  const send_mail = async () => {
    const response = await transporter.sendMail({
      from: adminMail,
      to: userEmail,
      subject: "Test Mail",
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
      <html>
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body>
      <div style="padding:20px;">
      <div style="max-width: 500px;">
      <h2>Test Mail</h2>
      <p>
      Hi there,<br/><br/>
      This is a test mail.
      <a href="${link}">Click here</a>
      </p>
      </div>
      </div>
      </body>
      </html>
      `,
    });
    return response?.messageId
      ? { ok: true }
      : { ok: false, msg: "Failed to send email" };
  }

  console.log(FormData);
  try {
    console.log(FormData);
    return NextResponse.json({Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
}
