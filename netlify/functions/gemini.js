// 이 파일은 API 키를 안전하게 숨기고 Gemini API 요청을 중계하는 역할을 합니다.
// This file acts as a secure proxy for Gemini API requests, hiding the API key.

// ▼▼▼ 이 부분이 수정되었습니다! ▼▼▼
// 'node-fetch' import 라인을 삭제했습니다.
// Netlify의 최신 Node.js 18+ 환경에는 'fetch'가 기본 내장되어 있어 더 이상 필요하지 않습니다.
// ▲▲▲ This part has been modified! ▲▲▲

exports.handler = async function(event, context) {
    // POST 요청만 허용합니다.
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        // 환경 변수에서 API 키를 안전하게 불러옵니다.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // 이 에러는 Netlify 로그에만 보이고, 사용자에게는 보이지 않습니다.
            throw new Error('API key is not configured on the server.');
        }
        
        if (!prompt) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required.' }) };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        // 이제 이 fetch는 Node.js에 내장된 기본 fetch를 사용합니다.
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error('Gemini API Error:', errorBody);
            return { statusCode: apiResponse.status, body: JSON.stringify({ error: 'Failed to fetch from Gemini API.' }) };
        }

        const data = await apiResponse.json();

        // 클라이언트에 Gemini API의 응답을 그대로 전달합니다.
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Serverless function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal server error occurred.' })
        };
    }
};

