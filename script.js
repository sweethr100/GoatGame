// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const gameArea = document.getElementById('game-area');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const getCommentaryBtn = document.getElementById('get-commentary-btn');
const getFactBtn = document.getElementById('get-fact-btn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const comboDisplay = document.getElementById('combo');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');
const finalHighScoreDisplay = document.getElementById('final-high-score');
const goat = document.getElementById('goat');
const goldenGoat = document.getElementById('golden-goat');
const geminiResponseText = document.getElementById('gemini-response-text');
const loadingSpinner = document.getElementById('loading-spinner');

// Game State
let score = 0;
let timeLeft = 30;
let timerId = null;
let highScore = localStorage.getItem('goatClickerHighScore') || 0;
let isGoldenGoatActive = false;
let combo = 0;
let isFeverMode = false;
let feverTimer = null;

// Audio
const synth = new Tone.Synth().toDestination();
const membrane = new Tone.MembraneSynth().toDestination();
const metal = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0.01
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
}).toDestination();

const playSound = (type) => {
    if (Tone.context.state !== 'running') Tone.context.resume();

    switch (type) {
        case 'click':
            synth.triggerAttackRelease(isFeverMode ? "E5" : "C4", "8n");
            break;
        case 'golden':
            metal.triggerAttackRelease("C5", "32n");
            break;
        case 'combo':
            synth.triggerAttackRelease("G4", "16n");
            break;
        case 'fever':
            membrane.triggerAttackRelease("C2", "8n");
            break;
        case 'item-clock':
            synth.triggerAttackRelease("A5", "8n");
            break;
        case 'item-bomb':
            membrane.triggerAttackRelease("G1", "8n");
            break;
    }
};

// Gemini API
async function callGemini(prompt) {
    loadingSpinner.classList.remove('hidden');
    geminiResponseText.textContent = '';
    const serverlessUrl = '/.netlify/functions/gemini';

    try {
        const response = await fetch(serverlessUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) throw new Error(`Serverless function error: ${response.status}`);

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            geminiResponseText.textContent = candidate.content.parts[0].text;
        } else {
            geminiResponseText.textContent = "죄송합니다, 답변을 생성할 수 없습니다.";
        }
    } catch (error) {
        console.error('API call failed:', error);
        geminiResponseText.textContent = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

const getScoreCommentary = () => callGemini(`당신은 열정적인 e스포츠 캐스터입니다. 사용자가 30초 동안 염소 클릭 게임을 했고, ${score}점(최대 콤보 ${combo})을 기록했습니다. 이 점수에 대해 1~2문장으로 아주 흥분된 어조로 한국어 해설을 해주세요.`);
const getGoatFact = () => callGemini("염소에 대한 아주 엉뚱하고 재미있는 사실 하나를 한국어로 알려주세요.");

// UI Updates
function updateDisplay() {
    scoreDisplay.textContent = Math.floor(score);
    timeDisplay.textContent = timeLeft;
    comboDisplay.textContent = combo;
    highScoreDisplay.textContent = highScore;
    finalHighScoreDisplay.textContent = highScore;

    // Combo styling
    if (combo > 5) {
        comboDisplay.style.transform = `scale(${1 + Math.min(combo * 0.05, 0.5)})`;
        comboDisplay.style.color = '#fbbf24';
    } else {
        comboDisplay.style.transform = 'scale(1)';
        comboDisplay.style.color = 'white';
    }
}

// Particles
function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = color;
        particle.style.width = `${Math.random() * 8 + 4}px`;
        particle.style.height = particle.style.width;

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        gameArea.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

function showFloatingText(x, y, text, color) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.className = 'floating-text';
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;
    floatingText.style.color = color;
    gameArea.appendChild(floatingText);
    setTimeout(() => floatingText.remove(), 800);
}

// Game Logic
function startGame() {
    score = 0;
    timeLeft = 30;
    combo = 0;
    isFeverMode = false;
    updateDisplay();

    geminiResponseText.textContent = '';
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    moveGoat();

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) endGame();
    }, 1000);

    // Random Item Spawner
    setInterval(() => {
        if (timeLeft > 0 && Math.random() < 0.3) spawnItem();
    }, 2000);
}

function endGame() {
    clearInterval(timerId);
    if (score > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem('goatClickerHighScore', highScore);
    }
    updateDisplay();
    gameScreen.classList.add('hidden');
    finalScoreDisplay.textContent = Math.floor(score);
    resultScreen.classList.remove('hidden');
    getScoreCommentary();
}

