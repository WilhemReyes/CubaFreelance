document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const mainContainer = document.getElementById('mainContainer');
    const authContainer = document.getElementById('authContainer');
    const welcomeMessageContainer = document.getElementById('welcomeMessageContainer');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const DAYS_LIMIT = 14;

    function showSection(section) {
        document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
        section.style.display = 'block';
    }

    function showWelcomeMessage(message) {
        welcomeMessage.innerText = message;
        welcomeMessageContainer.style.display = 'flex';
        setTimeout(() => {
            welcomeMessageContainer.style.display = 'none';
            authContainer.style.display = 'none';
            mainContainer.style.display = 'block';
            updateLastVisit();
        }, 2000);
    }

    function updateLastVisit() {
        const now = new Date().getTime();
        localStorage.setItem('lastVisit', now);
    }

    function daysSinceLastVisit() {
        const lastVisit = localStorage.getItem('lastVisit');
        if (!lastVisit) return DAYS_LIMIT + 1; // force login if no record exists
        const now = new Date().getTime();
        const diff = now - lastVisit;
        return diff / (1000 * 60 * 60 * 24); // convert milliseconds to days
    }

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = e.target.registerName.value;
        const lastName = e.target.registerLastName.value;
        const email = e.target.registerEmail.value;
        const phone = e.target.registerPhone.value;
        const password = e.target.registerPassword.value;

        localStorage.setItem('userName', name);
        localStorage.setItem('userLastName', lastName);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userPassword', password);
        localStorage.setItem('userLoggedIn', 'true');

        showWelcomeMessage('Bienvenido a CubaFreelance');
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = e.target.loginEmail.value;
        const password = e.target.loginPassword.value;
        const storedEmail = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');

        if (email === storedEmail && password === storedPassword) {
            localStorage.setItem('userLoggedIn', 'true');
            showWelcomeMessage('Bienvenido de nuevo');
        } else {
            alert('Email o contraseña incorrectos.');
        }
    });

    function initializePage() {
        if (localStorage.getItem('userLoggedIn') && daysSinceLastVisit() <= DAYS_LIMIT) {
            authContainer.style.display = 'none';
            mainContainer.style.display = 'block';
        } else {
            authContainer.style.display = 'block';
            mainContainer.style.display = 'none';
            showSection(document.getElementById('login'));
        }
    }

    initializePage();
});
