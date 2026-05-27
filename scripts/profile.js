// FILENAME: scripts/profile.js

export async function initProfilePage() {
    // Load user profile data
    await loadProfileData();
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Setup edit functionality
    setupEditFunctionality();
}

// Load profile data from API
async function loadProfileData() {
    try {
        const response = await fetch('../api/getUserProfile.php');
        const data = await response.json();
        
        if (!data.success) {
            console.error('Failed to load profile:', data.message);
            return;
        }
        
        const user = data.user;
        
        // Update display values
        document.getElementById('username-display').textContent = user.student_id.toLowerCase().replace('-', '_');
        document.getElementById('fullname-display').textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById('studentid-display').textContent = user.student_id;
        document.getElementById('email-display').textContent = user.email;
        document.getElementById('lenderid-display').textContent = user.lender_id;
        document.getElementById('borrowerid-display').textContent = user.borrower_id;
        
        // Set input values
        document.getElementById('fullname-input').value = `${user.first_name} ${user.last_name}`;
        document.getElementById('studentid-input').value = user.student_id;
        document.getElementById('email-input').value = user.email;
        
        // Store original values for cancel functionality
        window.profileData = {
            original: {
                fullname: `${user.first_name} ${user.last_name}`,
                studentid: user.student_id,
                email: user.email
            }
        };
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

// Setup sidebar navigation
function setupSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sections = document.querySelectorAll('.profile-section');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.dataset.section;
            
            // Remove active class from all items and sections
            sidebarItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked item and corresponding section
            item.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Setup edit functionality
function setupEditFunctionality() {
    const editFullnameBtn = document.getElementById('edit-fullname-btn');
    const editStudentidBtn = document.getElementById('edit-studentid-btn');
    const editEmailBtn = document.getElementById('edit-email-btn');
    
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const cancelChangesBtn = document.getElementById('cancel-changes-btn');
    
    const editActions = document.getElementById('edit-actions');
    
    let editingFields = {};
    
    // Edit button clicks
    editFullnameBtn.addEventListener('click', () => {
        toggleEdit('fullname', editingFields, editActions);
    });
    
    editStudentidBtn.addEventListener('click', () => {
        toggleEdit('studentid', editingFields, editActions);
    });
    
    editEmailBtn.addEventListener('click', () => {
        toggleEdit('email', editingFields, editActions);
    });
    
    // Save changes
    saveChangesBtn.addEventListener('click', async () => {
        await saveProfileChanges(editingFields);
        editingFields = {};
        updateEditUI(editingFields, editActions);
    });
    
    // Cancel changes
    cancelChangesBtn.addEventListener('click', () => {
        cancelEdits(editingFields);
        editingFields = {};
        updateEditUI(editingFields, editActions);
    });
}

// Toggle edit mode for a field
function toggleEdit(fieldName, editingFields, editActions) {
    editingFields[fieldName] = !editingFields[fieldName];
    updateEditUI(editingFields, editActions);
}

// Update UI based on editing state
function updateEditUI(editingFields, editActions) {
    const displayElements = {
        fullname: document.getElementById('fullname-display'),
        studentid: document.getElementById('studentid-display'),
        email: document.getElementById('email-display')
    };
    
    const editElements = {
        fullname: document.getElementById('fullname-edit'),
        studentid: document.getElementById('studentid-edit'),
        email: document.getElementById('email-edit')
    };
    
    Object.keys(displayElements).forEach(field => {
        if (editingFields[field]) {
            displayElements[field].classList.add('hidden');
            editElements[field].classList.remove('hidden');
        } else {
            displayElements[field].classList.remove('hidden');
            editElements[field].classList.add('hidden');
        }
    });
    
    // Show/hide save/cancel buttons
    if (Object.values(editingFields).some(v => v === true)) {
        editActions.classList.remove('hidden');
    } else {
        editActions.classList.add('hidden');
    }
}

// Cancel edits and restore original values
function cancelEdits(editingFields) {
    const fullnameInput = document.getElementById('fullname-input');
    const studentidInput = document.getElementById('studentid-input');
    const emailInput = document.getElementById('email-input');
    
    fullnameInput.value = window.profileData.original.fullname;
    studentidInput.value = window.profileData.original.studentid;
    emailInput.value = window.profileData.original.email;
    
    Object.keys(editingFields).forEach(key => {
        editingFields[key] = false;
    });
}

// Save profile changes to API
async function saveProfileChanges(editingFields) {
    const fullnameInput = document.getElementById('fullname-input').value.trim();
    const studentidInput = document.getElementById('studentid-input').value.trim();
    const emailInput = document.getElementById('email-input').value.trim();
    
    // Parse full name
    const nameParts = fullnameInput.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Validate
    if (!firstName || !lastName || !emailInput || !studentidInput) {
        alert('All fields are required');
        return;
    }
    
    if (!isValidEmail(emailInput)) {
        alert('Please enter a valid email address');
        return;
    }
    
    try {
        const response = await fetch('../api/updateUserProfile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: emailInput,
                student_id: studentidInput
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            alert('Error: ' + data.message);
            return;
        }
        
        // Update display with new values
        document.getElementById('fullname-display').textContent = fullnameInput;
        document.getElementById('studentid-display').textContent = studentidInput;
        document.getElementById('email-display').textContent = emailInput;
        
        // Update original values
        window.profileData.original = {
            fullname: fullnameInput,
            studentid: studentidInput,
            email: emailInput
        };
        
        alert('Profile updated successfully!');
        
        // Reload navbar to update user info
        location.reload();
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('An error occurred while saving your profile');
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
