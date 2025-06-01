// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Authentication Pages
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    const app = document.getElementById('app');
    
    // Navigation Elements
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');
    const navHome = document.getElementById('nav-home');
    const navPrevious = document.getElementById('nav-previous');
    const navAbout = document.getElementById('nav-about');
    const navLogout = document.getElementById('nav-logout');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // App Pages
    const homePage = document.getElementById('home-page');
    const previousPage = document.getElementById('previous-page');
    const aboutPage = document.getElementById('about-page');
    
    // Upload Elements
    const imageUpload = document.getElementById('image-upload');
    const uploadImgBtn = document.getElementById('upload-img-btn');
    
    // Preview Elements
    const originalPreview = document.getElementById('original-preview');
    const enhancedPreview = document.getElementById('enhanced-preview');
    
    // Control Buttons
    const enhanceBtn = document.getElementById('enhance-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    // Fullscreen Modal Elements
    const fullscreenModal = document.getElementById('fullscreen-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const fullscreenOriginal = document.getElementById('fullscreen-original').querySelector('.content');
    const fullscreenEnhanced = document.getElementById('fullscreen-enhanced').querySelector('.content');
    
    // Mobile Navigation Elements
    const hamburger = document.querySelector('.hamburger');
    const closeMenu = document.querySelector('.close-menu');
    const navLinks = document.querySelector('.nav-links');
    
    // User state
    let currentUser = null;
    let isLoggedIn = false;
    
    // Media state
    let originalMedia = null;
    let enhancedMedia = null;
    
    // Initialize the app
    init();
    
    function init() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
            showApp();
        } else {
            showLoginPage();
        }
        
        // Check dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Load previous data if user is logged in
        if (isLoggedIn) {
            loadPreviousData();
        }
    }
    
    function setupEventListeners() {
        // Auth navigation
        goToSignup.addEventListener('click', showSignupPage);
        goToLogin.addEventListener('click', showLoginPage);
        
        // Auth forms
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('signup-form').addEventListener('submit', handleSignup);
        
        // App navigation
        navHome.addEventListener('click', () => showPage(homePage));
        navPrevious.addEventListener('click', () => {
            showPage(previousPage);
            loadPreviousData();
        });
        navAbout.addEventListener('click', () => showPage(aboutPage));
        navLogout.addEventListener('click', handleLogout);
        
        // Dark mode toggle
        darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // Mobile menu
        hamburger.addEventListener('click', toggleMobileMenu);
        closeMenu.addEventListener('click', toggleMobileMenu);
        
        // Upload button
        uploadImgBtn.addEventListener('click', () => imageUpload.click());
        
        // File upload
        imageUpload.addEventListener('change', handleImageUpload);
        
        // Enhancement controls
        enhanceBtn.addEventListener('click', enhanceMedia);
        fullscreenBtn.addEventListener('click', openFullscreenModal);
        downloadBtn.addEventListener('click', downloadMedia);
        
        // Fullscreen modal
        closeModal.addEventListener('click', closeFullscreenModal);
        modalCloseBtn.addEventListener('click', closeFullscreenModal);
        modalSaveBtn.addEventListener('click', downloadMedia);
        
        // Filter buttons in previous data
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', filterPreviousData);
        });
    }
    
    // Authentication Functions
    function showLoginPage() {
        loginPage.classList.remove('hidden');
        signupPage.classList.add('hidden');
        app.classList.add('hidden');
    }
    
    function showSignupPage() {
        signupPage.classList.remove('hidden');
        loginPage.classList.add('hidden');
        app.classList.add('hidden');
    }
    
    function showApp() {
        app.classList.remove('hidden');
        loginPage.classList.add('hidden');
        signupPage.classList.add('hidden');
        showPage(homePage);
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        currentUser = {
            email: email,
            name: email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        isLoggedIn = true;
        showApp();
    }
    
    function handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        currentUser = {
            name: name,
            email: email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        isLoggedIn = true;
        showApp();
    }
    
    function handleLogout() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        isLoggedIn = false;
        showLoginPage();
    }
    
    // Navigation Functions
    function showPage(page) {
        // Hide all pages
        homePage.classList.add('hidden');
        previousPage.classList.add('hidden');
        aboutPage.classList.add('hidden');
        
        // Show the requested page
        page.classList.remove('hidden');
        
        // Close mobile menu if open
        navLinks.classList.remove('active');
    }
    
    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('hidden');
        closeMenu.classList.toggle('hidden');
    }
    
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = '☀️';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeToggle.textContent = '🌙';
            localStorage.setItem('darkMode', 'disabled');
        }
    }
    
    // Image Upload Function
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                displayOriginalMedia(img);
                originalMedia = img;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // Display Functions
    function displayOriginalMedia(media) {
        originalPreview.innerHTML = '';
        originalPreview.appendChild(media.cloneNode(true));
        
        // Clear enhanced preview
        enhancedPreview.innerHTML = '<p>Enhanced Media</p>';
        enhancedMedia = null;
    }
    
    function displayEnhancedMedia(media) {
        enhancedPreview.innerHTML = '';
        enhancedPreview.appendChild(media);
        enhancedMedia = media;
        
        // Enable controls
        fullscreenBtn.disabled = false;
        downloadBtn.disabled = false;
    }
    
    // Enhancement Function
    async function enhanceMedia() {
        if (!originalMedia) {
            alert('No image to enhance!');
            return;
        }

        // Show loading state
        enhanceBtn.disabled = true;
        enhanceBtn.textContent = 'Processing...';
        enhancedPreview.innerHTML = '<div class="loading-spinner"></div>';

        try {
            // Convert image to blob for upload
            const canvas = document.createElement('canvas');
            canvas.width = originalMedia.width;
            canvas.height = originalMedia.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(originalMedia, 0, 0);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            
            const formData = new FormData();
            formData.append('media', blob, 'input.png');

            const response = await fetch('/enhance', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Enhancement failed!');
            }

            const data = await response.json();

            // Update the UI with both original and enhanced images
            const originalImg = new Image();
            originalImg.src = data.original;
            
            const enhancedImg = new Image();
            enhancedImg.onload = () => {
                displayEnhancedMedia(enhancedImg);
                saveToHistory(originalImg.src, enhancedImg.src);
            };
            enhancedImg.src = data.enhanced;

        } catch (error) {
            console.error('Enhancement error:', error);
            enhancedPreview.innerHTML = '<p class="error-message">Enhancement failed</p>';
            alert(error.message || 'Failed to enhance image. Please try again.');
        } finally {
            // Reset button state
            enhanceBtn.disabled = false;
            enhanceBtn.textContent = 'Enhance';
        }
    }
    
    // History Functions
    function saveToHistory(originalUrl, enhancedUrl) {
        if (!originalUrl || !enhancedUrl) return;
        
        const timestamp = new Date().toISOString();
        const historyItem = {
            id: `history-${Date.now()}`,
            type: 'image',
            date: timestamp,
            original: originalUrl,
            enhanced: enhancedUrl
        };
        
        let history = JSON.parse(localStorage.getItem(`${currentUser.email}_history`) || '[]');
        history.unshift(historyItem);
        
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        
        localStorage.setItem(`${currentUser.email}_history`, JSON.stringify(history));
    }
    
    function loadPreviousData() {
        const history = JSON.parse(localStorage.getItem(`${currentUser.email}_history`) || '[]');
        const dataGrid = document.getElementById('previous-data-grid');
        dataGrid.innerHTML = '';
        
        if (history.length === 0) {
            dataGrid.innerHTML = '<p class="no-data">No previous enhancements found.</p>';
            return;
        }
        
        history.forEach(item => {
            const card = createHistoryCard(item);
            dataGrid.appendChild(card);
        });
    }
    
    function createHistoryCard(item) {
        const card = document.createElement('div');
        card.className = `data-card ${item.type}`;
        card.dataset.id = item.id;
        
        const date = new Date(item.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        card.innerHTML = `
            <h3>${formattedDate}</h3>
            <div class="card-content">
                <img src="${item.original}" alt="Original" class="thumbnail">
                <img src="${item.enhanced}" alt="Enhanced" class="thumbnail">
            </div>
            <div class="card-actions">
                <button class="btn view-btn">View</button>
                <button class="btn delete-btn">Delete</button>
            </div>
        `;
        
        card.querySelector('.view-btn').addEventListener('click', () => viewHistoryItem(item));
        card.querySelector('.delete-btn').addEventListener('click', () => deleteHistoryItem(item.id));
        
        return card;
    }
    
    function viewHistoryItem(item) {
        const origImg = new Image();
        origImg.src = item.original;
        
        const enhImg = new Image();
        enhImg.src = item.enhanced;
        
        originalMedia = origImg;
        enhancedMedia = enhImg;
        
        showPage(homePage);
        displayOriginalMedia(origImg);
        displayEnhancedMedia(enhImg);
    }
    
    function deleteHistoryItem(id) {
        let history = JSON.parse(localStorage.getItem(`${currentUser.email}_history`) || '[]');
        history = history.filter(item => item.id !== id);
        localStorage.setItem(`${currentUser.email}_history`, JSON.stringify(history));
        loadPreviousData();
    }
    
    function filterPreviousData(e) {
        const filter = e.target.dataset.filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        const cards = document.querySelectorAll('.data-card');
        cards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Modal Functions
    function openFullscreenModal() {
        if (!originalMedia || !enhancedMedia) {
            alert('Please enhance an image first.');
            return;
        }
        
        fullscreenOriginal.innerHTML = '';
        fullscreenEnhanced.innerHTML = '';
        
        fullscreenOriginal.appendChild(originalMedia.cloneNode(true));
        fullscreenEnhanced.appendChild(enhancedMedia.cloneNode(true));
        
        fullscreenModal.classList.remove('hidden');
    }
    
    function closeFullscreenModal() {
        fullscreenModal.classList.add('hidden');
    }
    
    // Download Function
    function downloadMedia() {
        if (!enhancedMedia) {
            alert('Please enhance an image first.');
            return;
        }
        
        const link = document.createElement('a');
        link.href = enhancedMedia.src;
        link.download = `enhanced_image_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});