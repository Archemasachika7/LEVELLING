// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Particle effect background for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        createParticles(heroSection);
    }
    
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
    function createParticles(container) {
        for (let i = 0; i < 50; i++) {
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
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(138, 43, 226, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            navbar.style.boxShadow = '0 2px 10px rgba(138, 43, 226, 0.3)';
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
    
    // Animation for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Glowing effect for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta, .pricing-cta');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.boxShadow = '0 0 25px #9a4dff';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.boxShadow = '0 0 15px #7b2ff7';
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
            { name: 'Personal Portfolio Website', progress: 85, deadline: '2025-05-20' },
            { name: 'E-commerce App', progress: 42, deadline: '2025-06-15' },
            { name: 'Machine Learning Project', progress: 10, deadline: '2025-07-01' }
        ];
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            const daysLeft = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
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
});

// Add CSS for new JS elements
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Particle animation */
    .particle {
        position: absolute;
        background-color: rgba(154, 77, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        animation: float linear infinite;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.5;
        }
        100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
        }
    }
    
    /* Level notification */
    .level-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #7b2ff7;
        color: white;
        padding: 1rem;
        border-radius: 10px;
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        box-shadow: 0 0 15px rgba(123, 47, 247, 0.7);
    }
    
    .level-notification.show {
        transform: translateX(0);
    }
    
    /* Magic effect */
    .magic-effect {
        position: absolute;
        border-radius: 5px;
        pointer-events: none;
        z-index: 999;
        background: radial-gradient(circle, rgba(154, 77, 255, 0.5) 0%, rgba(154, 77, 255, 0) 70%);
        animation: magic-pulse 1s ease-out;
    }
    
    @keyframes magic-pulse {
        0% {
            transform: scale(0.95);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.3;
        }
        100% {
            transform: scale(1.2);
            opacity: 0;
        }
    }
    
    /* Button pulse animation */
    .pulse {
        animation: button-pulse 1s;
    }
    
    @keyframes button-pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    /* Chat interface */
    .chat-interface {
        display: flex;
        flex-direction: column;
        height: 300px;
        background-color: #222;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .chat-messages {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
    
    .message {
        max-width: 80%;
        padding: 0.8rem 1rem;
        margin-bottom: 0.8rem;
        border-radius: 10px;
    }
    
    .message.user {
        align-self: flex-end;
        background-color: #7b2ff7;
        color: white;
        border-radius: 10px 10px 0 10px;
    }
    
    .message.bot {
        align-self: flex-start;
        background-color: #333;
        color: #ddd;
        border-radius: 10px 10px 10px 0;
    }
    
    .chat-input {
        display: flex;
        padding: 0.8rem;
        background-color: #1a1a1a;
    }
    
    .chat-input input {
        flex: 1;
        padding: 0.8rem;
        border: none;
        background-color: #333;
        color: #ddd;
        border-radius: 5px 0 0 5px;
    }
    
    .chat-input button {
        padding: 0.8rem 1.2rem;
        background-color: #7b2ff7;
        color: white;
        border: none;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
    }
    
    /* Heatmap */
    .heatmap-demo {
        margin-top: 1.5rem;
    }
    
    .heatmap-demo h4 {
        margin-bottom: 1rem;
        color: #d8b4fe;
    }
    
    .heatmap-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(7, 1fr);
        gap: 4px;
        margin-bottom: 1rem;
    }
    
    .heatmap-cell {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 2px;
    }
    
    .intensity-0 {
        background-color: #1a1a1a;
    }
    
    .intensity-1 {
        background-color: #4b2b7f;
    }
    
    .intensity-2 {
        background-color: #5d3a9e;
    }
    
    .intensity-3 {
        background-color: #7b2ff7;
    }
    
    .intensity-4 {
        background-color: #9a4dff;
    }
    
    .heatmap-legend {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        font-size: 0.8rem;
        color: #aaa;
    }
    
    .legend-color {
        width: 12px;
        height: 12px;
        margin-right: 5px;
        border-radius: 2px;
    }
    
    /* Projects demo */
    .projects-demo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .project-card {
        background-color: #222;
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .project-card h4 {
        color: #d8b4fe;
        margin-bottom: 1rem;
    }
    
    .project-progress {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .project-progress .progress-bar {
        flex: 1;
    }
    
    .project-details {
        display: flex;
        justify-content: space-between;
        color: #aaa;
        font-size: 0.9rem;
    }
    
    .days-left {
        color: #9a4dff;
    }
</style>
`);
