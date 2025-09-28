// 이 파일은 API 키를 안전하게 숨기고 Gemini API 요청을 중계하는 역할을 합니다.
// This file acts as a secure proxy for Gemini API requests, hiding the API key.

// 'node-fetch' 라이브러리가 필요할 수 있습니다.
// You might need the 'node-fetch' library.
// npm install node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
    // POST 요청만 허용합니다.
    // Only allow POST requests.
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        // 환경 변수에서 API 키를 안전하게 불러옵니다.
        // Securely load the API key from environment variables.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('API key is not configured.');
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
        // Forward the response from the Gemini API to the client.
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
