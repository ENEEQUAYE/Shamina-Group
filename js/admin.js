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
    if (confirm("Are you sure you want to log out?")) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
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


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const time = hours + ':' + minutes + ' ' + ampm;
    return day + '/' + month + '/' + year + ' ' + time;
}



document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});

////////////////////////////////////////////////////////////////////Function to fetch and populate manageUserTable //////////////////////////////////////////////////////
function fetchUsers() {
    fetch('http://localhost:5000/api/users') // Adjust URL if necessary
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById('manageUsersTable');
            tableBody.innerHTML = ''; // Clear existing rows

            users.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.first_name} ${user.last_name}</td>
                    <td>${user.email}</td>
                    <td>${user.position || 'N/A'}</td>
                    <td>${user.role}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="showEditModal('${user._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

function showEditModal(userId) {
    fetch(`http://localhost:5000/api/users/${userId}`) // Fetch user details
        .then(response => response.json())
        .then(user => {
            document.getElementById('editUserId').value = user._id;
            document.getElementById('editFirstName').value = user.first_name;
            document.getElementById('editLastName').value = user.last_name;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editRole').value = user.role;
            document.getElementById('editPosition').value = user.position || '';
            document.getElementById('editPhone').value = user.phone || '';

            const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editModal.show();
        })
        .catch(error => console.error('Error fetching user data:', error));
}

document.getElementById('editUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        first_name: document.getElementById('editFirstName').value,
        last_name: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        role: document.getElementById('editRole').value,
        position: document.getElementById('editPosition').value || null,
        phone: document.getElementById('editPhone').value || null,
    };

    fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
    })
        .then(response => response.json())
        .then(data => {
            console.log('User updated:', data);
            fetchUsers(); // Refresh table
            bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
        })
        .catch(error => console.error('Error updating user:', error));
});

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log('User deleted:', data);
                fetchUsers(); // Refresh table
            })
            .catch(error => console.error('Error deleting user:', error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});





// Fetch room bookings and populate the table
function fetchRoomBookings() {
    fetch('http://localhost:5000/api/roomBooking')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('roomBookingsTable');
            tableBody.innerHTML = ''; // Clear any existing content

            data.forEach((booking, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${booking.name}</td>
                    <td>${booking.email}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.roomType}</td>
                    <td>${booking.numberOfGuests}</td>
                    <td>${formatDate(booking.checkinDate)}</td>
                    <td>${formatDate(booking.checkoutDate)}</td>
                    <td>${booking.specialRequests || 'None'}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteRoomBooking('${booking._id}')">
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching room bookings:', error);
        });
}

// Call this function on page load
document.addEventListener('DOMContentLoaded', fetchRoomBookings);

