// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // 환경 변수 로드

const app = express();
const port = 3000;

// 보안을 위한 CORS 설정
app.use(cors());
app.use(express.json()); // JSON 요청 본문 파싱

// API 키를 환경 변수에서 불러오기
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/api/convert', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // 내장된 fetch 함수를 사용합니다.
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'x-ai/grok-4-fast:free',
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('API call failed:', error);
        res.status(500).json({ error: 'Failed to communicate with OpenRouter API.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});