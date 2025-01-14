document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const profileForm = document.getElementById('profileForm');
    const chatForm = document.getElementById('chatForm');
    const welcomeMessageContainer = document.getElementById('welcomeMessageContainer');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const authContainer = document.getElementById('authContainer');
    const mainContainer = document.getElementById('mainContainer');
    const profileSection = document.getElementById('perfil');
    const chatSection = document.getElementById('chat');
    const profileIcon = document.querySelector('.profile-icon');
    const profileIconImage = document.getElementById('profileIconImage');
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const searchInput = document.getElementById('searchInput');
    const suggestionsList = document.getElementById('suggestionsList');
    const DAYS_LIMIT = 14;

    const usersAndServices = [
        { name: "Juan Pérez", service: "Desarrollo Web" },
        { name: "Ana Gómez", service: "Diseño Gráfico" },
        { name: "Luis Rodríguez", service: "Marketing Digital" },
        { name: "Maria Fernández", service: "Redacción de Contenidos" },
        { name: "Carlos López", service: "Traducción" }
        // Añade más usuarios y servicios aquí
    ];

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

    function validatePhoneNumber(phone) {
        return phone.startsWith('+53');
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

        if (!validatePhoneNumber(phone)) {
            alert('Error: El número de teléfono debe comenzar con +53');
            return;
        }

        localStorage.setItem('userName', name);
        localStorage.setItem('userLastName', lastName);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userPassword', password);

        showWelcomeMessage('Bienvenido a CubaFreelance');
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = e.target.loginEmail.value;
        const password = e.target.loginPassword.value;
        const storedEmail = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');

        if (email === storedEmail && password === storedPassword) {
            showWelcomeMessage('Bienvenido de nuevo');
        } else {
            alert('Email o contraseña incorrectos.');
        }
    });

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const profileImage = e.target.profileImage.files[0];
        const profileName = e.target.profileName.value;
        const profilePresentation = e.target.profilePresentation.value;
        const profileDescription = e.target.profileDescription.value;
        const profileCategory = e.target.profileCategory.value;
        const profileLink1 = e.target.profileLink1.value;
        const profileLink2 = e.target.profileLink2.value;
        const profileLink3 = e.target.profileLink3.value;

        if (profileImage) {
            const reader = new FileReader();
            reader.onload = function(event) {
                localStorage.setItem('profileImage', event.target.result);
                profileImageDisplay.src = event.target.result;
                profileIconImage.src = event.target.result;
            };
            reader.readAsDataURL(profileImage);
        }

        localStorage.setItem('profileName', profileName);
        localStorage.setItem('profilePresentation', profilePresentation);
        localStorage.setItem('profileDescription', profileDescription);
        localStorage.setItem('profileCategory', profileCategory);
        localStorage.setItem('profileLink1', profileLink1);
        localStorage.setItem('profileLink2', profileLink2);
        localStorage.setItem('profileLink3', profileLink3);

        alert('Perfil actualizado exitosamente!');
        showSection(document.getElementById('inicio'));
    });

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatInput.value;
        if (message.trim() !== "") {
            const chatMessage = document.createElement('p');
            chatMessage.textContent = message;
            chatMessages.appendChild(chatMessage);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        }
    });

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        suggestionsList.innerHTML = '';
        if (query) {
            const suggestions = usersAndServices.filter(userOrService => 
                userOrService.name.toLowerCase().includes(query) || 
                userOrService.service.toLowerCase().includes(query)
            );
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = `${suggestion.name} - ${suggestion.service}`;
                li.addEventListener('click', () => {
                    searchInput.value = li.textContent;
                    suggestionsList.innerHTML = '';
                    // Aquí puedes añadir funcionalidad adicional, como redirigir al usuario a un perfil específico
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    function openProfileEditor() {
        showSection(profileSection);
        document.getElementById('profileName').value = localStorage.getItem('profileName') || '';
        document.getElementById('profilePresentation').value = localStorage.getItem('profilePresentation') || '';
        document.getElementById('profileDescription').value = localStorage.getItem('profileDescription') || '';
        document.getElementById('profileCategory').value = localStorage.getItem('profileCategory') || '';
        document.getElementById('profileLink1').value = localStorage.getItem('profileLink1') || '';
        document.getElementById('profileLink2').value = localStorage.getItem('profileLink2') || '';
        document.getElementById('profileLink3').value = localStorage.getItem('profileLink3') || '';
        const storedProfileImage = localStorage.getItem('profileImage');
        if (storedProfileImage) {
            profileImageDisplay.src = storedProfileImage;
            profileImageDisplay.style.display = 'block';
            profileIconImage.src = storedProfileImage;
        } else {
            profileImageDisplay.style.display = 'none';
            profileIconImage.src = 'default-icon.png';
        }
    }

    profileIcon.addEventListener('click', openProfileEditor);

    function initializePage() {
        if (daysSinceLastVisit() > DAYS_LIMIT) {
            authContainer.style.display = 'block';
            mainContainer.style.display = 'none';
            showSection(document.getElementById('login'));
        } else if (localStorage.getItem('userEmail')) {
            authContainer.style.display = 'none';
            mainContainer.style.display = 'block';
        } else {
            showSection(document.getElementById('registro'));
        }

        const storedProfileImage = localStorage.getItem('profileImage');
        if (storedProfileImage) {
            profileIconImage.src = storedProfileImage;
        } else {
            profileIconImage.src = 'default-icon.png';
        }
    }

    function showLogin() {
        showSection(document.getElementById('login'));
    }

    window.showLogin = showLogin;

    initializePage();
});
