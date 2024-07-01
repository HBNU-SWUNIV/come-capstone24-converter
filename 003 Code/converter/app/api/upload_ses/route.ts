import { NextResponse } from "next/server";
import path from "path";
import dotenv from "dotenv";
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

dotenv.config({ path: path.join('/Users/berey/2024Capstone/come-capstone24-converter/003 Code/converter', '.env') });

// dotenv.config({ path: path.join('/Users/iyeongho/lvnvn/come-capstone24-converter/003 Code/converter/.env', '.env') });

// dotenv.config({ path: '../../../.env' });
//cotenv.config();

// AWS SES 설정
const sesClient = new SESClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
});

const adminMail = "vheh502@gmail.com";

async function sendEmail(userEmail) {
  const params = {
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Body: {
        Text: { Data: "This is a test email sent from AWS SES - 현재 테스트 중" },
      },
      Subject: { Data: "Test Email" },
    },
    Source: adminMail,
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.log("Error sending email:", error);
  }
}

export const POST = async (req, res) => {
  const formData = await req.formData();
  const userEmail = formData.get('email');
  console.log('Received email:', userEmail);

  try {
    await sendEmail(userEmail);
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occurred:", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
