document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const masukLink = document.querySelector('.header-dir a[href*="sign-in.html"]');
    const buatAkunLink = document.querySelector('.header-dir a[href*="sign.html"]');

    if (isLoggedIn === 'true' && userName) {
        userNameDisplay.textContent = userName;
        userNameDisplay.style.display = 'block';
        userNameDisplay.style.fontWeight = 'bold';
        userNameDisplay.style.marginLeft = '16px';
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
        dropdown.style.fontSize = '1rem';
        dropdown.style.textAlign = 'center';

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