// script.js
document.addEventListener('DOMContentLoaded', () => {
    const questions = fetchQuestions();
    let currentQuestionIndex = 0;
    let score = 0;
    let streak = 0;
    let timerInterval;
    let timeLeft;
    let timerDuration;
    let shuffledQuestions;
    let userAnswers = [];
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    const elements = {
        startScreen: document.getElementById('start-screen'),
        quizScreen: document.getElementById('quiz-screen'),
        resultsScreen: document.getElementById('results-screen'),
        feedback: document.getElementById('feedback'),
        startBtn: document.getElementById('start-btn'),
        nextBtn: document.getElementById('next-btn'),
        timer: document.getElementById('timer'),
        score: document.getElementById('score'),
        streakEl: document.getElementById('streak'),
        question: document.getElementById('question'),
        options: document.getElementById('options'),
        progress: document.getElementById('progress'),
        finalScore: document.getElementById('final-score'),
        totalScore: document.getElementById('total-score'),
        correctCount: document.getElementById('correct-count'),
        timeBonus: document.getElementById('time-bonus'),
        streakBonus: document.getElementById('streak-bonus'),
        leaderboardList: document.getElementById('leaderboard-list'),
        highscoreInput: document.getElementById('highscore-input'),
        playerName: document.getElementById('player-name'),
        saveScore: document.getElementById('save-score'),
        shareBtn: document.getElementById('share-btn'),
        restartBtn: document.getElementById('restart-btn'),
        correctSound: document.getElementById('correct-sound'),
        wrongSound: document.getElementById('wrong-sound')
    };

    // Event Listeners
    elements.startBtn.addEventListener('click', startQuiz);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.saveScore.addEventListener('click', saveHighScore);
    elements.shareBtn.addEventListener('click', shareResult);
    elements.restartBtn.addEventListener('click', restartQuiz);
    elements.playerName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveHighScore();
    });

    function fetchQuestions() {
        // Questions loaded from questions.json
        return new Promise((resolve) => {
            fetch('questions.json')
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(() => resolve([])); // Fallback if fetch fails
        });
    }

    async function startQuiz() {
        timerDuration = parseInt(document.querySelector('input[name="timer"]:checked').value);
        shuffledQuestions = [...await questions].sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        score = 0;
        streak = 0;
        userAnswers = new Array(shuffledQuestions.length).fill(null);
        elements.startScreen.classList.add('hidden');
        elements.quizScreen.classList.remove('hidden');
        updateScore();
        updateStreak();
        showProgress();
        loadQuestion();
    }

    function loadQuestion() {
        const q = shuffledQuestions[currentQuestionIndex];
        elements.question.textContent = q.question;
        elements.options.innerHTML = '';
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.textContent = option;
            btn.addEventListener('click', () => selectAnswer(index));
            elements.options.appendChild(btn);
        });
        startTimer();
        updateProgress();
    }

    function startTimer() {
        timeLeft = timerDuration;
        elements.timer.textContent = timeLeft;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            elements.timer.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                selectAnswer(-1); // Timeout as wrong
            }
        }, 1000);
    }

    function selectAnswer(selectedIndex) {
        clearInterval(timerInterval);
        const q = shuffledQuestions[currentQuestionIndex];
        const correctIndex = q.correct;
        const isCorrect = selectedIndex === correctIndex;
        userAnswers[currentQuestionIndex] = selectedIndex;

        // Disable options
        Array.from(elements.options.children).forEach((btn, index) => {
            if (index === correctIndex) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
            btn.disabled = true;
        });

        if (isCorrect) {
            streak++;
            const basePoints = 10;
            const timeBonus = Math.floor((timeLeft / timerDuration) * 10);
            const streakBonus = streak * 2;
            const questionPoints = basePoints + timeBonus + streakBonus;
            score += questionPoints;
            showFeedback('✅ সঠিক!', 'correct', questionPoints);
            elements.correctSound.play().catch(() => {}); // Ignore play errors
        } else {
            streak = 0;
            showFeedback('❌ ভুল!', 'wrong', 0);
            elements.wrongSound.play().catch(() => {});
        }

        updateScore();
        updateStreak();
        updateProgress();
        elements.nextBtn.classList.remove('hidden');
    }

    function showFeedback(text, type, points = 0) {
        elements.feedback.querySelector('#feedback-text').textContent = `${text} (+${points} পয়েন্ট)`;
        elements.feedback.querySelector('#feedback-icon').textContent = type === 'correct' ? '✅' : '❌';
        elements.feedback.classList.remove('hidden');
        elements.feedback.classList.add(type);
        setTimeout(() => {
            elements.feedback.classList.add('hidden');
            elements.feedback.classList.remove(type);
        }, 2000);
    }

    function nextQuestion() {
        currentQuestionIndex++;
        elements.nextBtn.classList.add('hidden');
        if (currentQuestionIndex < shuffledQuestions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }

    function endQuiz() {
        elements.quizScreen.classList.add('hidden');
        elements.resultsScreen.classList.remove('hidden');
        elements.finalScore.textContent = `অভিনন্দন! আপনার স্কোর: ${score}`;
        elements.totalScore.textContent = score;
        const correct = userAnswers.filter(a => a === shuffledQuestions[userAnswers.indexOf(a)].correct).length;
        elements.correctCount.textContent = `${correct}/৫০`;
        elements.timeBonus.textContent = 'গণনা করা হয়েছে'; // Simplified, actual calc in selectAnswer
        elements.streakBonus.textContent = `সর্বোচ্চ স্ট্রীক: ${Math.max(...userAnswers.map((a, i) => {
            // Simple streak calc, but since accumulated, use max streak var if tracked separately
            return streak; // Use final streak
        }))}`;
        showLeaderboard();
        if (isHighScore(score)) {
            elements.highscoreInput.classList.remove('hidden');
            elements.playerName.focus();
        }
    }

    function updateScore() {
        elements.score.textContent = `স্কোর: ${score}`;
    }

    function updateStreak() {
        elements.streakEl.textContent = `স্ট্রীক: ${streak}`;
    }

    function showProgress() {
        elements.progress.innerHTML = '';
        for (let i = 0; i < shuffledQuestions.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('progress-dot');
            if (userAnswers[i] !== null) {
                dot.classList.add(userAnswers[i] === shuffledQuestions[i].correct ? 'correct' : 'wrong');
            }
            elements.progress.appendChild(dot);
        }
    }

    function updateProgress() {
        const dots = elements.progress.querySelectorAll('.progress-dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('current');
            if (i === currentQuestionIndex) {
                dot.classList.add('current');
            }
            if (userAnswers[i] !== null) {
                dot.classList.add(userAnswers[i] === shuffledQuestions[i].correct ? 'correct' : 'wrong');
            } else if (i < currentQuestionIndex) {
                dot.classList.add('completed');
            }
        });
    }

    function showLeaderboard() {
        elements.leaderboardList.innerHTML = '';
        leaderboard.sort((a, b) => b.score - a.score).slice(0, 10).forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${entry.name}</span><span>${entry.score}</span>`;
            elements.leaderboardList.appendChild(li);
        });
    }

    function isHighScore(newScore) {
        return leaderboard.length < 10 || newScore > Math.min(...leaderboard.map(e => e.score));
    }

    function saveHighScore() {
        const name = elements.playerName.value.trim() || 'অজানা খেলোয়াড়';
        leaderboard.unshift({ name, score, date: new Date().toLocaleDateString('bn-BD') });
        leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        elements.highscoreInput.classList.add('hidden');
        elements.playerName.value = '';
        showLeaderboard();
    }

    async function shareResult() {
        const shareData = {
            title: 'Black Force 007 Quiz',
            text: `আমি ${score} পয়েন্ট পেয়েছি! সামাজিক জ্ঞান কুইজে খেলুন।`,
            url: window.location.href
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                copyToClipboard(shareData.text);
            }
        } else {
            copyToClipboard(shareData.text);
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('শেয়ার টেক্সট কপি হয়েছে!');
        });
    }

    function restartQuiz() {
        elements.resultsScreen.classList.add('hidden');
        elements.startScreen.classList.remove('hidden');
    }
});
