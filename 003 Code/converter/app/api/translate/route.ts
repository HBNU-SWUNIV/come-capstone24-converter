    import { NextResponse } from 'next/server';
    import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
    import path from "path";
    import dotenv from "dotenv";
    dotenv.config({ path: path.join('/Users/iyeongho/lvnvn/come-capstone24-converter/003 Code/converter/.env', '.env') });
    const translate = new TranslateClient({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        }
    });

    export async function POST(req) {
        try {
            const { text } = await req.json();
            console.log('Text to translate:', text);  // 디버깅을 위한 로그 추가
            const command = new TranslateTextCommand({
                Text: text,
                SourceLanguageCode: 'auto',
                TargetLanguageCode: 'ko',  // 한국어로 번역
            });
            const result = await translate.send(command);
            console.log('Translation result:', result);  // 디버깅을 위한 로그 추가
            return NextResponse.json({ translatedText: result.TranslatedText });
        } catch (error) {
            console.error('Error translating text:', error);
            return new Response(JSON.stringify({ error: 'Error translating text' }), { status: 500 });
        }
    }