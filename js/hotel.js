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
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('You have successfully logged out.');

    // Reload page to reset UI
    location.reload();
}


////////////////////////////////////////////////// Login Functionality //////////////////////////////////////////////////
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:5000/api/auth/login', {
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

    fetch('http://localhost:5000/api/auth/signup', {
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




// // Handle Book Consultation Button
// if (bookConsultationButton) {
//     bookConsultationButton.addEventListener('click', () => {
//         const token = localStorage.getItem('token'); // Check if user is logged in

//         if (!token) {
//             // User is not logged in, show login modal
//             alert('You need to log in to book a consultation.');
//             const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
//             loginModal.show();
//             return;
//         }

//         //automatially show the appointment modal after login
//         const appointmentModal = new bootstrap.Modal(document.getElementById('appointmentModal'));
//         appointmentModal.show();
//     });
// }

// Room Booking Form Submission
// document.getElementById('roomBookingForm').addEventListener('submit', async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const data = Object.fromEntries(formData.entries());

//     try {
//         const response = await fetch('http://localhost:5000/api/room/book', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data),
//         });
//         const result = await response.json();
//         if (response.ok) {
//             alert(result.message || 'Room booked successfully!');
//             event.target.reset();
//         } else {
//             alert(result.error || 'Failed to book room.');
//         }
//     } catch (error) {
//         alert('Error booking room. Please try again.');
//         console.error(error);
//     }
// });

//Activity Booking
document.getElementById('activityBookingForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const activityType = Array.from(
        document.querySelectorAll('input[name="activityType"]:checked')
    ).map((checkbox) => checkbox.value);

    // Prepare payload
    const data = { 
        ...Object.fromEntries(formData.entries()), 
        activityType 
    };

    try {
        const response = await fetch('http://localhost:5000/api/activity/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        alert(result.message || 'Activity booked successfully!');
        event.target.reset();
    } catch (error) {
        alert('Error booking activity. Please try again.');
    }
});

// Room Booking Form Submission
document.getElementById('roomBookingForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const checkinDate = document.getElementById('checkinDate').value;
    const checkoutDate = document.getElementById('checkoutDate').value;
    const roomType = document.getElementById('roomType').value;
    const numberOfGuests = document.getElementById('numberOfGuestsRoom').value;
    const name = document.getElementById('nameRoom').value;
    const email = document.getElementById('emailRoom').value;
    const phone = document.getElementById('phoneRoom').value;
    const specialRequests = document.getElementById('specialRequestsRoom').value;

    try {
        const response = await fetch('http://localhost:5000/api/roomBooking/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                checkinDate,
                checkoutDate,
                roomType,
                numberOfGuests,
                name,
                email,
                phone,
                specialRequests,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || 'Room booking successful!');
            document.getElementById('roomBookingForm').reset();
        } else {
            alert(result.error || 'Failed to book room. Please try again.');
        }
    } catch (error) {
        console.error('Error booking room:', error);
        alert('An error occurred while booking the room.');
    }
});

