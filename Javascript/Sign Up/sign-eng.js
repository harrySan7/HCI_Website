document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.signup-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        let isValid = true;

        // Get values
        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();
        const telepon = document.getElementById('telepon').value.trim();
        const password = document.getElementById('password').value;
        const konfirmasi = document.getElementById('konfirmasi').value;

        // Get error spans
        const namaError = document.getElementById('namaError');
        const emailError = document.getElementById('emailError');
        const teleponError = document.getElementById('teleponError');
        const passwordError = document.getElementById('passwordError');
        const konfirmasiError = document.getElementById('konfirmasiError');

        // Reset errors
        [namaError, emailError, teleponError, passwordError, konfirmasiError].forEach(span => {
            span.textContent = '';
            span.style.display = 'none';
        });

        // Name validation: only letters and spaces
        if (!/^[a-zA-Z\s]+$/.test(nama)) {
            namaError.textContent = 'Name can only contain letters and spaces.';
            namaError.style.display = 'block';
            isValid = false;
        }

        // Email validation: basic check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = 'Invalid email address.';
            emailError.style.display = 'block';
            isValid = false;
        }

        // Telepon validation: only numbers, at least 8 digits
        if (!/^\d{8,}$/.test(telepon)) {
            teleponError.textContent = 'Phone number must be at least 8 digits.';
            teleponError.style.display = 'block';
            isValid = false;
        }

        // Password validation: at least 6 characters
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters.';
            passwordError.style.display = 'block';
            isValid = false;
        }

        // Confirm password: must match password
        if (password !== konfirmasi) {
            konfirmasiError.textContent = 'Confirm password does not match.';
            konfirmasiError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // Save to localStorage
            localStorage.setItem('userName', nama);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPassword', password);
            localStorage.setItem('isLoggedIn', 'true');
            e.preventDefault();
            window.location.href = '/HTML/Home Page/index-eng.html';
        } else {
            e.preventDefault();
        }
    });
});