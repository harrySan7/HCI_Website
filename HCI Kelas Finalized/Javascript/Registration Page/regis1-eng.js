// QRIS Registration Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qrisRegistration');
    const submitBtn = form.querySelector('.submit-button');
    const businessNameInput = document.getElementById('businessName');
    const charCountSpan = document.getElementById('charCount');
    const phoneInput = document.getElementById('phone');
    const userName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (isLoggedIn === 'true' && userName && userNameDisplay) {
        userNameDisplay.textContent = userName;
        userNameDisplay.style.display = 'block';
        userNameDisplay.style.fontWeight = 'bold';
        userNameDisplay.style.marginLeft = '16px';
    } else if(userNameDisplay) {
        userNameDisplay.style.display = 'none';
    }

    // Character counter for business name
    businessNameInput.addEventListener('input', function() {
        const currentLength = this.value.length;
        const maxLength = 25;
        charCountSpan.textContent = currentLength;
        
        const counter = document.querySelector('.character-counter');
        if (currentLength >= 20) {
            counter.classList.add('warning');
            counter.classList.remove('error');
        } else if (currentLength >= maxLength) {
            counter.classList.add('error');
            counter.classList.remove('warning');
        } else {
            counter.classList.remove('warning', 'error');
        }
    });

    // Phone number validation (only numbers)
    phoneInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Real-time form validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField.call(this);
            }
        });
    });

    function validateField() {
        const errorMsg = this.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }

        let isValid = true;
        let message = '';

        if (!this.value.trim()) {
            isValid = false;
            message = 'This field is required';
        } else if (this.type === 'email' && !isValidEmail(this.value)) {
            isValid = false;
            message = 'Invalid email format';
        } else if (this.id === 'phone' && this.value.length < 9) {
            isValid = false;
            message = 'Phone number must be at least 9 digits';
        }

        if (isValid) {
            this.classList.remove('error');
        } else {
            this.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            this.parentNode.appendChild(errorDiv);
        }

        return isValid;
    }

    // Checkbox interaction
    const checkboxItems = document.querySelectorAll('.checkbox-item');
    checkboxItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox' && e.target.tagName !== 'A') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField.call(input)) {
                isFormValid = false;
            }
        });

        // Check checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
        checkboxes.forEach(checkbox => {
            const checkboxItem = checkbox.closest('.checkbox-item');
            if (!checkbox.checked) {
                isFormValid = false;
                checkboxItem.style.borderColor = 'var(--error)';
                checkboxItem.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
            } else {
                checkboxItem.style.borderColor = 'var(--gray-200)';
                checkboxItem.style.backgroundColor = 'var(--white)';
            }
        });

        if (isFormValid) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>PROCESSING...';
            
            const businessName = document.getElementById('businessName').value.trim();
            const userEmail = localStorage.getItem('userEmail');
            localStorage.setItem('businessName', businessName);
            if (userEmail) {
                localStorage.setItem(`progressCompany_${userEmail}`, businessName);
                const now = new Date();
                localStorage.setItem(`progressDate_${userEmail}`, now.toISOString());
            }
            

            // Simulate API call
            setTimeout(() => {
                showSuccessMessage();
            }, 2500);
        } else {
            // Show error notification
            showNotification('Please complete all required fields correctly!', 'error');

            // Scroll to first error
            const firstError = form.querySelector('.error, input:invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    function showSuccessMessage() {
        const formContainer = document.querySelector('.form-container');
        formContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 2rem; background-color: rgba(255, 255, 255, 0.95); border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="success-checkmark__check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <h2 style="color: var(--success); font-size: 2.5rem; margin: 1.5rem 0 1rem; font-weight: 700;">Registration Successful!</h2>
                <p style="color: var(--text-color); font-size: 1.3rem; margin-bottom: 2rem; line-height: 1.6;">
                    Thank you for registering for QRIS InterActive. Our team will contact you via WhatsApp within <strong>1x24 hours</strong> for the verification and activation process.
                </p>
                
                <div style="background: var(--gray-100); padding: 2rem; border-radius: 16px; margin: 2rem 0; border: 2px solid var(--primary-color);">
                    <h3 style="color: var(--primary-color); margin-bottom: 1.5rem; font-size: 1.4rem; font-weight: 600;">Next Steps:</h3>
                    <div style="text-align: left; display: grid; gap: 1rem;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-check" style="color: white; font-size: 0.9rem;"></i>
                            </div>
                            <span style="font-size: 1.1rem; color: var(--text-color);">Document verification via WhatsApp</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-user-check" style="color: white; font-size: 0.9rem;"></i>
                            </div>
                            <span style="font-size: 1.1rem; color: var(--text-color);">QRIS account activation</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-qrcode" style="color: white; font-size: 0.9rem;"></i>
                            </div>
                            <span style="font-size: 1.1rem; color: var(--text-color);">QR Code installation at your store</span>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(144, 31, 31, 0.05); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border-left: 4px solid var(--primary-color);">
                    <p style="color: var(--text-color); font-size: 1rem; margin: 0; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-info-circle" style="color: var(--primary-color);"></i>
                        <strong>Pending:</strong> Please ensure your WhatsApp number is active to receive confirmation from our team.
                    </p>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
                    <button onclick="location.href='/HTML/document-upload/doc-eng.html'" style="background: var(--primary-color); color: white; border: none; padding: 1rem 2rem; border-radius: 30px; font-weight: 600; cursor: pointer; font-size: 1.1rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-home"></i>
                        Upload Document
                    </button>
                    <button onclick="window.print()" style="background: var(--light-color); color: var(--primary-color); border: 2px solid var(--primary-color); padding: 1rem 2rem; border-radius: 30px; font-weight: 600; cursor: pointer; font-size: 1.1rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-print"></i>
                        Print Registration
                    </button>
                </div>
            </div>
        `;
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--success)' : 'var(--primary-color)';
        const icon = type === 'error' ? 'fas fa-exclamation-circle' : type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
        
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${bgColor};
            color: white;
            padding: 1.2rem 1.8rem;
            border-radius: 12px;
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideInRight 0.4s ease-out;
            max-width: 400px;
            font-weight: 500;
            font-size: 1rem;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
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
        }, 4000);
    }

    // Smooth scrolling for form focus
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

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

    // Add smooth entrance animations
    const animatedElements = document.querySelectorAll('.form-group, .checkbox-item, .submit-button');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);