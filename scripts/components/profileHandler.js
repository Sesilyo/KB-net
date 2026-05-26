// FILENAME: scripts/components/profileHandler.js

export function initProfile() {
    // ─────────────────────────────────────────────
    // SIDEBAR NAVIGATION
    // ─────────────────────────────────────────────

    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.profile-section');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.id === 'logout-btn') {
                handleLogout();
                return;
            }

            e.preventDefault();
            
            // Remove active class from all menu items
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.style.display = 'none');

            // Show selected section
            const sectionId = item.getAttribute('href').substring(1);
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.style.display = 'block';
            }
        });
    });

    // ─────────────────────────────────────────────
    // EDIT FUNCTIONALITY
    // ─────────────────────────────────────────────

    const editButtons = document.querySelectorAll('.edit-btn');
    let editingField = null;

    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.getAttribute('data-field');
            const input = document.getElementById(`${field}-input`);

            if (!input.disabled) {
                // Currently editing, cancel edit
                input.disabled = true;
                btn.textContent = 'Edit';
                btn.classList.remove('editing');
                input.value = input.getAttribute('data-original-value');
                editingField = null;
            } else {
                // Cancel previous edit if any
                if (editingField && editingField !== field) {
                    const prevInput = document.getElementById(`${editingField}-input`);
                    prevInput.disabled = true;
                    document.querySelector(`[data-field="${editingField}"]`).textContent = 'Edit';
                    document.querySelector(`[data-field="${editingField}"]`).classList.remove('editing');
                }

                // Start editing
                input.setAttribute('data-original-value', input.value);
                input.disabled = false;
                input.focus();
                btn.textContent = 'Done';
                btn.classList.add('editing');
                editingField = field;
                showActionButtons();
            }
        });
    });

    // ─────────────────────────────────────────────
    // SAVE/CANCEL FUNCTIONALITY
    // ─────────────────────────────────────────────

    const saveBtn = document.getElementById('save-changes-btn');
    const cancelBtn = document.getElementById('cancel-changes-btn');

    saveBtn.addEventListener('click', () => {
        // Get all edited values
        const fullname = document.getElementById('fullname-input').value;
        const studentid = document.getElementById('studentid-input').value;
        const email = document.getElementById('email-input').value;

        // Validate inputs
        if (!fullname.trim()) {
            alert('Full name cannot be empty');
            return;
        }
        if (!studentid.trim()) {
            alert('Student ID cannot be empty');
            return;
        }
        if (!email.trim()) {
            alert('Email cannot be empty');
            return;
        }

        // Here you would normally send the data to the server
        console.log('Saving profile changes:', {
            fullname,
            studentid,
            email
        });

        // Reset edit buttons
        editButtons.forEach(btn => {
            const input = document.getElementById(`${btn.getAttribute('data-field')}-input`);
            input.disabled = true;
            btn.textContent = 'Edit';
            btn.classList.remove('editing');
        });

        editingField = null;
        hideActionButtons();

        // Show success message
        showNotification('Profile updated successfully!', 'success');
    });

    cancelBtn.addEventListener('click', () => {
        // Reset all inputs
        editButtons.forEach(btn => {
            const field = btn.getAttribute('data-field');
            const input = document.getElementById(`${field}-input`);
            input.value = input.getAttribute('data-original-value');
            input.disabled = true;
            btn.textContent = 'Edit';
            btn.classList.remove('editing');
        });

        editingField = null;
        hideActionButtons();
    });

    // ─────────────────────────────────────────────
    // PROFILE PHOTO UPLOAD
    // ─────────────────────────────────────────────

    const uploadPhotoBtn = document.getElementById('upload-photo-btn');
    const photoInput = document.getElementById('photo-input');
    const profilePhoto = document.getElementById('profile-photo');

    uploadPhotoBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePhoto.src = event.target.result;
                showNotification('Profile photo updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    // ─────────────────────────────────────────────
    // HELPER FUNCTIONS
    // ─────────────────────────────────────────────

    function showActionButtons() {
        document.getElementById('save-changes-btn').style.display = 'block';
        document.getElementById('cancel-changes-btn').style.display = 'block';
    }

    function hideActionButtons() {
        document.getElementById('save-changes-btn').style.display = 'none';
        document.getElementById('cancel-changes-btn').style.display = 'none';
    }

    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Here you would normally handle logout on the server
            console.log('User logged out');
            window.location.href = '../index.html';
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add keyframes animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
