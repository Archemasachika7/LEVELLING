// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            authButtons.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Create particles for background
    createParticles(document.body, 50);
    
    // Initialize parallax effect
    initParallax();
    
    // Add glowing border effect to cards
    document.querySelectorAll('.flip-card, .testimonial-card, .demo-container').forEach(card => {
        card.classList.add('glow-border');
    });
    
    // Add floating animation to select elements
    document.querySelectorAll('.hero h1, .cta, .user-level').forEach(el => {
        el.classList.add('float');
    });
    
    // Demo tabs functionality
    const demoTabs = document.querySelectorAll('.demo-tab');
    const demoPanels = document.querySelectorAll('.demo-panel');
    
    demoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            demoTabs.forEach(t => t.classList.remove('active'));
            demoPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding panel
            const panelId = `${tab.dataset.tab}-panel`;
            document.getElementById(panelId).classList.add('active');
            
            // Add magic effect on tab change
            createMagicEffect(tab);
        });
    });

    // Add event listeners to all CTA buttons to redirect to auth.html
document.querySelectorAll('.cta').forEach(button => {
    button.addEventListener('click', () => {
        // Add pulse effect on click
        button.classList.add('pulse');
        
        // Redirect to auth.html after a short delay (for animation to complete)
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 300);
    });
});

    
    // To-Do List functionality
    const todoInput = document.querySelector('.todo-input input');
    const todoButton = document.querySelector('.todo-input button');
    const todoList = document.querySelector('.todo-list');
    
    if (todoButton) {
        todoButton.addEventListener('click', addTask);
    }
    
    if (todoInput) {
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
    
    function addTask() {
        if (todoInput && todoInput.value.trim() !== '') {
            const li = document.createElement('li');
            const taskText = document.createTextNode(todoInput.value);
            li.appendChild(taskText);
            
            // Add XP element
            const xp = document.createElement('span');
            xp.className = 'xp';
            const xpValue = Math.floor(Math.random() * 15) + 5;
            xp.textContent = `+${xpValue} XP`;
            li.appendChild(xp);
            
            // Add click event to mark as completed
            li.addEventListener('click', () => {
                if (!li.classList.contains('completed')) {
                    li.classList.add('completed');
                    // Level up animation when task completed
                    showLevelUpNotification(xpValue);
                } else {
                    li.classList.remove('completed');
                }
            });
            
            // Add with animation
            li.style.opacity = '0';
            li.style.transform = 'translateX(-20px)';
            todoList.appendChild(li);
            
            // Trigger animation
            setTimeout(() => {
                li.style.transition = 'all 0.3s ease';
                li.style.opacity = '1';
                li.style.transform = 'translateX(0)';
            }, 10);
            
            todoInput.value = '';
        }
    }
    
    // Show level up notification
    function showLevelUpNotification(xp) {
        const notification = document.createElement('div');
        notification.className = 'level-notification';
        notification.innerHTML = `<span>+${xp} XP gained!</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
    }
    
    // Create magic effect on elements
    function createMagicEffect(element) {
        const effect = document.createElement('div');
        effect.className = 'magic-effect';
        
        const rect = element.getBoundingClientRect();
        effect.style.top = `${rect.top + window.scrollY}px`;
        effect.style.left = `${rect.left + window.scrollX}px`;
        effect.style.width = `${rect.width}px`;
        effect.style.height = `${rect.height}px`;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
    
    // Create particles for background
    function createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 5 + 2;
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
    
    // Initialize parallax effect
    function initParallax() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const speed = 0.5; // Adjust for more/less effect
                const yPos = -(scrollY * speed);
                section.style.backgroundPosition = `50% ${yPos}px`;
            });
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 196, 255, 0.5)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.9)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 196, 255, 0.3)';
        }
    });
    
    // Animated stats in hero section
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 500);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Add magic effect when clicking navigation
                createMagicEffect(this);
            }
        });
    });
    
    // Animation for elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards for animation
    document.querySelectorAll('section, .flip-card, .testimonial-card').forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    // Glowing effect for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.boxShadow = '0 0 25px #00C4FF';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.boxShadow = '0 0 15px #7B4BFF';
        });
        
        button.addEventListener('click', () => {
            // Add pulse effect on click
            button.classList.add('pulse');
            setTimeout(() => {
                button.classList.remove('pulse');
            }, 1000);
        });
    });
    
    // Simulated AI chatbot in demo
    const chatbotPanel = document.getElementById('chatbot-panel');
    if (chatbotPanel) {
        // Create chatbot interface
        const chatInterface = document.createElement('div');
        chatInterface.className = 'chat-interface';
        
        const chatMessages = document.createElement('div');
        chatMessages.className = 'chat-messages';
        
        const chatInput = document.createElement('div');
        chatInput.className = 'chat-input';
        chatInput.innerHTML = `
            <input type="text" placeholder="Ask your AI assistant...">
            <button><i class="fas fa-paper-plane"></i></button>
        `;
        
        chatInterface.appendChild(chatMessages);
        chatInterface.appendChild(chatInput);
        chatbotPanel.appendChild(chatInterface);
        
        // Add initial message
        addChatMessage("Hello Hunter! I'm your AI assistant. How can I help with your levelling journey today?", 'bot');
        
        // Handle chat input
        const input = chatInput.querySelector('input');
        const button = chatInput.querySelector('button');
        
        button.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            if (input.value.trim() !== '') {
                addChatMessage(input.value, 'user');
                
                // Simulate typing
                setTimeout(() => {
                    const responses = [
                        "I've analyzed your progress. Your coding skills are levelling up nicely!",
                        "Based on your recent activity, I recommend focusing on your JavaScript skills next.",
                        "You're making excellent progress! Your consistency is paying off.",
                        "I've added a new quest to your dashboard based on your goals.",
                        "Your current streak is impressive. Keep it up to earn bonus XP!"
                    ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addChatMessage(randomResponse, 'bot');
                }, 1000);
                
                input.value = '';
            }
        }
        
        function addChatMessage(message, sender) {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${sender}`;
            messageElement.textContent = message;
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Animate message appearance
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                messageElement.style.transition = 'all 0.3s ease';
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    // Add heatmap demo to coding panel
    const codingPanel = document.getElementById('coding-panel');
    if (codingPanel) {
        const heatmapDemo = document.createElement('div');
        heatmapDemo.className = 'heatmap-demo';
        heatmapDemo.innerHTML = '<h4>Your Coding Activity</h4>';
        
        const heatmap = document.createElement('div');
        heatmap.className = 'heatmap-grid';
        
        // Create heatmap grid
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 12; j++) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                
                // Random intensity
                const intensity = Math.floor(Math.random() * 5);
                cell.classList.add(`intensity-${intensity}`);
                
                // Add hover effect
                cell.addEventListener('mouseover', () => {
                    cell.style.transform = 'scale(1.2)';
                    cell.style.boxShadow = '0 0 10px #00C4FF';
                    cell.style.zIndex = '1';
                });
                
                cell.addEventListener('mouseout', () => {
                    cell.style.transform = 'scale(1)';
                    cell.style.boxShadow = 'none';
                    cell.style.zIndex = '0';
                });
                
                heatmap.appendChild(cell);
            }
        }
        
        heatmapDemo.appendChild(heatmap);
        
        const heatmapLegend = document.createElement('div');
        heatmapLegend.className = 'heatmap-legend';
        heatmapLegend.innerHTML = `
            <span class="legend-item"><div class="legend-color intensity-0"></div>No activity</span>
            <span class="legend-item"><div class="legend-color intensity-1"></div>Low</span>
            <span class="legend-item"><div class="legend-color intensity-2"></div>Medium</span>
            <span class="legend-item"><div class="legend-color intensity-3"></div>High</span>
            <span class="legend-item"><div class="legend-color intensity-4"></div>Intense</span>
        `;
        
        heatmapDemo.appendChild(heatmapLegend);
        codingPanel.appendChild(heatmapDemo);
    }
    
    // Add projects demo to projects panel
    const projectsPanel = document.getElementById('projects-panel');
    if (projectsPanel) {
        const projectsDemo = document.createElement('div');
        projectsDemo.className = 'projects-demo';
        
        const projects = [
            { name: 'Personal Portfolio Website', progress: 85, deadline: '2025-06-15' },
            { name: 'E-commerce App', progress: 42, deadline: '2025-07-20' },
            { name: 'Machine Learning Project', progress: 10, deadline: '2025-08-05' }
        ];
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            const daysLeft = Math.ceil((new Date(project.deadline) - new Date('2025-05-12')) / (1000 * 60 * 60 * 24));
            
            projectCard.innerHTML = `
                <h4>${project.name}</h4>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${project.progress}%"></div>
                    </div>
                    <span>${project.progress}%</span>
                </div>
                <div class="project-details">
                    <span class="deadline">Deadline: ${project.deadline}</span>
                    <span class="days-left">${daysLeft} days left</span>
                </div>
            `;
            
            projectsDemo.appendChild(projectCard);
        });
        
        projectsPanel.appendChild(projectsDemo);
    }
    
    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }
    `;
    document.head.appendChild(animationStyles);
});
