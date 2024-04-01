const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
//const router = require('./Router');
const PORT = process.env.PORT || 3000;
const test = require('./Router/test.js');
const multer = require('multer');
const uploadDir = './uploads';
const fs = require('fs');

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use('/api', test);

//const port = 3000; //node 서버가 사용할 포트 번호, 리액트의 포트번호(3000)와 충돌하지 않게 다른 번호로 할당
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    
    // 파일을 로컬 디렉토리에 저장한 후 응답
    res.json({ message: 'File uploaded successfully!' });
});

app.listen(PORT, () => {
    console.log(`The API Server is listening on port: ${PORT}`);
});