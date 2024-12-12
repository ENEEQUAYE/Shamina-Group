const myProfile = document.querySelector('#myProfile');

// Update Navbar Based on Login State
function updateNavbar() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));  // Parse the user object

    if (token && user) {
        // User is logged in
        const first_name = user.first_name || 'My Profile';  // Get first_name from user object
        myProfile.innerHTML = `${first_name}`;
    } else {
        // User is not logged in
        myProfile.innerHTML = 'My Profile';
    }
}


// Initialize the Navbar on Page Load
document.addEventListener('DOMContentLoaded', updateNavbar);


////////////////// Script for Sidebar Navigation
const navLinks = document.querySelectorAll('#sidebar a[data-target]');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('data-target'));

            contentSections.forEach(section => section.classList.add('d-none'));
            if (target) target.classList.remove('d-none');
        });
    });

document.querySelector('#sidebar a[data-target="#overview"]').click();

//////////////////////////// Script for Logout Button
const logoutButton = document.querySelector('#logoutButton');
    logoutButton.addEventListener('click', () => {
        // Clear local storage
        localStorage.clear();
        // Redirect to index.html
        window.location.href = 'index.html';
    });

/////////////////////// Script for Active Navigation
const navItems = document.querySelectorAll('#sidebar a[data-target]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(navItem => {
                navItem.style.backgroundColor = '';
            });
            item.style.backgroundColor = '#0079a1';
        });
    });
document.querySelector('#sidebar a[data-target="#overview"]').style.backgroundColor = '#0079a1';

//////////////////////////////////////// Fetch user data from localStorage and populate profile details //////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));  // Get user object from localStorage

    if (user) {
        // Populate user details dynamically
        document.getElementById('userFullName').textContent = `${user.first_name} ${user.last_name}`; // Full name
        // document.getElementById('userPosition').innerHTML = `<i class="fas fa-user-tag"></i> ${user.position || 'N/A'}`;  // Position
        document.getElementById('userEmail').innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`;  // Email
        document.getElementById('userPhone').innerHTML = `<i class="fas fa-phone"></i> ${user.phone || 'Not available'}`;  // Phone number

        // Update profile picture if available
        if (user.profilePic) {
            document.getElementById('profileImage').src = user.profilePic;  // Update the profile image source
        } 
    }
});