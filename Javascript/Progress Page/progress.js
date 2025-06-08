document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    let companyName = 'Nama Toko Anda';
    let regDate = null;
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
        // Get company name and registration date for this user
        companyName = localStorage.getItem(`progressCompany_${userEmail}`);
        regDate = localStorage.getItem(`progressDate_${userEmail}`);
    }

    // Set company name in the DOM
    const companyNameElem = document.querySelector('.user-details h3');
    if (companyNameElem) {
        companyNameElem.textContent = companyName;
    }

    // Set registration date in the DOM
    const regDateElem = document.querySelector('.user-details p');
    if (regDateElem && regDate) {
        const dateObj = new Date(regDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('id-ID', options);
        regDateElem.textContent = `ID Pendaftaran: #QRS-2025-001234 | Tanggal Daftar: ${formattedDate}`;
    }

    // Countdown logic (4 days from regDate)
    if (regDate) {
        const countdownTarget = new Date(regDate);
        countdownTarget.setDate(countdownTarget.getDate() + 4);

        function updateCountdown() {
            const now = new Date();
            let diff = countdownTarget - now;
            if (diff < 0) diff = 0;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;

            // Optionally update target date in the DOM
            const targetDateElem = document.querySelector('.estimated-completion strong');
            if (targetDateElem) {
                const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
                targetDateElem.textContent = countdownTarget.toLocaleDateString('id-ID', options);
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    if (regDate) {
        function formatDate(date, withTime = false) {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            let str = date.toLocaleDateString('id-ID', options);
            if (withTime) {
                str += ', ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            }
            return str;
        }

        document.querySelectorAll('.dynamic-date').forEach(el => {
            const offset = parseFloat(el.getAttribute('data-offset')) || 0;
            // Use regDate if available, otherwise today
            const baseDate = regDate ? new Date(regDate) : new Date();
            if (offset < 1 && offset > 0) {
                baseDate.setMinutes(baseDate.getMinutes() + Math.round(offset * 24 * 60));
            } else {
                baseDate.setDate(baseDate.getDate() + offset);
            }
            const withTime = el.dataset.withTime === "true"; // Use a data attribute for clarity
            el.textContent = (el.classList.contains('status-time') ? 
                (withTime ? 'Selesai: ' : '') : '') +
                formatDate(baseDate, withTime) +
                (el.classList.contains('timeline-date') ? ' WIB' : '');
        });
    }

    
    if (isLoggedIn === 'true' && userName && userNameDisplay) {
        userNameDisplay.textContent = userName;
        userNameDisplay.style.display = 'block';
        userNameDisplay.style.fontWeight = 'bold';
        userNameDisplay.style.marginLeft = '16px';
    } else if(userNameDisplay) {
        userNameDisplay.style.display = 'none';
    }

    function updateCountdown() {
        const targetDate = new Date('2025-06-08T17:00:00').getTime();
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('countdown').innerHTML = `
                <div style="background: var(--success); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>QRIS Anda Sudah Aktif!</h3>
                    <p>Silakan cek email untuk informasi lebih lanjut</p>
                </div>
            `;
        }
    }

    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Status card animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe status cards
    document.querySelectorAll('.status-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Auto-refresh page data every 5 minutes
    setInterval(() => {
        console.log('Checking for status updates...');
        // In a real application, this would make an API call to check for updates
        showNotification('Status checked - no updates', 'info');
    }, 300000); // 5 minutes

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--success)' : 'var(--info)';
        const icon = type === 'error' ? 'fas fa-exclamation-circle' : type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
        
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideInRight 0.4s ease-out;
            max-width: 350px;
            font-weight: 500;
            font-size: 0.9rem;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease-out forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }

    // Simulate random status updates (for demo purposes)
    setTimeout(() => {
        showNotification('Dokumen KTP telah diverifikasi ✓', 'success');
    }, 10000);

    setTimeout(() => {
        showNotification('Tim verifikasi sedang meninjau SIUP Anda', 'info');
    }, 25000);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            header.style.transform = 'translateY(-100%)';
            header.style.transition = 'transform 0.3s ease';
        } else {
            header.style.transform = 'translateY(0)';
            header.style.transition = 'transform 0.3s ease';
        }
        
        lastScrollTop = scrollTop;
    });
});