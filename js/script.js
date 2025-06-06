// Scroll to Top Button
const backToTopBtn = document.getElementById("backToTopBtn");
const rootElement = document.documentElement;

// Smooth scroll to top
function scrollToTop() {
    rootElement.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Show the button when user scrolls down
window.addEventListener("scroll", function () {
    backToTopBtn.style.display = rootElement.scrollTop > 100 ? "block" : "none";
});

// Select DOM elements
const loginButton = document.querySelector('#loginButton');
const myProfile = document.querySelector('#myProfile');

// Update Navbar Based on Login State
function updateNavbar() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));  // Parse the user object

    console.log('Token:', token);
    console.log('User:', user);

    if (token && user) {
        // Check if user object exists before accessing properties
        const first_name = user.first_name || 'User';
        const role = user.role || 'customer';

        loginButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        loginButton.removeAttribute('data-bs-toggle');
        loginButton.removeAttribute('data-bs-target');
        loginButton.onclick = logout;

        myProfile.innerHTML = `<i class="fas fa-user-circle"></i> ${first_name}`;
        myProfile.style.cursor = 'pointer';
        myProfile.onclick = () => {
            if (role === 'admin') {
                window.location.href = '/Admin-dashboard.html';
            } else if (role === 'staff') {
                window.location.href = '/Staff-dashboard.html';
            } else {
                window.location.href = '/Customer-dashboard.html';
            }
        };
    } else {
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        loginButton.setAttribute('data-bs-toggle', 'modal');
        loginButton.setAttribute('data-bs-target', '#loginModal');
        loginButton.onclick = null;

        myProfile.innerHTML = '<i class="fas fa-user-circle"></i> My Profile';
        myProfile.style.cursor = 'default';
        myProfile.onclick = null;
    }
}

// Logout Function
function logout() {
    const confirmation = confirm("Are you sure you want to log out?");
    if (confirmation) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        alert('You have successfully logged out.');
        location.reload(); // Reload page to reset UI
    }
}


////////////////////////////////////////////////// Login Functionality //////////////////////////////////////////////////
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    fetch('https://shaminagroupltd.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Login Response:', data); // Debug response

            if (data.error) {
                alert(data.error);
            } else {
                const { user, token } = data;

                if (user) {
                    // Store user details and token in localStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    alert(data.message || 'Login successful!');

                    // Hide the login modal
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    if (loginModal) loginModal.hide();

                    // Update the navbar
                    updateNavbar();
                } else {
                    console.error('User details missing from response:', data);
                    alert('Login successful, but unable to retrieve user details.');
                }
            }
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            alert('Failed to login. Please try again.');
        });
});


// Signup Functionality
document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    fetch('https://shaminagroupltd.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message || 'Signup successful!');
                document.getElementById('signupForm').reset();
                const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
                signupModal.hide();

                // Optionally, show the login modal
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            }
        })
        .catch((error) => {
            console.error('Error signing up:', error);
            alert('Failed to sign up. Please try again.');
        });
});


// Initialize the Navbar on Page Load
document.addEventListener('DOMContentLoaded', updateNavbar);