function activateFeverMode() {
    if (isFeverMode) return;
    isFeverMode = true;
    playSound('fever');
    document.body.classList.add('fever-mode');
    showFloatingText(window.innerWidth / 2, window.innerHeight / 2, "FEVER TIME!!", "#ff0000");

    setTimeout(() => {
        isFeverMode = false;
        document.body.classList.remove('fever-mode');
    }, 5000);
}

function handleClick(event, points, type) {
    event.stopPropagation(); // Prevent background click

    // Combo Logic
    combo++;
    if (combo % 10 === 0) activateFeverMode();

    // Score Calculation
    let multiplier = 1 + (combo * 0.1);
    if (isFeverMode) multiplier *= 2;

    const finalPoints = points * multiplier;
    score += finalPoints;

    // Visuals & Audio
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (type === 'golden') playSound('golden');
    else playSound('click');

    createParticles(x, y, type === 'golden' ? 'gold' : 'white');
    showFloatingText(x, y, `+${Math.floor(finalPoints)}`, type === 'golden' ? 'gold' : 'white');

    // Screen Shake on big hits
    if (combo > 5 || type === 'golden') {
        gameScreen.classList.add('shake');
        setTimeout(() => gameScreen.classList.remove('shake'), 500);
    }

    updateDisplay();
    moveGoat();
}

function handleBackgroundClick() {
    if (combo > 0) {
        combo = 0;
        showFloatingText(window.innerWidth / 2, window.innerHeight / 2, "COMBO BROKEN", "red");
        gameScreen.classList.add('shake');
        setTimeout(() => gameScreen.classList.remove('shake'), 200);
        updateDisplay();
    }
}

function spawnItem() {
    const itemType = Math.random() < 0.5 ? 'clock' : 'bomb';
    const item = document.createElement('div');
    item.classList.add('item');
    item.textContent = itemType === 'clock' ? '⏰' : '💣';

    const gameAreaRect = gameArea.getBoundingClientRect();
    const x = Math.random() * (gameAreaRect.width - 80);
    const y = Math.random() * (gameAreaRect.height - 80);

    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (itemType === 'clock') {
            timeLeft += 5;
            playSound('item-clock');
            showFloatingText(e.clientX, e.clientY, "+5 Sec", "cyan");
        } else {
            score = Math.max(0, score - 50);
            timeLeft = Math.max(0, timeLeft - 3);
            combo = 0;
            playSound('item-bomb');
            showFloatingText(e.clientX, e.clientY, "BOOM!", "red");
            gameScreen.classList.add('shake');
            setTimeout(() => gameScreen.classList.remove('shake'), 500);
        }
        item.remove();
        updateDisplay();
    });

    gameArea.appendChild(item);
    setTimeout(() => item.remove(), 3000);
}

function moveGoat() {
    goat.classList.remove('hidden');
    goldenGoat.classList.add('hidden');
    isGoldenGoatActive = false;

    if (Math.random() < 0.15) {
        isGoldenGoatActive = true;
        goat.classList.add('hidden');
        goldenGoat.classList.remove('hidden');
    }

    const targetGoat = isGoldenGoatActive ? goldenGoat : goat;
    const gameAreaRect = gameArea.getBoundingClientRect();
    const goatSize = targetGoat.getBoundingClientRect();

    const randomX = Math.random() * (gameAreaRect.width - 100);
    const randomY = Math.random() * (gameAreaRect.height - 100);

    targetGoat.style.left = `${randomX}px`;
    targetGoat.style.top = `${randomY}px`;

    // Random Rotation
    targetGoat.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

    // Random Skin for Normal Goat
    if (!isGoldenGoatActive) {
        targetGoat.style.filter = `hue-rotate(${Math.random() * 360}deg) drop-shadow(0 10px 15px rgba(0,0,0,0.3))`;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', updateDisplay);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
goat.addEventListener('click', (e) => handleClick(e, 10, 'normal'));
goldenGoat.addEventListener('click', (e) => handleClick(e, 50, 'golden'));
gameArea.addEventListener('click', handleBackgroundClick); // Reset combo on miss
getCommentaryBtn.addEventListener('click', getScoreCommentary);
getFactBtn.addEventListener('click', getGoatFact);
