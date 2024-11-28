const myProfile = document.querySelector('#myProfile');

// Update Navbar Based on Login State
function updateNavbar() {
    const token = localStorage.getItem('token');
    const first_name = localStorage.getItem('first_name'); // User's name saved during login
    

    if (token) {
        // User is logged in
        myProfile.innerHTML = `${first_name || 'My Profile'}`;
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