// FILENAME: scripts/components/profile.js
// Handles profile page logic including data fetching and form submission

export async function initProfile() {
    const displaySection = document.getElementById('user-info-display');
    const editSection = document.getElementById('edit-profile-section');
    const profileForm = document.getElementById('profile-form');
    const btnEditProfile = document.getElementById('btn-edit-profile');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const btnLogout = document.getElementById('btn-logout');
    const formMessage = document.getElementById('form-message');

    // Fetch and display user profile
    async function loadProfile() {
        try {
            const response = await fetch('../api/getProfile.php');
            const data = await response.json();

            if (!data.success) {
                // Redirect to login if not authenticated
                window.location.href = '../index.html';
                return;
            }

            const user = data.user;

            // Display user info
            document.getElementById('display-student-id').textContent = user.student_id;
            document.getElementById('display-name').textContent = `${user.first_name} ${user.last_name}`;
            document.getElementById('display-email').textContent = user.email;
            document.getElementById('display-lender-id').textContent = user.lender_id;
            document.getElementById('display-borrower-id').textContent = user.borrower_id;

            // Populate form fields
            document.getElementById('input-student-id').value = user.student_id;
            document.getElementById('input-first-name').value = user.first_name;
            document.getElementById('input-last-name').value = user.last_name;
            document.getElementById('input-email').value = user.email;
        } catch (error) {
            console.error('Error loading profile:', error);
            formMessage.textContent = 'Failed to load profile.';
            formMessage.className = 'form-message error';
        }
    }

    // Toggle between display and edit modes
    btnEditProfile.addEventListener('click', () => {
        displaySection.style.display = 'none';
        editSection.style.display = 'block';
        btnEditProfile.style.display = 'none';
        formMessage.textContent = '';
    });

    btnCancelEdit.addEventListener('click', () => {
        displaySection.style.display = 'block';
        editSection.style.display = 'none';
        btnEditProfile.style.display = 'block';
        formMessage.textContent = '';
    });

    // Handle form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(profileForm);

        try {
            const response = await fetch('../api/updateProfile.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                formMessage.textContent = data.message;
                formMessage.className = 'form-message success';

                // Update displayed info
                const user = data.user;
                document.getElementById('display-student-id').textContent = user.student_id;
                document.getElementById('display-name').textContent = `${user.first_name} ${user.last_name}`;
                document.getElementById('display-email').textContent = user.email;

                // Return to display mode after delay
                setTimeout(() => {
                    displaySection.style.display = 'block';
                    editSection.style.display = 'none';
                    btnEditProfile.style.display = 'block';
                }, 1500);
            } else {
                formMessage.textContent = data.message || 'Failed to update profile.';
                formMessage.className = 'form-message error';
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            formMessage.textContent = 'An error occurred while updating profile.';
            formMessage.className = 'form-message error';
        }
    });

    // Handle logout
    btnLogout.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to logout?')) {
            return;
        }

        try {
            const response = await fetch('../api/logout.php');
            const data = await response.json();

            if (data.success) {
                // Redirect to login page
                window.location.href = '../index.html';
            } else {
                alert('Failed to logout.');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            alert('An error occurred during logout.');
        }
    });

    // Load profile on page load
    loadProfile();
}

// Initialize profile page
initProfile();
