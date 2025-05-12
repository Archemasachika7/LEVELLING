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
            
            // Initialize quests
            initializeQuests(user.uid);
            
            // Load steps history
            loadStepsHistory(user.uid);
            
            // Load water intake
            loadWaterIntake(user.uid);
            
            // Load exam history
            loadExamHistory(user.uid);
            
            // Load academic goals
            loadAcademicGoals(user.uid);
            
            // Load coding tasks
            loadCodingTasks(user.uid);
            
            // Load projects
            loadProjects(user.uid);
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
    
    // Initialize Quests
    function initializeQuests(userId) {
        const questsContainer = document.getElementById('active-quests');
        if (!questsContainer) return;
        
        // Get quests from Firestore
        db.collection('hunters').doc(userId)
            .collection('quests')
            .where('completed', '==', false)
            .limit(3)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    questsContainer.innerHTML = '';
                    
                    querySnapshot.forEach((doc) => {
                        const quest = doc.data();
                        const questCard = createQuestCard(quest, doc.id);
                        questsContainer.appendChild(questCard);
                    });
                }
            })
            .catch((error) => {
                console.error("Error getting quests:", error);
            });
    }
    
    function createQuestCard(quest, questId) {
        const questCard = document.createElement('div');
        questCard.className = 'quest-card';
        
        const progressPercentage = Math.min(100, (quest.current / quest.target) * 100);
        
        questCard.innerHTML = `
            <div class="quest-header">
                <h3>${quest.title}</h3>
                <span class="quest-reward">+${quest.xpReward} XP, +${quest.coinReward} Coins</span>
            </div>
            <p class="quest-description">${quest.description}</p>
            <div class="quest-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <span class="progress-text">${quest.current} / ${quest.target}</span>
            </div>
        `;
        
        return questCard;
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
    
    // Initialize Steps Tracking
    const addStepsBtn = document.getElementById('add-steps-btn');
    const stepsForm = document.getElementById('steps-form');
    const updateStepsBtn = document.getElementById('update-steps');
    const cancelStepsBtn = document.getElementById('cancel-steps');
    
    if (addStepsBtn && stepsForm) {
        addStepsBtn.addEventListener('click', () => {
            stepsForm.classList.remove('hidden');
        });
    }
    
    if (cancelStepsBtn && stepsForm) {
        cancelStepsBtn.addEventListener('click', () => {
            stepsForm.classList.add('hidden');
        });
    }
    
    if (updateStepsBtn) {
        updateStepsBtn.addEventListener('click', () => {
            const stepsInput = document.getElementById('steps-input');
            const stepsDate = document.getElementById('steps-date');
            
            const steps = parseInt(stepsInput.value);
            const date = stepsDate.value;
            
            if (!steps || isNaN(steps) || steps <= 0) {
                alert('Please enter a valid number of steps');
                return;
            }
            
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                // Format date for Firestore document ID (YYYYMMDD)
                const dateStr = date.replace(/-/g, '');
                
                db.collection('hunters').doc(userId)
                    .collection('physicalActivity')
                    .doc(dateStr)
                    .set({
                        steps: steps,
                        date: date,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true })
                    .then(() => {
                        stepsInput.value = '';
                        stepsForm.classList.add('hidden');
                        
                        // Update UI
                        updateStepsUI(userId);
                        
                        // Update chart
                        updatePhysicalChart(userId);
                        
                        // Load steps history
                        loadStepsHistory(userId);
                        
                        // Check for quest completion
                        checkStepQuests(userId, steps);
                    })
                    .catch((error) => {
                        console.error("Error saving steps:", error);
                    });
            }
        });
    }
    
    function loadStepsHistory(userId) {
        const historyList = document.getElementById('steps-history-list');
        if (!historyList) return;
        
        db.collection('hunters').doc(userId)
            .collection('physicalActivity')
            .orderBy('timestamp', 'desc')
            .limit(5)
            .get()
            .then((querySnapshot) => {
                historyList.innerHTML = '';
                
                if (querySnapshot.empty) {
                    historyList.innerHTML = '<li class="empty-message">No steps history yet</li>';
                } else {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const li = document.createElement('li');
                        const date = new Date(data.date).toLocaleDateString();
                        li.innerHTML = `<span>${date}</span> <span>${data.steps.toLocaleString()} steps</span>`;
                        historyList.appendChild(li);
                    });
                }
            })
            .catch((error) => {
                console.error("Error loading steps history:", error);
            });
    }
    
    function updateStepsUI(userId) {
        const today = new Date().toISOString().split('T')[0];
        const dateStr = today.replace(/-/g, '');
        
        db.collection('hunters').doc(userId)
            .collection('physicalActivity')
            .doc(dateStr)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().steps) {
                    const steps = doc.data().steps;
                    const targetSteps = 10000; // Default target
                    
                    // Update progress bar
                    const progressPercentage = (steps / targetSteps) * 100;
                    const progressFill = document.querySelector('#steps-progress .progress-fill');
                    const progressText = document.querySelector('#steps-progress + .progress-text');
                    
                    if (progressFill && progressText) {
                        progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
                        progressText.textContent = `${steps.toLocaleString()} / ${targetSteps.toLocaleString()}`;
                    }
                }
            })
            .catch((error) => {
                console.error("Error getting steps:", error);
            });
    }
    
    function checkStepQuests(userId, steps) {
        db.collection('hunters').doc(userId)
            .collection('quests')
            .where('type', '==', 'steps')
            .where('completed', '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const quest = doc.data();
                    
                    // Update quest progress
                    if (steps >= quest.target) {
                        // Quest completed
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                completed: true,
                                completedAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            .then(() => {
                                // Award XP and coins
                                awardReward(userId, quest.xpReward, quest.coinReward, quest.title);
                                
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    } else {
                        // Update progress
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                current: steps
                            })
                            .then(() => {
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    }
                });
            });
    }
    
    // Initialize Water Intake
    const addWaterBtn = document.getElementById('add-water');
    const resetWaterBtn = document.getElementById('reset-water');
    
    if (addWaterBtn) {
        addWaterBtn.addEventListener('click', () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const today = new Date().toISOString().split('T')[0];
                
                // Get current count
                db.collection('hunters').doc(userId)
                    .collection('waterIntake')
                    .doc(today)
                    .get()
                    .then((doc) => {
                        let currentGlasses = 0;
                        if (doc.exists) {
                            currentGlasses = doc.data().glasses || 0;
                        }
                        
                        // Increment and save
                        currentGlasses++;
                        db.collection('hunters').doc(userId)
                            .collection('waterIntake')
                            .doc(today)
                            .set({
                                glasses: currentGlasses,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            .then(() => {
                                updateWaterUI(userId);
                                
                                // Check for water intake quests
                                checkWaterQuests(userId, currentGlasses);
                            });
                    });
            }
        });
    }
    
    if (resetWaterBtn) {
        resetWaterBtn.addEventListener('click', () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const today = new Date().toISOString().split('T')[0];
                
                db.collection('hunters').doc(userId)
                    .collection('waterIntake')
                    .doc(today)
                    .set({
                        glasses: 0,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        updateWaterUI(userId);
                    });
            }
        });
    }
    
    function loadWaterIntake(userId) {
        updateWaterUI(userId);
    }
    
    function updateWaterUI(userId) {
        const today = new Date().toISOString().split('T')[0];
        
        db.collection('hunters').doc(userId)
            .collection('waterIntake')
            .doc(today)
            .get()
            .then((doc) => {
                let glasses = 0;
                if (doc.exists) {
                    glasses = doc.data().glasses || 0;
                }
                
                const targetGlasses = 10;
                const percentage = (glasses / targetGlasses) * 100;
                
                const waterFill = document.querySelector('.water-fill');
                const waterText = document.querySelector('.water-text');
                
                if (waterFill && waterText) {
                    waterFill.style.height = `${Math.min(percentage, 100)}%`;
                    waterText.textContent = `${glasses} / ${targetGlasses} glasses`;
                    
                    // Add wave animation
                    waterFill.style.animation = 'wave 2s linear infinite';
                }
            });
    }
    
    function checkWaterQuests(userId, glasses) {
        db.collection('hunters').doc(userId)
            .collection('quests')
            .where('type', '==', 'water')
            .where('completed', '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const quest = doc.data();
                    
                    // Update quest progress
                    if (glasses >= quest.target) {
                        // Quest completed
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                completed: true,
                                completedAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            .then(() => {
                                // Award XP and coins
                                awardReward(userId, quest.xpReward, quest.coinReward, quest.title);
                                
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    } else {
                        // Update progress
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                current: glasses
                            })
                            .then(() => {
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    }
                });
            });
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
    
    // Initialize Charts
    initializeCharts();
    
    function initializeCharts() {
        // Physical Activity Chart
        const physicalCtx = document.getElementById('physical-chart');
        if (physicalCtx && auth.currentUser) {
            updatePhysicalChart(auth.currentUser.uid);
        }
        
        // Exam Progress Chart
        const examCtx = document.getElementById('exam-progress-chart');
        if (examCtx) {
            updateExamChart(auth.currentUser.uid);
            
            // Update chart when exam selection changes
            document.getElementById('exam-select').addEventListener('change', function() {
                updateExamChart(auth.currentUser.uid, this.value);
            });
        }
    }
    
    function updatePhysicalChart(userId) {
        const physicalCtx = document.getElementById('physical-chart');
        if (!physicalCtx) return;
        
        // Get the last 7 days of steps data
        const dates = [];
        const stepsData = [];
        
        // Generate the last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            // Format date for Firestore query (YYYYMMDD)
            const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
            
            // Query Firestore for this date
            db.collection('hunters').doc(userId)
                .collection('physicalActivity')
                .doc(dateStr)
                .get()
                .then((doc) => {
                    if (doc.exists && doc.data().steps) {
                        // Update the steps data array
                        stepsData[6-i] = doc.data().steps;
                    } else {
                        // No data for this day
                        stepsData[6-i] = 0;
                    }
                    
                    // If we have all 7 days, update the chart
                    if (stepsData.filter(s => s !== undefined).length === 7) {
                        updatePhysicalChartUI(dates, stepsData);
                    }
                })
                .catch((error) => {
                    console.error("Error getting steps data:", error);
                });
        }
    }
    
    function updatePhysicalChartUI(dates, stepsData) {
        const physicalCtx = document.getElementById('physical-chart');
        
        // Check if chart already exists
        if (window.physicalChart) {
            window.physicalChart.destroy();
        }
        
        window.physicalChart = new Chart(physicalCtx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Steps',
                    data: stepsData,
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
    
    // Initialize Exam Tracking
    const addExamBtn = document.getElementById('add-exam-btn');
    const testInputForm = document.getElementById('test-input-form');
    const saveTestBtn = document.getElementById('save-test-btn');
    const cancelTestBtn = document.getElementById('cancel-test-btn');
    
    if (addExamBtn && testInputForm) {
        addExamBtn.addEventListener('click', () => {
            testInputForm.classList.remove('hidden');
        });
    }
    
    if (cancelTestBtn && testInputForm) {
        cancelTestBtn.addEventListener('click', () => {
            testInputForm.classList.add('hidden');
        });
    }
    
    if (saveTestBtn) {
        saveTestBtn.addEventListener('click', () => {
            const testName = document.getElementById('test-name').value.trim();
            const testScore = parseInt(document.getElementById('test-score').value);
            const examType = document.getElementById('exam-select').value;
            
            if (!testName || !testScore || isNaN(testScore)) {
                alert('Please enter both test name and score');
                return;
            }
            
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                
                db.collection('hunters').doc(userId)
                    .collection('examScores')
                    .add({
                        examType: examType,
                        testName: testName,
                        score: testScore,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        // Clear form
                        document.getElementById('test-name').value = '';
                        document.getElementById('test-score').value = '';
                        testInputForm.classList.add('hidden');
                        
                        // Update chart
                        updateExamChart(userId, examType);
                        
                        // Load exam history
                        loadExamHistory(userId);
                        
                        // Check for exam quests
                        checkExamQuests(userId, examType, testScore);
                    })
                    .catch((error) => {
                        console.error("Error saving exam score:", error);
                    });
            }
        });
    }
    
    function loadExamHistory(userId) {
        const historyList = document.getElementById('exam-history-list');
        if (!historyList) return;
        
        db.collection('hunters').doc(userId)
            .collection('examScores')
            .orderBy('timestamp', 'desc')
            .limit(5)
            .get()
            .then((querySnapshot) => {
                historyList.innerHTML = '';
                
                if (querySnapshot.empty) {
                    historyList.innerHTML = '<li class="empty-message">No exam history yet</li>';
                } else {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const li = document.createElement('li');
                        li.innerHTML = `<span>${data.testName} (${data.examType.toUpperCase()})</span> <span>${data.score}</span>`;
                        historyList.appendChild(li);
                    });
                }
            })
            .catch((error) => {
                console.error("Error loading exam history:", error);
            });
    }
    
    function updateExamChart(userId, examType = 'gre') {
        const examCtx = document.getElementById('exam-progress-chart');
        if (!examCtx) return;
        
        db.collection('hunters').doc(userId)
            .collection('examScores')
            .where('examType', '==', examType)
            .orderBy('timestamp', 'asc')
            .limit(10)
            .get()
            .then((querySnapshot) => {
                const labels = [];
                const scores = [];
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    labels.push(data.testName);
                    scores.push(data.score);
                });
                
                // If no data, use default values
                if (labels.length === 0) {
                    if (examType === 'gre') {
                        labels.push('Test 1', 'Test 2', 'Test 3', 'Test 4');
                        scores.push(310, 325, 340, 355);
                    } else if (examType === 'gmat') {
                        labels.push('Test 1', 'Test 2', 'Test 3', 'Test 4');
                        scores.push(620, 640, 670, 690);
                    } else if (examType === 'gate') {
                        labels.push('Test 1', 'Test 2', 'Test 3', 'Test 4');
                        scores.push(45, 52, 58, 65);
                    }
                }
                
                // Check if chart already exists
                if (window.examChart) {
                    window.examChart.destroy();
                }
                
                window.examChart = new Chart(examCtx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Score',
                            data: scores,
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
            })
            .catch((error) => {
                console.error("Error getting exam scores:", error);
            });
    }
    
    function checkExamQuests(userId, examType, score) {
        db.collection('hunters').doc(userId)
            .collection('quests')
            .where('type', '==', 'exam')
            .where('examType', '==', examType)
            .where('completed', '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const quest = doc.data();
                    
                    // Update quest progress
                    if (score >= quest.target) {
                        // Quest completed
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                completed: true,
                                completedAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            .then(() => {
                                // Award XP and coins
                                awardReward(userId, quest.xpReward, quest.coinReward, quest.title);
                                
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    }
                });
            });
    }
    
    // Initialize Pomodoro Timer
    initializePomodoro();
    
    function initializePomodoro() {
        const timerDisplay = document.querySelector('.timer-display');
        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');
        const resetBtn = document.getElementById('timer-reset');
        const applyTimerBtn = document.getElementById('apply-timer');
        const timerMinutes = document.getElementById('timer-minutes');
        const timerSubject = document.getElementById('timer-subject');
        
        if (!timerDisplay || !startBtn || !pauseBtn || !resetBtn || !applyTimerBtn || !timerMinutes || !timerSubject) return;
        
        let timer;
        let minutes = 25;
        let seconds = 0;
        let isRunning = false;
        let currentSubject = '';
        let startTime = null;
        
        function updateDisplay() {
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        applyTimerBtn.addEventListener('click', () => {
            const newMinutes = parseInt(timerMinutes.value);
            if (newMinutes && newMinutes > 0 && newMinutes <= 120) {
                minutes = newMinutes;
                seconds = 0;
                currentSubject = timerSubject.value.trim() || 'General Study';
                updateDisplay();
            } else {
                alert('Please enter a valid time between 1-120 minutes');
            }
        });
        
        startBtn.addEventListener('click', () => {
            if (isRunning) return;
            
            isRunning = true;
            startTime = new Date();
            
            timer = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(timer);
                        isRunning = false;
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
        });
        
        pauseBtn.addEventListener('click', () => {
            if (!isRunning) return;
            
            clearInterval(timer);
            isRunning = false;
            
            // Save partial progress
            if (startTime && auth.currentUser) {
                const endTime = new Date();
                const studyTime = Math.floor((endTime - startTime) / 1000 / 60); // in minutes
                
                if (studyTime > 0) {
                    saveStudyTime(auth.currentUser.uid, currentSubject, studyTime);
                    startTime = null;
                }
            }
        });
        
        resetBtn.addEventListener('click', () => {
            clearInterval(timer);
            isRunning = false;
            minutes = parseInt(timerMinutes.value) || 25;
            seconds = 0;
            updateDisplay();
            
            // Save partial progress if timer was running
            if (startTime && auth.currentUser) {
                const endTime = new Date();
                const studyTime = Math.floor((endTime - startTime) / 1000 / 60); // in minutes
                
                if (studyTime > 0) {
                    saveStudyTime(auth.currentUser.uid, currentSubject, studyTime);
                    startTime = null;
                }
            }
        });
        
        function timerComplete() {
            // Play sound and show notification
            if (Notification.permission === 'granted') {
                const notification = new Notification('Study Timer Complete', {
                    body: `You've completed ${timerMinutes.value} minutes of ${currentSubject}!`,
                    icon: '/favicon.ico'
                });
            }
            
            // Play sound
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.play();
            
            // Save study time to Firebase
            if (auth.currentUser) {
                saveStudyTime(auth.currentUser.uid, currentSubject, parseInt(timerMinutes.value));
            }
            
            // Reset for next session
            setTimeout(() => {
                minutes = parseInt(timerMinutes.value) || 25;
                seconds = 0;
                updateDisplay();
            }, 3000);
        }
        
        // Request notification permission
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
    
    function saveStudyTime(userId, subject, minutes) {
        const today = new Date().toISOString().split('T')[0];
        
        db.collection('hunters').doc(userId)
            .collection('studyTime')
            .doc(today)
            .get()
            .then((doc) => {
                let subjectTimes = {};
                
                if (doc.exists) {
                    subjectTimes = doc.data().subjects || {};
                }
                
                // Update or add subject time
                if (subjectTimes[subject]) {
                    subjectTimes[subject] += minutes;
                } else {
                    subjectTimes[subject] = minutes;
                }
                
                // Save to Firebase
                db.collection('hunters').doc(userId)
                    .collection('studyTime')
                    .doc(today)
                    .set({
                        subjects: subjectTimes,
                        totalMinutes: Object.values(subjectTimes).reduce((a, b) => a + b, 0),
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        updateStudyTimeUI(userId);
                        
                        // Check for study time quests
                        checkStudyQuests(userId, Object.values(subjectTimes).reduce((a, b) => a + b, 0));
                    });
            });
    }
    
    function updateStudyTimeUI(userId) {
        const subjectTimeList = document.getElementById('subject-time-list');
        if (!subjectTimeList) return;
        
        const today = new Date().toISOString().split('T')[0];
        
        db.collection('hunters').doc(userId)
            .collection('studyTime')
            .doc(today)
            .get()
            .then((doc) => {
                subjectTimeList.innerHTML = '';
                
                if (doc.exists && doc.data().subjects) {
                    const subjects = doc.data().subjects;
                    
                    for (const [subject, minutes] of Object.entries(subjects)) {
                        const subjectItem = document.createElement('div');
                        subjectItem.className = 'subject-time-item';
                        
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        
                        let timeText = '';
                        if (hours > 0) {
                            timeText += `${hours}h `;
                        }
                        timeText += `${mins}m`;
                        
                        subjectItem.innerHTML = `
                            <span class="subject-name">${subject}</span>
                            <span class="subject-time">${timeText}</span>
                        `;
                        
                        subjectTimeList.appendChild(subjectItem);
                    }
                } else {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = 'No study time recorded today';
                    subjectTimeList.appendChild(emptyMessage);
                }
            });
    }
    
    function checkStudyQuests(userId, totalMinutes) {
        db.collection('hunters').doc(userId)
            .collection('quests')
            .where('type', '==', 'study')
            .where('completed', '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const quest = doc.data();
                    
                    // Update quest progress
                    if (totalMinutes >= quest.target) {
                        // Quest completed
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                completed: true,
                                completedAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            .then(() => {
                                // Award XP and coins
                                awardReward(userId, quest.xpReward, quest.coinReward, quest.title);
                                
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    } else {
                        // Update progress
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                current: totalMinutes
                            })
                            .then(() => {
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    }
                });
            });
    }
    
    // Initialize Academic Goals
    const addGoalBtn = document.getElementById('add-goal');
    
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => {
            const goalText = document.getElementById('goal-text').value.trim();
            
            if (!goalText) return;
            
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                
                db.collection('hunters').doc(userId)
                    .collection('academicGoals')
                    .add({
                        text: goalText,
                        completed: false,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        document.getElementById('goal-text').value = '';
                        loadAcademicGoals(userId);
                    });
            }
        });
    }
    
    function loadAcademicGoals(userId) {
        const goalsList = document.getElementById('academic-goals-list');
        if (!goalsList) return;
        
        db.collection('hunters').doc(userId)
            .collection('academicGoals')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get()
            .then((querySnapshot) => {
                goalsList.innerHTML = '';
                
                if (querySnapshot.empty) {
                    const emptyMessage = document.createElement('li');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = 'No academic goals set';
                    goalsList.appendChild(emptyMessage);
                } else {
                    querySnapshot.forEach((doc) => {
                        const goal = doc.data();
                        const goalId = doc.id;
                        
                        const goalItem = document.createElement('li');
                        goalItem.className = 'goal-item';
                        if (goal.completed) {
                            goalItem.classList.add('completed');
                        }
                        
                        goalItem.innerHTML = `
                            <div class="goal-checkbox">
                                <input type="checkbox" id="goal-${goalId}" ${goal.completed ? 'checked' : ''}>
                                <label for="goal-${goalId}"></label>
                            </div>
                            <span class="goal-text">${goal.text}</span>
                            <button class="delete-goal" data-id="${goalId}"><i class="fas fa-trash"></i></button>
                        `;
                        
                        goalsList.appendChild(goalItem);
                        
                        // Add event listeners
                        const checkbox = goalItem.querySelector(`#goal-${goalId}`);
                        checkbox.addEventListener('change', () => {
                            db.collection('hunters').doc(userId)
                                .collection('academicGoals')
                                .doc(goalId)
                                .update({
                                    completed: checkbox.checked
                                });
                            
                            if (checkbox.checked) {
                                goalItem.classList.add('completed');
                                
                                // Award XP for completing a goal
                                awardReward(userId, 10, 5, 'Academic Goal');
                            } else {
                                goalItem.classList.remove('completed');
                            }
                        });
                        
                        const deleteBtn = goalItem.querySelector('.delete-goal');
                        deleteBtn.addEventListener('click', () => {
                            db.collection('hunters').doc(userId)
                                .collection('academicGoals')
                                .doc(goalId)
                                .delete()
                                .then(() => {
                                    goalItem.remove();
                                    if (goalsList.children.length === 0) {
                                        const emptyMessage = document.createElement('li');
                                        emptyMessage.className = 'empty-message';
                                        emptyMessage.textContent = 'No academic goals set';
                                        goalsList.appendChild(emptyMessage);
                                    }
                                });
                        });
                    });
                }
            });
    }
    
    // Initialize Riddle
    initializeRiddle();
    
    async function initializeRiddle() {
        const riddleQuestion = document.getElementById('riddle-question');
        const riddleAnswer = document.getElementById('riddle-answer');
        const riddleAnswerBtn = document.getElementById('riddle-answer-btn');
        const riddleAnswerInput = document.getElementById('riddle-answer-input');
        const submitRiddleAnswer = document.getElementById('submit-riddle-answer');
        const riddleResult = document.getElementById('riddle-result');
        const nextRiddleBtn = document.getElementById('next-riddle-btn');
        const riddleCounter = document.querySelector('.riddle-counter');
        
        if (!riddleQuestion || !riddleAnswer || !riddleAnswerBtn || !riddleAnswerInput || !submitRiddleAnswer || !riddleResult || !nextRiddleBtn) return;
        
        let currentRiddle = null;
        
        // Load riddle counter
        if (auth.currentUser && riddleCounter) {
            const today = new Date().toISOString().split('T')[0];
            
            db.collection('hunters').doc(auth.currentUser.uid)
                .collection('riddles')
                .doc(today)
                .get()
                .then((doc) => {
                    let count = 0;
                    if (doc.exists) {
                        count = doc.data().count || 0;
                    }
                    
                    riddleCounter.textContent = `(${count}/5 today)`;
                });
        }
        
        // Load a new riddle
        loadNewRiddle();
        
        // Submit answer
        submitRiddleAnswer.addEventListener('click', () => {
            const userAnswer = riddleAnswerInput.value.trim().toLowerCase();
            
            if (!userAnswer) return;
            
            if (currentRiddle && userAnswer === currentRiddle.answer.toLowerCase()) {
                // Correct answer
                riddleResult.querySelector('.result-message').textContent = 'Correct! +10 XP, +5 Coins';
                riddleResult.classList.remove('hidden');
                
                // Award XP and coins
                if (auth.currentUser) {
                    awardReward(auth.currentUser.uid, 10, 5, 'Riddle Solved');
                    
                    // Update riddle counter
                    const today = new Date().toISOString().split('T')[0];
                    
                    db.collection('hunters').doc(auth.currentUser.uid)
                        .collection('riddles')
                        .doc(today)
                        .get()
                        .then((doc) => {
                            let count = 1;
                            if (doc.exists) {
                                count = (doc.data().count || 0) + 1;
                            }
                            
                            db.collection('hunters').doc(auth.currentUser.uid)
                                .collection('riddles')
                                .doc(today)
                                .set({
                                    count: count,
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                                })
                                .then(() => {
                                    riddleCounter.textContent = `(${count}/5 today)`;
                                    
                                    // Check for riddle quests
                                    checkRiddleQuests(auth.currentUser.uid, count);
                                });
                        });
                }
            } else {
                // Incorrect answer
                riddleResult.querySelector('.result-message').textContent = 'Incorrect. Try again!';
                riddleResult.classList.remove('hidden');
            }
        });
        
        // Next riddle
        nextRiddleBtn.addEventListener('click', () => {
            riddleResult.classList.add('hidden');
            riddleAnswerInput.value = '';
            loadNewRiddle();
        });
        
        // Toggle answer visibility
        riddleAnswerBtn.addEventListener('click', () => {
            riddleAnswer.classList.toggle('hidden');
            riddleAnswerBtn.textContent = riddleAnswer.classList.contains('hidden') ? 
                'Reveal Answer' : 'Hide Answer';
        });
        
        async function loadNewRiddle() {
            try {
                // Fetch riddle from API
                const response = await fetch('https://api.api-ninjas.com/v1/riddles', {
                    headers: {
                        'X-Api-Key': 'YARUJ7lJtJtL0FA8jMf/xg==Cevt0to8stuhygF7'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        currentRiddle = data[0];
                        riddleQuestion.textContent = data[0].question;
                        riddleAnswer.textContent = data[0].answer;
                        riddleAnswer.classList.add('hidden');
                        riddleAnswerBtn.textContent = 'Reveal Answer';
                    }
                } else {
                    // Fallback to default riddle if API fails
                    console.error('Failed to fetch riddle');
                    useFallbackRiddle();
                }
            } catch (error) {
                console.error('Error fetching riddle:', error);
                useFallbackRiddle();
            }
        }
        
        function useFallbackRiddle() {
            const fallbackRiddles = [
                { question: "What has keys but no locks, space but no room, and you can enter but not go in?", answer: "A keyboard" },
                { question: "I'm tall when I'm young, and I'm short when I'm old. What am I?", answer: "A candle" },
                { question: "What has a head and a tail but no body?", answer: "A coin" }
            ];
            
            const randomRiddle = fallbackRiddles[Math.floor(Math.random() * fallbackRiddles.length)];
            currentRiddle = randomRiddle;
            riddleQuestion.textContent = randomRiddle.question;
            riddleAnswer.textContent = randomRiddle.answer;
            riddleAnswer.classList.add('hidden');
            riddleAnswerBtn.textContent = 'Reveal Answer';
        }
    }
    
    function checkRiddleQuests(userId, count) {
        db.collection('hunters').doc(userId)
            .collection('quests')
            .where('type', '==', 'riddle')
            .where('completed', '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const quest = doc.data();
                    
                    // Update quest progress
                    if (count >= quest.target) {
                        // Quest completed
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                completed: true,
                                completedAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            .then(() => {
                                // Award XP and coins
                                awardReward(userId, quest.xpReward, quest.coinReward, quest.title);
                                
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    } else {
                        // Update progress
                        db.collection('hunters').doc(userId)
                            .collection('quests')
                            .doc(doc.id)
                            .update({
                                current: count
                            })
                            .then(() => {
                                // Refresh quests
                                initializeQuests(userId);
                            });
                    }
                });
            });
    }
    
    // Initialize Anime Quote
    initializeAnimeQuote();
    
    async function initializeAnimeQuote() {
        const animeQuote = document.getElementById('anime-quote');
        const quoteAuthor = document.getElementById('quote-author');
        const refreshQuoteBtn = document.getElementById('refresh-quote');
        
        if (!animeQuote || !quoteAuthor) return;
        
        // Load initial quote
        loadNewQuote();
        
        // Refresh quote button
        if (refreshQuoteBtn) {
            refreshQuoteBtn.addEventListener('click', loadNewQuote);
        }
        
        async function loadNewQuote() {
            try {
                // Fetch quote from API
                const response = await fetch('https://yurippe.vercel.app/api/quotes?random=1');
                
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        animeQuote.textContent = `"${data[0].quote}"`;
                        quoteAuthor.textContent = `- ${data[0].character} (${data[0].anime})`;
                    }
                } else {
                    // Fallback quotes if API fails
                    console.error('Failed to fetch anime quote');
                    useRandomFallbackQuote();
                }
            } catch (error) {
                console.error('Error fetching anime quote:', error);
                useRandomFallbackQuote();
            }
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
    
    // Initialize Coding Tasks
    const addCodingTaskBtn = document.getElementById('add-coding-task');
    
    if (addCodingTaskBtn) {
        addCodingTaskBtn.addEventListener('click', () => {
            const taskText = document.getElementById('coding-task').value.trim();
            const taskTime = parseInt(document.getElementById('coding-time').value);
            
            if (!taskText || !taskTime || isNaN(taskTime) || taskTime < 15 || taskTime > 240) {
                alert('Please enter a valid task and time (15-240 minutes)');
                return;
            }
            
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                
                db.collection('hunters').doc(userId)
                    .collection('codingTasks')
                    .add({
                        text: taskText,
                        timeAllotted: taskTime,
                        completed: false,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        document.getElementById('coding-task').value = '';
                        document.getElementById('coding-time').value = '60';
                        loadCodingTasks(userId);
                    });
            }
        });
    }
    
    function loadCodingTasks(userId) {
        const tasksList = document.getElementById('coding-tasks-list');
        if (!tasksList) return;
        
        db.collection('hunters').doc(userId)
            .collection('codingTasks')
            .where('completed', '==', false)
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get()
            .then((querySnapshot) => {
                tasksList.innerHTML = '';
                
                if (querySnapshot.empty) {
                    const emptyMessage = document.createElement('li');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = 'No coding tasks added';
                    tasksList.appendChild(emptyMessage);
                } else {
                    querySnapshot.forEach((doc) => {
                        const task = doc.data();
                        const taskId = doc.id;
                        
                        const taskItem = document.createElement('li');
                        taskItem.className = 'coding-task-item';
                        
                        const hours = Math.floor(task.timeAllotted / 60);
                        const mins = task.timeAllotted % 60;
                        
                        let timeText = '';
                        if (hours > 0) {
                            timeText += `${hours}h `;
                        }
                        timeText += `${mins}m`;
                        
                        taskItem.innerHTML = `
                            <div class="task-info">
                                <span class="task-text">${task.text}</span>
                                <span class="task-time">${timeText}</span>
                            </div>
                            <div class="task-actions">
                                <button class="start-task" data-id="${taskId}"><i class="fas fa-play"></i></button>
                                <button class="complete-task" data-id="${taskId}"><i class="fas fa-check"></i></button>
                                <button class="delete-task" data-id="${taskId}"><i class="fas fa-trash"></i></button>
                            </div>
                        `;
                        
                        tasksList.appendChild(taskItem);
                        
                        // Add event listeners
                        const startBtn = taskItem.querySelector('.start-task');
                        startBtn.addEventListener('click', () => {
                            // Set timer to this task's time
                            const timerMinutes = document.getElementById('timer-minutes');
                            const timerSubject = document.getElementById('timer-subject');
                            const applyTimerBtn = document.getElementById('apply-timer');
                            
                            if (timerMinutes && timerSubject && applyTimerBtn) {
                                timerMinutes.value = task.timeAllotted;
                                timerSubject.value = task.text;
                                applyTimerBtn.click();
                                
                                // Scroll to timer
                                document.querySelector('.pomodoro-timer').scrollIntoView({ behavior: 'smooth' });
                            }
                        });
                        
                        const completeBtn = taskItem.querySelector('.complete-task');
                        completeBtn.addEventListener('click', () => {
                            db.collection('hunters').doc(userId)
                                .collection('codingTasks')
                                .doc(taskId)
                                .update({
                                    completed: true,
                                    completedAt: firebase.firestore.FieldValue.serverTimestamp()
                                })
                                .then(() => {
                                    loadCodingTasks(userId);
                                    
                                    // Award XP and coins
                                    awardReward(userId, 15, 10, 'Coding Task');
                                    
                                    // Update heatmap
                                    updateCodingHeatmap(userId);
                                    
                                    // Check for coding task quests
                                    checkCodingTaskQuests(userId);
                                });
                        });
                        
                        const deleteBtn = taskItem.querySelector('.delete-task');
                        deleteBtn.addEventListener('click', () => {
                            db.collection('hunters').doc(userId)
                                .collection('codingTasks')
                                .doc(taskId)
                                .delete()
                                .then(() => {
                                    loadCodingTasks(userId);
                                });
                        });
                    });
                }
            });
    }
    
    function updateCodingHeatmap(userId) {
        // This would update the coding heatmap based on completed tasks
        // For now, we'll just use random data as in the original code
    }
    
    function checkCodingTaskQuests(userId) {
        db.collection('hunters').doc(userId)
            .collection('quests')
            .where('type', '==', 'coding')
            .where('completed', '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const quest = doc.data();
                    
                    // Get completed coding tasks count
                    db.collection('hunters').doc(userId)
                        .collection('codingTasks')
                        .where('completed', '==', true)
                        .get()
                        .then((tasksSnapshot) => {
                            const completedCount = tasksSnapshot.size;
                            
                            // Update quest progress
                            if (completedCount >= quest.target) {
                                // Quest completed
                                db.collection('hunters').doc(userId)
                                    .collection('quests')
                                    .doc(doc.id)
                                    .update({
                                        completed: true,
                                        completedAt: firebase.firestore.FieldValue.serverTimestamp()
                                    })
                                    .then(() => {
                                        // Award XP and coins
                                        awardReward(userId, quest.xpReward, quest.coinReward, quest.title);
                                        
                                        // Refresh quests
                                        initializeQuests(userId);
                                    });
                            } else {
                                // Update progress
                                db.collection('hunters').doc(userId)
                                    .collection('quests')
                                    .doc(doc.id)
                                    .update({
                                        current: completedCount
                                    })
                                    .then(() => {
                                        // Refresh quests
                                        initializeQuests(userId);
                                    });
                            }
                        });
                });
            });
    }
    
    // Initialize Project Tracker
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectForm = document.getElementById('project-form');
    const saveProjectBtn = document.getElementById('save-project');
    const cancelProjectBtn = document.getElementById('cancel-project');
    
    if (addProjectBtn && projectForm) {
        addProjectBtn.addEventListener('click', () => {
            projectForm.classList.remove('hidden');
            addProjectBtn.classList.add('hidden');
            
            // Set min date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('project-deadline').min = today;
        });
    }
    
    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', () => {
            projectForm.classList.add('hidden');
            addProjectBtn.classList.remove('hidden');
            document.getElementById('project-name').value = '';
            document.getElementById('project-deadline').value = '';
        });
    }
    
    if (saveProjectBtn) {
        saveProjectBtn.addEventListener('click', () => {
            const name = document.getElementById('project-name').value.trim();
            const deadline = document.getElementById('project-deadline').value;
            
            if (!name || !deadline) {
                alert('Please enter both project name and deadline');
                return;
            }
            
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                
                db.collection('hunters').doc(userId)
                    .collection('projects')
                    .add({
                        name: name,
                        deadline: deadline,
                        progress: 0,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        projectForm.classList.add('hidden');
                        addProjectBtn.classList.remove('hidden');
                        document.getElementById('project-name').value = '';
                        document.getElementById('project-deadline').value = '';
                        loadProjects(userId);
                    });
            }
        });
    }
    
    function loadProjects(userId) {
        const projectsList = document.getElementById('projects-list');
        if (!projectsList) return;
        
        db.collection('hunters').doc(userId)
            .collection('projects')
            .orderBy('deadline', 'asc')
            .limit(3)
            .get()
            .then((querySnapshot) => {
                projectsList.innerHTML = '';
                
                if (querySnapshot.empty) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = 'No projects added';
                    projectsList.appendChild(emptyMessage);
                } else {
                    querySnapshot.forEach((doc) => {
                        const project = doc.data();
                        const projectId = doc.id;
                        
                        const projectItem = document.createElement('div');
                        projectItem.className = 'project-item';
                        
                        // Calculate days left
                        const deadlineDate = new Date(project.deadline);
                        const today = new Date();
                        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
                        
                        projectItem.innerHTML = `
                            <div class="project-header">
                                <h4>${project.name}</h4>
                                <span class="days-left">${daysLeft} days left</span>
                            </div>
                            <div class="project-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                                </div>
                                <span class="progress-text">${project.progress}%</span>
                            </div>
                            <div class="project-actions">
                                <input type="range" min="0" max="100" value="${project.progress}" class="progress-slider" data-id="${projectId}">
                                <button class="delete-project" data-id="${projectId}"><i class="fas fa-trash"></i></button>
                            </div>
                        `;
                        
                        projectsList.appendChild(projectItem);
                        
                        // Add event listeners
                        const slider = projectItem.querySelector('.progress-slider');
                        slider.addEventListener('change', () => {
                            const newProgress = parseInt(slider.value);
                            
                            db.collection('hunters').doc(userId)
                                .collection('projects')
                                .doc(projectId)
                                .update({
                                    progress: newProgress
                                })
                                .then(() => {
                                    const progressFill = projectItem.querySelector('.progress-fill');
                                    const progressText = projectItem.querySelector('.progress-text');
                                    
                                    progressFill.style.width = `${newProgress}%`;
                                    progressText.textContent = `${newProgress}%`;
                                    
                                    // Check if project completed
                                    if (newProgress === 100) {
                                        // Award XP and coins
                                        awardReward(userId, 50, 25, 'Project Completed');
                                        
                                        // Check for project quests
                                        checkProjectQuests(userId);
                                    }
                                });
                        });
                        
                        const deleteBtn = projectItem.querySelector('.delete-project');
                        deleteBtn.addEventListener('click', () => {
                            if (confirm('Are you sure you want to delete this project?')) {
                                db.collection('hunters').doc(userId)
                                    .collection('projects')
                                    .doc(projectId)
                                    .delete()
                                    .then(() => {
                                        loadProjects(userId);
                                    });
                            }
                        });
                    });
                }
            });
    }
    
    function checkProjectQuests(userId) {
        db.collection('hunters').doc(userId)
            .collection('quests')
            .where('type', '==', 'project')
            .where('completed', '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const quest = doc.data();
                    
                    // Get completed projects count
                    db.collection('hunters').doc(userId)
                        .collection('projects')
                        .where('progress', '==', 100)
                        .get()
                        .then((projectsSnapshot) => {
                            const completedCount = projectsSnapshot.size;
                            
                            // Update quest progress
                            if (completedCount >= quest.target) {
                                // Quest completed
                                db.collection('hunters').doc(userId)
                                    .collection('quests')
                                    .doc(doc.id)
                                    .update({
                                        completed: true,
                                        completedAt: firebase.firestore.FieldValue.serverTimestamp()
                                    })
                                    .then(() => {
                                        // Award XP and coins
                                        awardReward(userId, quest.xpReward, quest.coinReward, quest.title);
                                        
                                        // Refresh quests
                                        initializeQuests(userId);
                                    });
                            } else {
                                // Update progress
                                db.collection('hunters').doc(userId)
                                    .collection('quests')
                                    .doc(doc.id)
                                    .update({
                                        current: completedCount
                                    })
                                    .then(() => {
                                        // Refresh quests
                                        initializeQuests(userId);
                                    });
                            }
                        });
                });
            });
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
    
    // AI Chatbot Functionality with DeepSeek
    initializeChatbot();
    
    function initializeChatbot() {
        const chatInput = document.querySelector('.chatbot-input input');
        const chatSendBtn = document.querySelector('.chatbot-input button');
        const chatMessages = document.querySelector('.chatbot-messages');
        
        if (!chatInput || !chatSendBtn || !chatMessages) return;
        
        // DeepSeek API key
        const DEEPSEEK_API_KEY = "sk-fef3bf2263d04179a12570f0b727ec99";
        
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
                // Call DeepSeek API
                const response = await fetchDeepSeekResponse(message);
                
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
        
        async function fetchDeepSeekResponse(prompt) {
            // Create a context-aware prompt for the Levelling app
            const contextPrompt = `You are an AI assistant for a gamified self-improvement app called "Levelling" inspired by Solo Levelling. 
            The app helps users track their progress in physical health, academic studies, and knowledge/coding skills.
            Please respond to the following user query in a helpful, concise manner with a Solo Levelling theme: ${prompt}`;
            
            try {
                const response = await fetch(`https://api.deepseek.com/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [
                            {
                                role: "system",
                                content: "You are an AI assistant for a gamified self-improvement app called 'Levelling' inspired by Solo Levelling. Respond in a helpful, concise manner with a Solo Levelling theme."
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                
                const data = await response.json();
                return data.choices[0].message.content;
            } catch (error) {
                console.error('Error calling DeepSeek API:', error);
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
                // In a real implementation, this would call an AI API
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
                    
                    // Award XP and coins
                    awardReward(auth.currentUser.uid, 20, 10, 'Mock Test Generated');
                }, 2000);
            } catch (error) {
                console.error('Error generating mock test:', error);
                generateMockTestBtn.disabled = false;
                generateMockTestBtn.innerHTML = '<i class="fas fa-robot"></i> Generate Mock Test';
                alert('Failed to generate mock test. Please try again later.');
            }
        });
    }
    
    // Refresh Quests Button
    const refreshQuestsBtn = document.getElementById('refresh-quests-btn');
    if (refreshQuestsBtn) {
        refreshQuestsBtn.addEventListener('click', () => {
            if (auth.currentUser) {
                initializeQuests(auth.currentUser.uid);
            }
        });
    }
    
    // Award XP and Coins
    function awardReward(userId, xp, coins, questTitle) {
        // Update user XP and coins
        db.collection('hunters').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const currentXP = userData.xp || 0;
                    const currentCoins = userData.coins || 0;
                    const currentLevel = userData.level || 1;
                    
                    // Calculate new XP and level
                    const newXP = currentXP + xp;
                    let newLevel = currentLevel;
                    
                    // Check if level up (simple formula: level * 500 XP needed)
                    const xpForNextLevel = currentLevel * 500;
                    if (newXP >= xpForNextLevel) {
                        newLevel = currentLevel + 1;
                        
                        // Create level up notification
                        createNotification(userId, 'level-up', `You've reached Level ${newLevel}!`, 'fa-level-up-alt');
                    }
                    
                    // Update user data
                    db.collection('hunters').doc(userId).update({
                        xp: newXP,
                        coins: currentCoins + coins,
                        level: newLevel
                    })
                    .then(() => {
                        // Update UI
                        document.getElementById('user-level').textContent = `Level ${newLevel}`;
                        document.getElementById('user-xp').textContent = `${newXP}/${newLevel * 500} XP`;
                        document.getElementById('user-coins').textContent = currentCoins + coins;
                        
                        // Show reward animation
                        showRewardAnimation(xp, coins, questTitle);
                        
                        // Create quest completion notification
                        if (questTitle) {
                            createNotification(userId, 'quest-complete', `You've completed the "${questTitle}" quest!`, 'fa-trophy');
                        }
                    });
                }
            });
    }
    
    function showRewardAnimation(xp, coins, questTitle) {
        const rewardAnimation = document.getElementById('reward-animation');
        const rewardDetails = document.getElementById('reward-details');
        
        if (rewardAnimation && rewardDetails) {
            rewardDetails.textContent = `+${xp} XP, +${coins} Coins`;
            rewardAnimation.classList.remove('hidden');
            
            // Hide after 3 seconds
            setTimeout(() => {
                rewardAnimation.classList.add('hidden');
            }, 3000);
        }
    }
    
    function createNotification(userId, type, message, icon) {
        db.collection('hunters').doc(userId)
            .collection('notifications')
            .add({
                type: type,
                message: message,
                icon: icon,
                read: false,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                // Update notification badge count
                updateNotificationBadge(userId);
            });
    }
    
    function updateNotificationBadge(userId) {
        db.collection('hunters').doc(userId)
            .collection('notifications')
            .where('read', '==', false)
            .get()
            .then((querySnapshot) => {
                const count = querySnapshot.size;
                const badge = document.querySelector('.notification-badge');
                
                if (badge) {
                    badge.textContent = count;
                    badge.style.display = count > 0 ? 'flex' : 'none';
                }
            });
    }
});

