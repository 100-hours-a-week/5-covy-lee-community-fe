const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5050; // 원하는 포트 번호로 설정

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// 로
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'community.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
