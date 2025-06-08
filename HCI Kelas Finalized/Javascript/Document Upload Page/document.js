document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('documentUpload');
    const submitBtn = document.getElementById('submitBtn');
    const uploadAreas = document.querySelectorAll('.upload-area');
    const fileInputs = document.querySelectorAll('.file-input');
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
    
    let uploadedFiles = {
        ktp: [],
        business: [],
        bank: [],
        store: []
    };

    // Setup drag and drop for upload areas
    uploadAreas.forEach(area => {
        const input = area.querySelector('.file-input');
        
        area.addEventListener('click', () => input.click());
        
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });
        
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files, input.dataset.type);
        });
    });

    // Handle file input changes
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleFiles(files, input.dataset.type);
        });
    });

    function handleFiles(files, type) {
        files.forEach(file => {
            if (validateFile(file, type)) {
                addFileToList(file, type);
                simulateUpload(file, type);
            }
        });
        checkSubmitButton();
    }

    function validateFile(file, type) {
        const maxSize = type === 'bank' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for bank, 5MB for others
        const allowedTypes = type === 'store' 
            ? ['image/jpeg', 'image/jpg', 'image/png']
            : ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (file.size > maxSize) {
            showNotification(`File ${file.name} terlalu besar. Maksimal ${type === 'bank' ? '10MB' : '5MB'}.`, 'error');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            showNotification(`Format file ${file.name} tidak didukung.`, 'error');
            return false;
        }

        return true;
    }

    function addFileToList(file, type) {
        const container = document.getElementById(`${type}-files`);
        const fileId = Date.now() + Math.random();
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileId = fileId;
        
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas ${getFileIcon(file.type)}"></i>
                <div class="file-details">
                    <h5>${file.name}</h5>
                    <span>${formatFileSize(file.size)}</span>
                </div>
            </div>
            <div class="file-actions">
                <button type="button" class="btn-small btn-view" onclick="viewFile('${fileId}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button type="button" class="btn-small btn-remove" onclick="removeFile('${fileId}', '${type}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;
        
        container.appendChild(fileItem);
        uploadedFiles[type].push({ id: fileId, file: file, element: fileItem });
    }

    function simulateUpload(file, type) {
        const fileId = uploadedFiles[type][uploadedFiles[type].length - 1].id;
        const progressBar = document.querySelector(`[data-file-id="${fileId}"] .progress-fill`);
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    progressBar.parentElement.style.display = 'none';
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 100);
    }

    function getFileIcon(type) {
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('image')) return 'fa-file-image';
        return 'fa-file';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Fixed viewFile function - now actually creates a preview
    window.viewFile = function(fileId) {
        // Find the file in uploadedFiles
        let foundFile = null;
        let fileType = null;
        
        for (const [type, files] of Object.entries(uploadedFiles)) {
            const file = files.find(f => f.id == fileId);
            if (file) {
                foundFile = file.file;
                fileType = type;
                break;
            }
        }
        
        if (!foundFile) {
            showNotification('File tidak ditemukan', 'error');
            return;
        }
        
        // Create a modal to preview the file
        createFilePreviewModal(foundFile);
    };

    // New function to create file preview modal
    function createFilePreviewModal(file) {
        // Remove existing modal if any
        const existingModal = document.getElementById('filePreviewModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'filePreviewModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
            position: relative;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: var(--error);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;

        closeButton.addEventListener('click', () => modal.remove());
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.transform = 'scale(1.1)';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.transform = 'scale(1)';
        });

        // File info header
        const fileInfo = document.createElement('div');
        fileInfo.innerHTML = `
            <h3 style="color: var(--primary-color); margin-bottom: 10px; padding-right: 50px;">
                <i class="fas ${getFileIcon(file.type)}" style="margin-right: 10px;"></i>
                ${file.name}
            </h3>
            <p style="color: var(--gray-500); margin-bottom: 20px;">
                Ukuran: ${formatFileSize(file.size)} | Tipe: ${file.type}
            </p>
        `;

        const previewContainer = document.createElement('div');
        previewContainer.style.cssText = `
            text-align: center;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Handle different file types
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.cssText = `
                max-width: 100%;
                max-height: 500px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            `;
            img.onload = () => URL.revokeObjectURL(img.src);
            previewContainer.appendChild(img);
        } else if (file.type === 'application/pdf') {
            const pdfInfo = document.createElement('div');
            pdfInfo.innerHTML = `
                <i class="fas fa-file-pdf" style="font-size: 80px; color: var(--error); margin-bottom: 20px;"></i>
                <h4 style="color: var(--text-color); margin-bottom: 15px;">File PDF</h4>
                <p style="color: var(--gray-500); margin-bottom: 20px;">
                    Untuk melihat konten PDF secara lengkap, silakan download file.
                </p>
                <button onclick="downloadFile('${file.name}', '${URL.createObjectURL(file)}')" 
                        style="background: var(--primary-color); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-download" style="margin-right: 8px;"></i>
                    Download PDF
                </button>
            `;
            previewContainer.appendChild(pdfInfo);
        } else {
            const unsupportedInfo = document.createElement('div');
            unsupportedInfo.innerHTML = `
                <i class="fas fa-file" style="font-size: 80px; color: var(--gray-500); margin-bottom: 20px;"></i>
                <h4 style="color: var(--text-color); margin-bottom: 15px;">Preview tidak tersedia</h4>
                <p style="color: var(--gray-500);">Tipe file ini tidak dapat di-preview, tetapi file sudah terupload dengan benar.</p>
            `;
            previewContainer.appendChild(unsupportedInfo);
        }

        modalContent.appendChild(closeButton);
        modalContent.appendChild(fileInfo);
        modalContent.appendChild(previewContainer);
        modal.appendChild(modalContent);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close modal with ESC key
        document.addEventListener('keydown', function escKeyHandler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escKeyHandler);
            }
        });

        document.body.appendChild(modal);
    }

    // Download function for PDF files
    window.downloadFile = function(filename, url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    window.removeFile = function(fileId, type) {
        uploadedFiles[type] = uploadedFiles[type].filter(file => file.id !== fileId);
        const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
        if (fileElement) {
            fileElement.remove();
        }
        checkSubmitButton();
    };

    function checkSubmitButton() {
        const requiredTypes = ['ktp', 'business', 'bank', 'store'];
        const hasAllRequired = requiredTypes.every(type => uploadedFiles[type].length > 0);
        
        submitBtn.disabled = !hasAllRequired;
        if (hasAllRequired) {
            submitBtn.style.background = 'var(--primary-color)';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.background = 'var(--gray-300)';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>MENGIRIM...';
        submitBtn.disabled = true;
        
        // Simulate upload process
        setTimeout(() => {
            showSuccessMessage();
        }, 3000);
    });

    function showSuccessMessage() {
        const formContainer = document.querySelector('.form-container');
        formContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 2rem; background-color: rgba(255, 255, 255, 0.95); border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style="width: 80px; height: 80px; border-radius: 50%; display: block; stroke-width: 2; stroke: var(--success); stroke-miterlimit: 10; margin: 20px auto; animation: checkmark 0.6s ease-in-out;">
                    <circle cx="26" cy="26" r="25" fill="none" style="stroke-dasharray: 166; stroke-dashoffset: 166; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;"/>
                    <path fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8" style="stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;"/>
                </svg>
                <h2 style="color: var(--success); font-size: 2.5rem; margin: 1.5rem 0 1rem; font-weight: 700;">Dokumen Berhasil Dikirim!</h2>
                <p style="color: var(--text-color); font-size: 1.3rem; margin-bottom: 2rem; line-height: 1.6;">
                    Terima kasih! Dokumen Anda telah berhasil diunggah. Tim verifikasi kami akan meninjau dokumen dalam <strong>2-3 hari kerja</strong>.
                </p>
                
                <div style="background: var(--gray-100); padding: 2rem; border-radius: 16px; margin: 2rem 0; border: 2px solid var(--primary-color);">
                    <h3 style="color: var(--primary-color); margin-bottom: 1.5rem; font-size: 1.4rem; font-weight: 600;">Status Dokumen:</h3>
                    <div style="text-align: left; display: grid; gap: 1rem;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-check" style="color: white; font-size: 0.9rem;"></i>
                            </div>
                            <span style="font-size: 1.1rem; color: var(--text-color);">KTP - Berhasil diunggah</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-check" style="color: white; font-size: 0.9rem;"></i>
                            </div>
                            <span style="font-size: 1.1rem; color: var(--text-color);">SIUP/NIB - Berhasil diunggah</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-check" style="color: white; font-size: 0.9rem;"></i>
                            </div>
                            <span style="font-size: 1.1rem; color: var(--text-color);">Rekening Koran - Berhasil diunggah</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-check" style="color: white; font-size: 0.9rem;"></i>
                            </div>
                            <span style="font-size: 1.1rem; color: var(--text-color);">Foto Toko - Berhasil diunggah</span>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(144, 31, 31, 0.05); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border-left: 4px solid var(--primary-color);">
                    <p style="color: var(--text-color); font-size: 1rem; margin: 0; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-info-circle" style="color: var(--primary-color);"></i>
                        <strong>Catatan:</strong> Anda akan menerima notifikasi email dan WhatsApp setelah proses verifikasi selesai.
                    </p>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
                    <button onclick="location.href='/HTML/progress-track/progress.html'" style="background: var(--primary-color); color: white; border: none; padding: 1rem 2rem; border-radius: 30px; font-weight: 600; cursor: pointer; font-size: 1.1rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-chart-line"></i>
                        Cek Status Progress
                    </button>
                    <button onclick="location.href='/HTML/Home Page/index.html'" style="background: var(--light-color); color: var(--primary-color); border: 2px solid var(--primary-color); padding: 1rem 2rem; border-radius: 30px; font-weight: 600; cursor: pointer; font-size: 1.1rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-home"></i>
                        Kembali ke Beranda
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

    // Animation styles
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
        @keyframes checkmark {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes stroke {
            100% { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});