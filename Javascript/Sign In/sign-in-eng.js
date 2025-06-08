document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const eyeOn = toggleBtn.querySelector('.eye-on');
    const eyeOff = toggleBtn.querySelector('.eye-off');

    // Initial state
    eyeOn.classList.add('active');
    eyeOff.classList.remove('active');

    toggleBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeOn.classList.remove('active');
            eyeOff.classList.add('active');
        } else {
            passwordInput.type = 'password';
            eyeOn.classList.add('active');
            eyeOff.classList.remove('active');
        }
    });

    const form = document.querySelector('.signup-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const storedEmail = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');

        if (email === storedEmail && password === storedPassword) {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = '/HTML/Home Page/index-eng.html';
        } else {
            const passwordError = document.getElementById('passwordError');
            passwordError.textContent = 'Invalid email or password!';
            passwordError.style.display = 'block';
        }
    });
});