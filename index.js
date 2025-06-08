document.addEventListener('DOMContentLoaded', function() {
    const daftarQrisBtn = document.getElementById('daftarQrisBtn');
    if (daftarQrisBtn) {
        daftarQrisBtn.addEventListener('click', function(e) {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                e.preventDefault();
                window.location.href = '/HTML/registration/regis.html';
            } else {
                e.preventDefault();
                window.location.href = '/HTML/Sign In Page/sign-in.html';
            }
        });
    }

    const btn = document.getElementById('prosesRegistrasiBtn');

    if (btn) {
        btn.addEventListener('click', function(e) {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn !== 'true') {
                e.preventDefault();
                window.location.href = '/HTML/Sign In Page/sign-in.html';
                return;
            }
            const userEmail = localStorage.getItem('userEmail');
            const businessname = userEmail ? localStorage.getItem(`progressCompany_${userEmail}`) : null;
            if (businessname && businessname.trim() !== '') {
                e.preventDefault();
                window.location.href = '/HTML/progress-track/progress.html';
            } else {
                e.preventDefault();
                window.location.href = '/HTML/registration/regis.html';
            }
        });
    }
    
    const userName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const masukLink = document.querySelector('.header-dir a[href*="sign-in.html"]');
    const buatAkunLink = document.querySelector('.header-dir a[href*="sign.html"]');

    if (isLoggedIn === 'true' && userName) {
        userNameDisplay.textContent = userName;
        userNameDisplay.style.display = 'block';
        if (masukLink) masukLink.style.display = 'none';
        if (buatAkunLink) buatAkunLink.style.display = 'none';
    } else {
        userNameDisplay.style.display = 'none';
        if (masukLink) masukLink.style.display = '';
        if (buatAkunLink) buatAkunLink.style.display = '';
    }

    // Dropdown for logout
    userNameDisplay.style.position = 'relative';
    userNameDisplay.style.cursor = 'pointer';

    let dropdown = null;

    userNameDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        // Remove existing dropdown if any
        if (dropdown) {
            dropdown.remove();
            dropdown = null;
            return;
        }
        dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-item" id="logoutBtn">Log Out</div>
        `;
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.right = '0';
        dropdown.style.background = '#fff';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.borderRadius = '8px';
        dropdown.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        dropdown.style.padding = '8px 0';
        dropdown.style.minWidth = '120px';
        dropdown.style.zIndex = '999';

        userNameDisplay.appendChild(dropdown);

        // Log out action
        document.getElementById('logoutBtn').onclick = function() {
            localStorage.removeItem('isLoggedIn');
            window.location.reload();
        };

        // Close dropdown when clicking outside
        document.addEventListener('click', function handler() {
            if (dropdown) {
                dropdown.remove();
                dropdown = null;
            }
            document.removeEventListener('click', handler);
        });
    });
});
