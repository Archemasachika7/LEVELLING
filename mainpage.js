// Initialize Firebase
document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDH6yvK6WMn5VlmH5oH1LHIMKhKjPm1Efw",
        authDomain: "levelling-87152.firebaseapp.com",
        projectId: "levelling-87152",
        storageBucket: "levelling-87152.firebasestorage.app",
        messagingSenderId: "640073491806",
        appId: "1:640073491806:web:88f9b8c6e9d32ef4145bcf",
        measurementId: "G-H02RVJMFQW"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Initialize Firebase Auth and Firestore
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Check if user is logged in
    auth.onAuthStateChanged(user => {
        if (!user) {
            // Redirect to auth page if not logged in
            window.location.href = 'auth.html';
        } else {
            // Load user data
            loadUserData(user.uid);
        }
    });
    
    // Load user data from Firestore
    function loadUserData(userId) {
        db.collection('hunters').doc(userId).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    updateUserInterface(userData);
                } else {
                    console.log("No user data found!");
                }
            })
            .catch(error => {
                console.error("Error getting user data:", error);
            });
    }
    
    // Update UI with user data
    function updateUserInterface(userData) {
        // Update user level and stats
        document.getElementById('user-level').textContent = `Level ${userData.level || 1}`;
        
        // Calculate XP progress
        const currentXP = userData.xp || 0;
        const nextLevelXP = (userData.level || 1) * 500; // Example formula
        document.getElementById('user-xp').textContent = `${currentXP}/${nextLevelXP} XP`;
        
        // Update coins
        document.getElementById('user-coins').textContent = userData.coins || 0;
        
        // Update username and rank
        document.querySelector('.username').textContent = userData.displayName || "Shadow Hunter";
        document.querySelector('.rank').textContent = userData.hunterRank || "E-Rank";
    }
    
    // Setup profile and logout buttons
    const profileBtn = document.querySelector('.profile-avatar');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                auth.signOut()
                    .then(() => {
                        window.location.href = 'auth.html';
                    })
                    .catch((error) => {
                        console.error('Error signing out:', error);
                    });
            }
        });
    }
    
    // Create particles for background
    createParticles(document.getElementById('particles'), 50);
    
    function createParticles(container, count) {
        if (!container) return;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation duration
            const duration = Math.random() * 20 + 10;
            particle.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.random() * 10;
            particle.style.animationDelay = `${delay}s`;
            
            container.appendChild(particle);
        }
    }
    
    // Initialize Charts
    initializeCharts();
    
    function initializeCharts() {
        // Physical Activity Chart
        const physicalCtx = document.getElementById('physical-chart');
        if (physicalCtx) {
            new Chart(physicalCtx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Steps',
                        data: [8500, 7200, 9300, 5400, 8700, 10200, 6500],
                        backgroundColor: 'rgba(0, 255, 163, 0.5)',
                        borderColor: 'rgba(0, 255, 163, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#aaa'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#aaa'
                            }
                        }
                    }
                }
            });
        }
        
        // Exam Progress Chart
        const examCtx = document.getElementById('exam-progress-chart');
        if (examCtx) {
            const examChart = new Chart(examCtx, {
                type: 'line',
                data: {
                    labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4'],
                    datasets: [{
                        label: 'Score',
                        data: [310, 325, 340, 355],
                        backgroundColor: 'rgba(94, 43, 255, 0.2)',
                        borderColor: 'rgba(94, 43, 255, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#aaa'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#aaa'
                            }
                        }
                    }
                }
            });
            
            // Update chart when exam selection changes
            document.getElementById('exam-select').addEventListener('change', function() {
                const exam = this.value;
                let data;
                
                switch(exam) {
                    case 'gre':
                        data = [310, 325, 340, 355];
                        break;
                    case 'gmat':
                        data = [620, 640, 670, 690];
                        break;
                    case 'gate':
                        data = [45, 52, 58, 65];
                        break;
                    default:
                        data = [310, 325, 340, 355];
                }
                
                examChart.data.datasets[0].data = data;
                examChart.update();
            });
        }
    }
    
    // Initialize Pomodoro Timer
    initializePomodoro();
    
    function initializePomodoro() {
        const timerDisplay = document.querySelector('.timer-display');
        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');
        const resetBtn = document.getElementById('timer-reset');
        
        if (!timerDisplay || !startBtn || !pauseBtn || !resetBtn) return;
        
        let timer;
        let minutes = 25;
        let seconds = 0;
        let isRunning = false;
        
        function updateDisplay() {
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        function startTimer() {
            if (isRunning) return;
            
            isRunning = true;
            
            timer = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(timer);
                        isRunning = false;
                        // Play sound or notification
                        timerComplete();
                        return;
                    }
                    minutes--;
                    seconds = 59;
                } else {
                    seconds--;
                }
                
                updateDisplay();
            }, 1000);
        }
        
        function pauseTimer() {
            clearInterval(timer);
            isRunning = false;
        }
        
        function resetTimer() {
            clearInterval(timer);
            isRunning = false;
            minutes = 25;
            seconds = 0;
            updateDisplay();
        }
        
        function timerComplete() {
            // Play sound and show notification
            if (Notification.permission === 'granted') {
                const notification = new Notification('Pomodoro Timer', {
                    body: 'Time to take a break!',
                    icon: '/favicon.ico'
                });
            }
            
            // Play sound
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.play();
            
            // Reset for next session
            setTimeout(() => {
                resetTimer();
            }, 3000);
        }
        
        // Request notification permission
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
        
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
    }
    
    // Initialize Coding Heatmap
    initializeHeatmap();
    
    function initializeHeatmap() {
        const heatmapContainer = document.getElementById('coding-heatmap');
        if (!heatmapContainer) return;
        
        // Generate 49 cells (7x7 grid)
        for (let i = 0; i < 49; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            // Random intensity level (0-4)
            const level = Math.floor(Math.random() * 5);
            cell.classList.add(`level-${level}`);
            
            // Add tooltip with date and contribution count
            cell.setAttribute('title', `${getRandomDate()}: ${level} contributions`);
            
            heatmapContainer.appendChild(cell);
        }
    }
    
    function getRandomDate() {
        const now = new Date();
        const pastDays = Math.floor(Math.random() * 60);
        const date = new Date(now);
        date.setDate(date.getDate() - pastDays);
        return date.toLocaleDateString();
    }
    
    // Initialize Year Calendar
    initializeYearCalendar();
    
    function initializeYearCalendar() {
        const calendarContainer = document.getElementById('year-calendar');
        if (!calendarContainer) return;
        
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
        
        for (let i = 0; i < daysInYear; i++) {
            const day = new Date(startOfYear);
            day.setDate(startOfYear.getDate() + i);
            
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            
            if (day < now) {
                cell.classList.add('past');
            } else if (day.toDateString() === now.toDateString()) {
                cell.classList.add('today');
            } else {
                cell.classList.add('future');
            }
            
            // Add tooltip with date
            cell.setAttribute('title', day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
            
            calendarContainer.appendChild(cell);
        }
    }
    
    function isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }
    
    // Initialize Riddle
    initializeRiddle();
    
    async function initializeRiddle() {
        const riddleQuestion = document.getElementById('riddle-question');
        const riddleAnswer = document.getElementById('riddle-answer');
        const riddleAnswerBtn = document.getElementById('riddle-answer-btn');
        
        if (!riddleQuestion || !riddleAnswer || !riddleAnswerBtn) return;
        
        try {
            // Fetch riddle from API
            const response = await fetch('https://api.api-ninjas.com/v1/riddles', {
                headers: {
                    'X-Api-Key': 'YOUR_API_NINJAS_KEY' // Replace with your actual API key
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    riddleQuestion.textContent = data[0].question;
                    riddleAnswer.textContent = data[0].answer;
                }
            } else {
                // Fallback to default riddle if API fails
                console.error('Failed to fetch riddle');
            }
        } catch (error) {
            console.error('Error fetching riddle:', error);
            // Use fallback riddle
            riddleQuestion.textContent = "What has keys but no locks, space but no room, and you can enter but not go in?";
            riddleAnswer.textContent = "A keyboard";
        }
        
        // Toggle answer visibility
        riddleAnswerBtn.addEventListener('click', () => {
            riddleAnswer.classList.toggle('hidden');
            riddleAnswerBtn.textContent = riddleAnswer.classList.contains('hidden') ? 
                'Reveal Answer' : 'Hide Answer';
        });
    }
    
    // Initialize Anime Quote
    initializeAnimeQuote();
    
    async function initializeAnimeQuote() {
        const animeQuote = document.getElementById('anime-quote');
        const quoteAuthor = document.getElementById('quote-author');
        
        if (!animeQuote || !quoteAuthor) return;
        
        try {
            // Fetch quote from Animechan API
            const response = await fetch('https://animechan.xyz/api/random');
            
            if (response.ok) {
                const data = await response.json();
                animeQuote.textContent = `"${data.quote}"`;
                quoteAuthor.textContent = `- ${data.character} (${data.anime})`;
            } else {
                // Fallback quotes if API fails
                console.error('Failed to fetch anime quote');
                useRandomFallbackQuote();
            }
        } catch (error) {
            console.error('Error fetching anime quote:', error);
            useRandomFallbackQuote();
        }
        
        function useRandomFallbackQuote() {
            // Fallback quotes
            const fallbackQuotes = [
                { quote: "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.", character: "Naruto Uzumaki", anime: "Naruto" },
                { quote: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.", character: "Himura Kenshin", anime: "Rurouni Kenshin" },
                { quote: "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger as well as kinder.", character: "Gildarts Clive", anime: "Fairy Tail" },
                { quote: "The world isn't perfect. But it's there for us, doing the best it can... that's what makes it so damn beautiful.", character: "Roy Mustang", anime: "Fullmetal Alchemist" },
                { quote: "You can die anytime, but living takes true courage.", character: "Kenshin Himura", anime: "Rurouni Kenshin" }
            ];
            
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            animeQuote.textContent = `"${randomQuote.quote}"`;
            quoteAuthor.textContent = `- ${randomQuote.character} (${randomQuote.anime})`;
        }
    }
    
    // Initialize Coding Challenge
    initializeCodingChallenge();
    
    async function initializeCodingChallenge() {
        const challengeTitle = document.getElementById('challenge-title');
        const difficultySpan = document.querySelector('.difficulty');
        
        if (!challengeTitle || !difficultySpan) return;
        
        try {
            // Fetch problems from Codeforces API
            const response = await fetch('https://codeforces.com/api/problemset.problems?tags=implementation');
            
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'OK' && data.result.problems.length > 0) {
                    // Get a random problem
                    const randomIndex = Math.floor(Math.random() * Math.min(20, data.result.problems.length));
                    const problem = data.result.problems[randomIndex];
                    
                    challengeTitle.textContent = problem.name;
                    
                    // Map Codeforces difficulty to our system
                    let difficulty;
                    if (problem.rating < 1400) {
                        difficulty = 'easy';
                        difficultySpan.textContent = 'Easy';
                        difficultySpan.className = 'difficulty easy';
                    } else if (problem.rating < 1900) {
                        difficulty = 'medium';
                        difficultySpan.textContent = 'Medium';
                        difficultySpan.className = 'difficulty medium';
                    } else {
                        difficulty = 'hard';
                        difficultySpan.textContent = 'Hard';
                        difficultySpan.className = 'difficulty hard';
                    }
                }
            } else {
                console.error('Failed to fetch coding challenge');
                useFallbackChallenge();
            }
        } catch (error) {
            console.error('Error fetching coding challenge:', error);
            useFallbackChallenge();
        }
        
        function useFallbackChallenge() {
            // Fallback challenge
            challengeTitle.textContent = "Two Sum";
            difficultySpan.textContent = 'Easy';
            difficultySpan.className = 'difficulty easy';
        }
    }
    
    // Initialize Heart Rate Update
    initializeHeartRateUpdate();
    
    function initializeHeartRateUpdate() {
        const heartRateInput = document.getElementById('heart-rate');
        const updateHeartRateBtn = document.getElementById('update-heart-rate');
        const heartRateValue = document.querySelector('.heart-rate-value');
        
        if (!heartRateInput || !updateHeartRateBtn || !heartRateValue) return;
        
        updateHeartRateBtn.addEventListener('click', () => {
            const newRate = heartRateInput.value.trim();
            if (newRate && !isNaN(newRate) && newRate > 0 && newRate < 220) {
                heartRateValue.textContent = `${newRate} BPM`;
                heartRateInput.value = '';
                
                // Save to database if needed
                if (auth.currentUser) {
                    db.collection('hunters').doc(auth.currentUser.uid)
                        .collection('health').add({
                            heartRate: parseInt(newRate),
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            console.log("Heart rate saved successfully");
                        })
                        .catch((error) => {
                            console.error("Error saving heart rate: ", error);
                        });
                }
            } else {
                alert('Please enter a valid heart rate (1-220 BPM)');
            }
        });
    }
    
    // Initialize Notification Panel
    initializeNotifications();
    
    function initializeNotifications() {
        const notificationIcon = document.querySelector('.notification-icon');
        const notificationsPanel = document.querySelector('.notifications-panel');
        const closeNotifications = document.querySelector('.close-notifications');
        
        if (!notificationIcon || !notificationsPanel || !closeNotifications) return;
        
        notificationIcon.addEventListener('click', () => {
            notificationsPanel.classList.toggle('hidden');
        });
        
        closeNotifications.addEventListener('click', () => {
            notificationsPanel.classList.add('hidden');
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (event) => {
            if (!notificationsPanel.classList.contains('hidden') && 
                !notificationsPanel.contains(event.target) && 
                !notificationIcon.contains(event.target)) {
                notificationsPanel.classList.add('hidden');
            }
        });
        
        // Fetch notifications from database
        if (auth.currentUser) {
            db.collection('hunters').doc(auth.currentUser.uid)
                .collection('notifications')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get()
                .then((querySnapshot) => {
                    const notificationsList = document.querySelector('.notifications-list');
                    
                    // Clear existing notifications
                    notificationsList.innerHTML = '';
                    
                    if (querySnapshot.empty) {
                        // Add a default notification if none exist
                        const defaultNotification = document.createElement('div');
                        defaultNotification.className = 'notification-item';
                        defaultNotification.innerHTML = `
                            <div class="notification-icon"><i class="fas fa-bell"></i></div>
                            <div class="notification-content">
                                <p>Welcome to Levelling! Start tracking your progress now.</p>
                                <span class="notification-time">Just now</span>
                            </div>
                        `;
                        notificationsList.appendChild(defaultNotification);
                    } else {
                        // Add notifications from database
                        querySnapshot.forEach((doc) => {
                            const notification = doc.data();
                            const notificationItem = document.createElement('div');
                            notificationItem.className = 'notification-item';
                            if (!notification.read) {
                                notificationItem.classList.add('unread');
                            }
                            
                            notificationItem.innerHTML = `
                                <div class="notification-icon"><i class="fas ${notification.icon || 'fa-bell'}"></i></div>
                                <div class="notification-content">
                                    <p>${notification.message}</p>
                                    <span class="notification-time">${formatTimestamp(notification.timestamp)}</span>
                                </div>
                            `;
                            notificationsList.appendChild(notificationItem);
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching notifications: ", error);
                });
        }
    }
    
    function formatTimestamp(timestamp) {
        if (!timestamp) return 'Just now';
        
        const now = new Date();
        const date = timestamp.toDate();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                if (diffMinutes === 0) {
                    return 'Just now';
                }
                return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
            }
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    // AI Chatbot Toggle
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChat = document.querySelector('.close-chat');
    
    if (chatbotToggle && chatbotContainer && closeChat) {
        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.classList.toggle('hidden');
        });
        
        closeChat.addEventListener('click', () => {
            chatbotContainer.classList.add('hidden');
        });
    }
    
    // AI Chatbot Functionality with Gemini
    initializeChatbot();
    
    function initializeChatbot() {
        const chatInput = document.querySelector('.chatbot-input input');
        const chatSendBtn = document.querySelector('.chatbot-input button');
        const chatMessages = document.querySelector('.chatbot-messages');
        
        if (!chatInput || !chatSendBtn || !chatMessages) return;
        
        // Gemini API key
        const GEMINI_API_KEY = "AIzaSyCGnyt0WVJRq11zowUT_NoFuoHhJwimTTE";
        
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message to chat
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message bot typing';
            typingIndicator.innerHTML = '<p>...</p>';
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            try {
                // Call Gemini API
                const response = await fetchGeminiResponse(message);
                
                // Remove typing indicator
                chatMessages.removeChild(typingIndicator);
                
                // Add AI response to chat
                addMessage(response, 'bot');
            } catch (error) {
                console.error('Error getting AI response:', error);
                chatMessages.removeChild(typingIndicator);
                addMessage("I'm having trouble connecting to my knowledge base. Please try again later.", 'bot');
            }
        }
        
        async function fetchGeminiResponse(prompt) {
            // Create a context-aware prompt for the Levelling app
            const contextPrompt = `You are an AI assistant for a gamified self-improvement app called "Levelling" inspired by Solo Levelling. 
            The app helps users track their progress in physical health, academic studies, and knowledge/coding skills.
            Please respond to the following user query in a helpful, concise manner with a Solo Levelling theme: ${prompt}`;
            
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: contextPrompt
                            }]
                        }]
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                
                const data = await response.json();
                return data.candidates[0].content.parts[0].text;
            } catch (error) {
                console.error('Error calling Gemini API:', error);
                return "I apologize, Hunter. I'm having trouble accessing my knowledge base. Please try again later.";
            }
        }
        
        function addMessage(text, sender) {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${sender}`;
            messageElement.innerHTML = `<p>${text}</p>`;
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Generate AI Mock Test
    const generateMockTestBtn = document.getElementById('generate-mock-test');
    if (generateMockTestBtn) {
        generateMockTestBtn.addEventListener('click', async () => {
            const examType = document.getElementById('exam-select').value;
            
            // Show loading state
            generateMockTestBtn.disabled = true;
            generateMockTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            
            try {
                // In a real implementation, this would call OpenAI API
                // For demo purposes, we'll simulate a delay
                setTimeout(() => {
                    // Reset button
                    generateMockTestBtn.disabled = false;
                    generateMockTestBtn.innerHTML = '<i class="fas fa-robot"></i> Generate Mock Test';
                    
                    // Show success message
                    alert(`Mock test for ${examType.toUpperCase()} generated successfully! Check your email for the test.`);
                    
                    // In a real implementation, you would save the test to the database
                    if (auth.currentUser) {
                        db.collection('hunters').doc(auth.currentUser.uid)
                            .collection('mockTests').add({
                                examType: examType,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                completed: false
                            });
                    }
                }, 2000);
            } catch (error) {
                console.error('Error generating mock test:', error);
                generateMockTestBtn.disabled = false;
                generateMockTestBtn.innerHTML = '<i class="fas fa-robot"></i> Generate Mock Test';
                alert('Failed to generate mock test. Please try again later.');
            }
        });
    }
    
    // Update steps progress
    const stepsProgress = document.getElementById('steps-progress');
    if (stepsProgress) {
        // Simulate steps updating over time
        let currentSteps = 6500;
        const targetSteps = 10000;
        
        function updateStepsProgress() {
            // Randomly increase steps (simulating walking)
            if (Math.random() > 0.7 && currentSteps < targetSteps) {
                currentSteps += Math.floor(Math.random() * 100);
                if (currentSteps > targetSteps) currentSteps = targetSteps;
                
                // Update progress bar
                const progressPercentage = (currentSteps / targetSteps) * 100;
                stepsProgress.querySelector('.progress-fill').style.width = `${progressPercentage}%`;
                stepsProgress.nextElementSibling.textContent = `${currentSteps.toLocaleString()} / ${targetSteps.toLocaleString()}`;
            }
        }
        
        // Update steps every 30 seconds
        setInterval(updateStepsProgress, 30000);
    }
});
