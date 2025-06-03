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

//////////////////////////////////////// Fetch room data from the API and populate the table //////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
    const roomTableBody = document.getElementById('roomTableBody');
    const roomTypeFilter = document.getElementById('roomTypeFilter');
    let rooms = []; // Declare rooms in a higher scope

    try {
        // Fetch all rooms from the API
        const response = await fetch('https://shaminagroupltd.onrender.com/api/rooms');
        rooms = await response.json(); // Assign rooms to the outer scoped variable

        // Populate table with room data
        roomTableBody.innerHTML = '';
        rooms.forEach(room => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.roomNumber}</td>
                <td>${room.roomType}</td>
                <td>${room.status}</td>
            `;
            roomTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching room data:', error);
        roomTableBody.innerHTML = `<tr><td colspan="3" class="text-center">Failed to load room data</td></tr>`;
    }

    // Filtering functionality
    roomTypeFilter.addEventListener('change', () => {
        const selectedType = roomTypeFilter.value;

        // Filter rooms based on selected type
        const filteredRooms = rooms.filter(room =>
            selectedType ? room.roomType === selectedType : true
        );

        // Clear and repopulate the table with filtered rooms
        roomTableBody.innerHTML = '';
        filteredRooms.forEach(room => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.roomNumber}</td>
                <td>${room.roomType}</td>
                <td>${room.status}</td>
            `;
            roomTableBody.appendChild(row);
        });
    });
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
        const response = await fetch('https://shaminagroupltd.onrender.com/api/rooms');
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
            const response = await fetch('https://shaminagroupltd.onrender.com/api/rooms/check-in', {
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
            const response = await fetch('https://shaminagroupltd.onrender.com/api/guests/checked-in');
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
            const response = await fetch('https://shaminagroupltd.onrender.com/api/guests/history');
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
            const response = await fetch(`https://shaminagroupltd.onrender.com/api/guests/check-out/${guestId}`, {
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

//////////////////////////////////////// Handle reservation form submission //////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
    const roomAvailableSelect = document.getElementById('roomAvailable');
    const reservationForm = document.getElementById('reservationForm');
    const reservationTableBody = document.getElementById('reservationTableBody');

    // Fetch available rooms
    async function fetchRooms() {
        try {
            const response = await fetch('https://shaminagroupltd.onrender.com/api/rooms');
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const rooms = await response.json();
            populateRoomDropdown(rooms); // Populate the room dropdown
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    }

    // Populate room options in the dropdown
    function populateRoomDropdown(rooms) {
        rooms.forEach(room => {
            if (room.status === 'Available') {
                const option = document.createElement('option');
                option.value = room._id;
                option.textContent = `Room ${room.roomNumber} - ${room.roomType}`;
                roomAvailableSelect.appendChild(option);
            }
        });
    }

    // Handle form submission for reservation
    reservationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const guestName = document.getElementById('guestName').value;
        const guestContact = document.getElementById('guestContact').value;
        const roomId = document.getElementById('roomAvailable').value;
        const checkInDate = document.getElementById('checkinDate').value;
        const checkOutDate = document.getElementById('checkoutDate').value;

        try {
            const response = await fetch('https://shaminagroupltd.onrender.com/api/reservations/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ guestName, guestContact, roomId, checkInDate, checkOutDate }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Reservation created successfully!');
                fetchRooms(); // Re-fetch rooms to update the dropdown
                loadReservations(); // Reload reservations
            } else {
                alert(data.message || 'Failed to create reservation');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert('Error creating reservation');
        }
    });

    // Fetch and display all reservations
    async function loadReservations() {
        try {
            const response = await fetch('https://shaminagroupltd.onrender.com/api/reservations');
            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }
            const reservations = await response.json();
            displayReservations(reservations);
        } catch (error) {
            console.error('Error loading reservations:', error);
        }
    }

    // Display reservations in the table
    function displayReservations(reservations) {
        reservationTableBody.innerHTML = '';
        reservations.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.guestName}</td>
                <td>${reservation.guestContact}</td>
                <td>Room ${reservation.roomId.roomNumber} - ${reservation.roomId.roomType}</td>
                <td>${formatDate(reservation.checkInDate)}</td>
                <td>${formatDate(reservation.checkOutDate)}</td>
                <td>${reservation.status}</td>
                <td>
                    ${reservation.status === 'reserved' ? `
                        <button class="btn btn-danger" onclick="cancelReservation('${reservation._id}')">Cancel</button>
                    ` : ''}
                </td>
            `;
            reservationTableBody.appendChild(row);
        });
    }

    // Cancel reservation
    async function cancelReservation(reservationId) {
        try {
            const response = await fetch(`https://shaminagroupltd.onrender.com/api/reservations/cancel/${reservationId}`, {
                method: 'PATCH',
            });
            const data = await response.json();
            if (response.ok) {
                alert('Reservation cancelled successfully');
                loadReservations(); // Reload reservations
                fetchRooms(); // Re-fetch rooms to update availability
            } else {
                alert(data.message || 'Failed to cancel reservation');
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('Error cancelling reservation');
        }
    }

    // Initialize
    fetchRooms();
    loadReservations();
});

////////////////////////////////////////////////////// Fetch and display room data //////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
    // Elements
    const checkedInGuestCount = document.getElementById('checkedInGuestCount');
    const availableRoomCount = document.getElementById('availableRoomCount');
    const reservedRoomCount = document.getElementById('reservedRoomCount');
    const roomBookingCount = document.getElementById('roomBookingCount');

    // Fetch checked-in guests
    async function fetchCheckedInGuests() {
        try {
            const response = await fetch('https://shaminagroupltd.onrender.com/api/guests/checked-in');
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
            const response = await fetch('https://shaminagroupltd.onrender.com/api/rooms');
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
            const response = await fetch('https://shaminagroupltd.onrender.com/api/rooms');
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

     // Fetch room bookings
     async function fetchRoomBookings() {
        try {
            const response = await fetch('https://shaminagroupltd.onrender.com/api/roomBooking');
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
    fetchRoomBookings();
});

