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
    
    // Sound effects
    const successSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3');
    
    // DOM Elements
    const introPopup = document.getElementById('intro-popup');
    const authContainer = document.getElementById('auth-container');
    const acceptQuestBtn = document.getElementById('accept-quest');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const hunterName = document.getElementById('hunter-name');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    const hunterRank = document.getElementById('hunter-rank');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const googleLoginBtn = document.getElementById('google-login');
    const googleSignupBtn = document.getElementById('google-signup');
    const resetPasswordBtn = document.getElementById('reset-password');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const toast = document.getElementById('toast');
    
    // Create particles for background
    createParticles(document.getElementById('particles'), 50);
    
    // Check if user has seen intro
    const hasSeenIntro = localStorage.getItem('seenIntro');
    if (hasSeenIntro) {
        introPopup.classList.add('hidden');
        authContainer.classList.remove('hidden');
    }
    
    // Accept Quest Button
    acceptQuestBtn.addEventListener('click', () => {
        introPopup.classList.add('hidden');
        authContainer.classList.remove('hidden');
        localStorage.setItem('seenIntro', 'true');
    });
    
    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            tabBtns.forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.form-container').forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            btn.classList.add('active');
            const tabName = btn.getAttribute('data-tab');
            document.getElementById(`${tabName}-form`).classList.add('active');
            
            // Clear error messages
            loginError.textContent = '';
            signupError.textContent = '';
        });
    });
    
    // Password Visibility Toggle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordInput = toggle.parentElement.querySelector('input');
            const icon = toggle.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Login with Email/Password
    loginBtn.addEventListener('click', () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        
        if (!email || !password) {
            loginError.textContent = 'WARNING: All fields are required';
            return;
        }
        
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.textContent = 'ACCESSING...';
        
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Signed in
                loginError.textContent = '';
                showToast('Dungeon Access Granted');
                successSound.play();
                
                // Redirect to mainpage after a delay
                setTimeout(() => {
                    window.location.href = 'mainpage.html';
                }, 1500);
            })
            .catch(error => {
                // Handle errors
                loginBtn.disabled = false;
                loginBtn.textContent = 'ACCESS GATE';
                
                switch(error.code) {
                    case 'auth/user-not-found':
                        loginError.textContent = 'WARNING: Hunter not found in database';
                        break;
                    case 'auth/wrong-password':
                        loginError.textContent = 'WARNING: Invalid gate password';
                        break;
                    case 'auth/invalid-email':
                        loginError.textContent = 'WARNING: Invalid player ID format';
                        break;
                    case 'auth/too-many-requests':
                        loginError.textContent = 'WARNING: Too many attempts. Try again later';
                        break;
                    default:
                        loginError.textContent = `WARNING: ${error.message}`;
                }
            });
    });
    
    // Sign Up with Email/Password
    signupBtn.addEventListener('click', () => {
        const name = hunterName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const confirmPwd = confirmPassword.value;
        const rank = hunterRank.value;
        
        // Validation
        if (!email || !password || !confirmPwd || !name) {
            signupError.textContent = 'WARNING: All fields are required';
            return;
        }
        
        if (password !== confirmPwd) {
            signupError.textContent = 'WARNING: Passwords do not match';
            return;
        }
        
        if (password.length < 6) {
            signupError.textContent = 'WARNING: Password must be at least 6 characters';
            return;
        }
        
        // Show loading state
        signupBtn.disabled = true;
        signupBtn.textContent = 'REGISTERING...';
        
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Signed up
                const user = userCredential.user;
                
                // Update user profile with display name
                return user.updateProfile({
                    displayName: name
                }).then(() => {
                    // Store additional user data in Firestore
                    return db.collection('hunters').doc(user.uid).set({
                        email: email,
                        displayName: name,
                        hunterRank: rank,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        level: 1,
                        xp: 0,
                        coins: 0
                    }).then(() => {
                        signupError.textContent = '';
                        showToast('Hunter Registration Complete');
                        successSound.play();
                        
                        // Redirect to mainpage after a delay
                        setTimeout(() => {
                            window.location.href = 'mainpage.html';
                        }, 1500);
                    });
                });
            })
            .catch(error => {
                // Handle errors
                signupBtn.disabled = false;
                signupBtn.textContent = 'REGISTER AS HUNTER';
                
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        signupError.textContent = 'WARNING: Player ID already registered';
                        break;
                    case 'auth/invalid-email':
                        signupError.textContent = 'WARNING: Invalid player ID format';
                        break;
                    case 'auth/weak-password':
                        signupError.textContent = 'WARNING: Password is too weak';
                        break;
                    default:
                        signupError.textContent = `WARNING: ${error.message}`;
                }
            });
    });
    
    // Google Sign In
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    
    function signInWithGoogle(isSignup = false) {
        auth.signInWithPopup(googleProvider)
            .then(result => {
                // Check if this is a new user
                const isNewUser = result.additionalUserInfo.isNewUser;
                const user = result.user;
                
                if (isNewUser || isSignup) {
                    // Store additional user data for new users
                    // Use Google display name if available
                    const displayName = user.displayName || "Shadow Hunter";
                    
                    return db.collection('hunters').doc(user.uid).set({
                        email: user.email,
                        displayName: displayName,
                        hunterRank: 'E', // Default rank for Google sign-ins
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        level: 1,
                        xp: 0,
                        coins: 0
                    }).then(() => {
                        showToast('Hunter Registration Complete');
                        successSound.play();
                        
                        setTimeout(() => {
                            window.location.href = 'mainpage.html';
                        }, 1500);
                    });
                } else {
                    // Existing user login
                    showToast('Dungeon Access Granted');
                    successSound.play();
                    
                    setTimeout(() => {
                        window.location.href = 'mainpage.html';
                    }, 1500);
                }
            })
            .catch(error => {
                // Handle errors
                if (isSignup) {
                    signupError.textContent = `WARNING: ${error.message}`;
                } else {
                    loginError.textContent = `WARNING: ${error.message}`;
                }
            });
    }
    
    googleLoginBtn.addEventListener('click', () => signInWithGoogle(false));
    googleSignupBtn.addEventListener('click', () => signInWithGoogle(true));
    
    // Password Reset
    resetPasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = loginEmail.value.trim();
        
        if (!email) {
            loginError.textContent = 'WARNING: Enter your email to reset password';
            return;
        }
        
        auth.sendPasswordResetEmail(email)
            .then(() => {
                loginError.textContent = '';
                showToast('Password reset email sent');
            })
            .catch(error => {
                switch(error.code) {
                    case 'auth/user-not-found':
                        loginError.textContent = 'WARNING: No account with that email';
                        break;
                    case 'auth/invalid-email':
                        loginError.textContent = 'WARNING: Invalid email format';
                        break;
                    default:
                        loginError.textContent = `WARNING: ${error.message}`;
                }
            });
    });
    
    // Check auth state
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in, check if they're coming from a redirect
            const isRedirected = sessionStorage.getItem('isRedirected');
            if (!isRedirected) {
                // Redirect to mainpage
                window.location.href = 'mainpage.html';
            }
        } else {
            // User is signed out
            sessionStorage.removeItem('isRedirected');
        }
    });
    
    // Create particles for background
    function createParticles(container, count) {
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
    
    // Show toast notification
    function showToast(message) {
        const toastMessage = document.querySelector('.toast-message');
        toastMessage.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
