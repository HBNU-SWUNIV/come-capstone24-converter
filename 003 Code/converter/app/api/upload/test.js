"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path = require("path");
// .env 파일 경로 지정
dotenv.config({ path: path.join('/home/lvnvn/test_site', '.env') });
// dotenv를 사용하여 .env 파일의 환경 변수 로드
// 환경 변수 읽어오기
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
var region = process.env.REGION;
var bucketName = process.env.AWS_BUCKET_NAME;
// 읽어온 환경 변수 출력
console.log('ACCESS_KEY_ID:', accessKeyId);
console.log('AWS_SECRET_ACCESS_KEY:', secretAccessKey);
console.log('AWS_REGION:', region);
console.log('AWS_BUCKET_NAME:', bucketName);