////////////////////////////////////////////////////////////////////// Fetch and populate appointments////////////////////////////////////////////////////////////////
fetch('http://localhost:5000/api/appointments')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById('appointmentsTable');
        tableBody.innerHTML = ''; // Clear previous content
        data.forEach((appointment, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${appointment.first_name} ${appointment.last_name}</td>
                    <td>${appointment.email}</td>
                    <td>${appointment.phone}</td>
                    <td>${appointment.consultancy_type}</td>
                    <td>${new Date(appointment.date).toLocaleDateString()}</td>
                    <td>${appointment.time}</td>
                    <td>${appointment.message || 'None'}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" data-id="${appointment._id}">Cancel</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
    

// Add event listener to the table to cancel appointments
    document.getElementById('appointmentsTable').addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const id = event.target.getAttribute('data-id');
            fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                // Re-fetch and update table
                alert('Appointment canceled successfully!');
                // fetchAppointments(); // Create a function to re-fetch the data 
                location.reload(); // Refresh the page
            })
            .catch(error => {
                console.error('Error deleting appointment:', error);
            });
        }
    });

    
    /////////////////////////////////////////////////////////////////////////////// Add User Functionality //////////////////////////////////////////////////////
    async function addUser(event) {
        event.preventDefault(); // Prevent form submission default behavior
    
        // Collect form values
        const firstName = document.getElementById('userFirstName').value.trim();
        const lastName = document.getElementById('userLastName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const role = document.getElementById('role').value;
        const position = document.getElementById('position').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('userPassword').value.trim();
    
        // Validate inputs
        if (!firstName || !lastName || !email || !role || !position || !phone || !password) {
            alert('Please fill out all fields.');
            return;
        }
    
        try {
            // Send POST request to backend
            const response = await fetch('http://localhost:5000/api/auth/adduser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Assumes a token is stored locally
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password,
                    role,
                    position,
                    phone,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert(data.message); // Notify success
                document.getElementById('addUserForm').reset(); // Reset form
            } else {
                alert(data.error || 'Error adding user');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while adding the user.');
        }
    }
    
    // function addUser() {
    //     const firstName = document.getElementById('userFirstName').value.trim();
    //     const lastName = document.getElementById('userLastName').value.trim();
    //     const email = document.getElementById('userEmail').value.trim();
    //     const role = document.getElementById('role').value;
    //     const position = document.getElementById('position').value.trim();
    //     const phone = document.getElementById('phone').value.trim();
    //     const password = document.getElementById('userPassword').value;
    
    //     // Debugging: Log all values
    //     console.log('First Name:', firstName);
    //     console.log('Last Name:', lastName);
    //     console.log('Email:', email);
    //     console.log('Role:', role);
    //     console.log('Position:', position);
    //     console.log('Phone:', phone);
    //     console.log('Password:', password);
    
    //     // Perform a fetch request
    //     fetch('http://localhost:5000/api/auth/adduser', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             first_name: firstName,
    //             last_name: lastName,
    //             email,
    //             role,
    //             position,
    //             phone,
    //             password,
    //         }),
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log('Response:', data);
    //             if (data.error) {
    //                 alert(`Error: ${data.error}`);
    //             } else {
    //                 alert(data.message || 'User added successfully!');
    //                 document.getElementById('addUserForm').reset(); // Reset form after successful submission
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //             alert('Failed to add user. Please try again.');
    //         });
    // }
    
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


//////////////////////////////////////////////////////////// Fetch and populate activity bookings //////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch activity bookings
    async function fetchActivityBookings() {
        try {
            const response = await fetch('http://localhost:5000/api/activity/bookings');
            const bookings = await response.json();

            if (response.ok) {
                populateActivityBookingsTable(bookings);
            } else {
                console.error('Failed to fetch activity bookings:', bookings.error);
                alert('Failed to load activity bookings.');
            }
        } catch (error) {
            console.error('Error fetching activity bookings:', error);
            alert('An error occurred while fetching activity bookings.');
        }
    }

    // Function to populate the table
    function populateActivityBookingsTable(bookings) {
        const tableBody = document.getElementById('activityBookingsTable');
        tableBody.innerHTML = ''; // Clear existing rows

        bookings.forEach((booking, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.activityType.join(', ')}</td>
                <td>${new Date(booking.activityDate).toLocaleDateString()}</td>
                <td>${booking.numberOfGuests}</td>
                <td>${booking.specialRequests || 'None'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteBooking('${booking._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Attach deleteBooking to the window object
    window.deleteBooking = async function deleteBooking(bookingId) {
        if (confirm('Are you sure you want to delete this booking?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/activity/bookings/${bookingId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Booking deleted successfully!');
                    fetchActivityBookings(); // Refresh the table
                } else {
                    alert('Failed to delete the booking.');
                }
            } catch (error) {
                console.error('Error deleting booking:', error);
                alert('An error occurred while deleting the booking.');
            }
        }
    };


    // Initial fetch of activity bookings
    fetchActivityBookings();
});

//////////////////////////////////////// Handle check-in form submission //////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
    const roomDropdown = document.getElementById('roomSelection');
    const checkInForm = document.getElementById('checkInForm');
    const checkInDateField = document.getElementById('checkInDate');

    // Auto-fill check-in date and time with the current timestamp
    const now = new Date();
    checkInDateField.value = now.toISOString().slice(0, 16); // Format for datetime-local input

    try {
        // Fetch all rooms from the API
        const response = await fetch('http://localhost:5000/api/rooms');
        if (!response.ok) {
            throw new Error(`Failed to fetch rooms: ${response.statusText}`);
        }
        const rooms = await response.json();

        // Populate dropdown with available rooms
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room._id;
            option.textContent = `${room.roomNumber} (${room.roomType})`;
            if (room.status !== 'Available') {
                option.disabled = true; // Disable rooms that are not available
            }
            roomDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        alert('Failed to load room options. Please try again later.');
    }

    // Handle form submission
    checkInForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const guestName = document.getElementById('guestName').value.trim();
        const guestContact = document.getElementById('guestContact').value.trim();
        const guestID = document.getElementById('guestID').value.trim();
        const roomId = roomDropdown.value;
        const checkInDate = checkInDateField.value;

        if (!guestName || !guestContact || !guestID || !roomId || !checkInDate) {
            alert('Please fill in all the required fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/rooms/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestName, guestContact, guestID, roomId, checkInDate }),
            });

            if (response.ok) {
                alert('Check-in successful!');
                location.reload(); // Reload to refresh the available rooms
            } else {
                const errorData = await response.json();
                alert(`Check-in failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            alert('An error occurred while processing the check-in. Please try again later.');
        }
    });
});

////////////////////////////////////////////////// Fetch checked-in guests and populate the table ////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const checkOutTableBody = document.getElementById('checkOutTableBody');
    const guestHistoryTableBody = document.getElementById('guestHistoryTableBody');
    const guestFilterInput = document.getElementById('guestFilter');
    const guestHistoryFilterInput = document.getElementById('guestHistoryFilter');
    const monthFilterInput = document.getElementById('monthFilter');
    let checkedInGuests = [];
    let allGuests = [];

    // Fetch checked-in guests from the backend
    async function fetchCheckedInGuests() {
        try {
            const response = await fetch('http://localhost:5000/api/guests/checked-in');
            if (!response.ok) {
                throw new Error('Failed to fetch checked-in guests');
            }
            checkedInGuests = await response.json();
            displayGuests(checkedInGuests); // Display guests in the "Check Out" section
        } catch (error) {
            console.error('Error fetching checked-in guests:', error);
            checkOutTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Failed to load guest data</td></tr>`;
        }
    }

    // Fetch all guests for history
    async function fetchGuestHistory() {
        try {
            const response = await fetch('http://localhost:5000/api/guests/history');
            if (!response.ok) {
                throw new Error('Failed to fetch guest history');
            }
            allGuests = await response.json();
            showGuestHistory(allGuests); // Display guests in the history section
        } catch (error) {
            console.error('Error fetching guest history:', error);
            guestHistoryTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Failed to load guest history</td></tr>`;
        }
    }

    // Display checked-in guests in the "Check Out" table
    function displayGuests(guestList) {
        checkOutTableBody.innerHTML = '';
        guestList.forEach(guest => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${guest.guestName}</td>
                <td>${guest.guestContact}</td>
                <td>${guest.guestID}</td>
                <td>${guest.roomId ? guest.roomId.roomNumber : 'N/A'}</td>
                <td>${formatDate(guest.checkInDate)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="checkOutGuest('${guest._id}')">Check Out</button>
                </td>
            `;
            checkOutTableBody.appendChild(row);
        });
    }

    // Display guest history in the table
    function showGuestHistory(guestList) {
        guestHistoryTableBody.innerHTML = '';
        guestList.forEach(guest => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${guest.guestName}</td>
                <td>${guest.guestContact}</td>
                <td>${guest.guestID}</td>
                <td>${guest.roomId ? guest.roomId.roomNumber : 'N/A'}</td>
                <td>${formatDate(guest.checkInDate)}</td>
                <td>${guest.checkOutDate ? formatDate(guest.checkOutDate) : 'Still Checked-In'}</td>
            `;
            guestHistoryTableBody.appendChild(row);
        });
    }

    // Filter guests based on the input in the "Check Out" section
    guestFilterInput.addEventListener('input', () => {
        const filterValue = guestFilterInput.value.toLowerCase();
        const filteredGuests = checkedInGuests.filter(guest =>
            guest.guestName.toLowerCase().includes(filterValue)
        );
        displayGuests(filteredGuests);
    });

    // Filter guests based on the input in the "Guest History" section
    guestHistoryFilterInput.addEventListener('input', () => {
        const guestValue = guestHistoryFilterInput.value.toLowerCase();
        const filteredGuests = allGuests.filter(guest =>
            guest.guestName.toLowerCase().includes(guestValue)
        );
        showGuestHistory(filteredGuests);
    });

     // Filter guests based on the selected month
        monthFilterInput.addEventListener('change', () => {
            const monthValue = parseInt(monthFilterInput.value);
            const filteredGuests = allGuests.filter(guest => {
                if (monthValue === 0) return true; // Show all guests
                const checkInMonth = new Date(guest.checkInDate).getMonth() + 1;
                return checkInMonth === monthValue;
            });
            showGuestHistory(filteredGuests);
        });

    // Fetch initial data
    fetchCheckedInGuests();
    fetchGuestHistory();
});

// Handle guest check-out
async function checkOutGuest(guestId) {
    console.log(`Attempting to check out guest with ID: ${guestId}`);
    if (confirm('Are you sure you want to check out this guest?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/guests/check-out/${guestId}`, {
                method: 'PATCH',
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
                alert('Guest checked out successfully!');
                location.reload(); // Reload to update the guest list
            } else {
                alert(`Check-out failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during check-out:', error);
            alert('An error occurred while processing the check-out. Please try again later.');
        }
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    // Elements
    const checkedInGuestCount = document.getElementById('checkedInGuestCount');
    const availableRoomCount = document.getElementById('availableRoomCount');
    const reservedRoomCount = document.getElementById('reservedRoomCount');
    const activityBookingCount = document.getElementById('activityBookingCount');
    const appointmentCount = document.getElementById('consultancyAppointmentCount');
    const roomBookingCount = document.getElementById('roomBookingCount');

    // Fetch checked-in guests
    async function fetchCheckedInGuests() {
        try {
            const response = await fetch('http://localhost:5000/api/guests/checked-in');
            if (!response.ok) {
                throw new Error('Failed to fetch checked-in guests');
            }
            const guests = await response.json();
            checkedInGuestCount.textContent = guests.length;  // Update the count
        } catch (error) {
            console.error('Error fetching checked-in guests:', error);
        }
    }

    // Fetch available rooms
    async function fetchAvailableRooms() {
        try {
            const response = await fetch('http://localhost:5000/api/rooms');
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const rooms = await response.json();
            const availableRooms = rooms.filter(room => room.status === 'Available');
            availableRoomCount.textContent = availableRooms.length;  // Update the count
        } catch (error) {
            console.error('Error fetching available rooms:', error);
        }
    }

    // Fetch reserved rooms
    async function fetchReservedRooms() {
        try {
            const response = await fetch('http://localhost:5000/api/rooms');
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const rooms = await response.json();
            const reservedRooms = rooms.filter(room => room.status === 'reserved');
            reservedRoomCount.textContent = reservedRooms.length;  // Update the count
        } catch (error) {
            console.error('Error fetching reserved rooms:', error);
        }
    }

    // Fetch activity bookings
    async function fetchActivityBookings() {
        try {
            const response = await fetch('http://localhost:5000/api/activity/bookings');
            if (!response.ok) {
                throw new Error('Failed to fetch activity bookings');
            }
            const bookings = await response.json();
            activityBookingCount.textContent = bookings.length;  // Update the count
        } catch (error) {
            console.error('Error fetching activity bookings:', error);
        }
    }

    // Fetch consultancy appointments
    async function fetchConsultancyAppointments() {
        try {
            const response = await fetch('http://localhost:5000/api/appointments');
            if (!response.ok) {
                throw new Error('Failed to fetch consultancy appointments');
            }
            const appointments = await response.json();
            appointmentCount.textContent = appointments.length;  // Update the count
        } catch (error) {
            console.error('Error fetching consultancy appointments:', error);
        }
    }

    // Fetch room bookings
    async function fetchRoomBookings() {
        try {
            const response = await fetch('http://localhost:5000/api/roomBooking');
            if (!response.ok) {
                throw new Error('Failed to fetch room bookings');
            }
            const bookings = await response.json();
            roomBookingCount.textContent = bookings.length;  // Update the count
        } catch (error) {
            console.error('Error fetching room bookings:', error);
        }
    }

    // Initialize the data on page load
    fetchCheckedInGuests();
    fetchAvailableRooms();
    fetchReservedRooms();
    fetchActivityBookings();
    fetchConsultancyAppointments();
    fetchRoomBookings();
});

//////////////////////////////////////// Fetch user data from localStorage and populate profile details //////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));  // Get user object from localStorage

    if (user) {
        // Populate user details dynamically
        document.getElementById('userFullName').textContent = `${user.first_name} ${user.last_name}`; // Full name
        document.getElementById('userPosition').innerHTML = `<i class="fas fa-user-tag"></i> ${user.position || 'N/A'}`;  // Position
        document.getElementById('userEmail').innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`;  // Email
        document.getElementById('userPhone').innerHTML = `<i class="fas fa-phone"></i> ${user.phone || 'Not available'}`;  // Phone number

        // Update profile picture if available
        if (user.profilePic) {
            document.getElementById('profileImage').src = user.profilePic;  // Update the profile image source
        } 
    }
});






