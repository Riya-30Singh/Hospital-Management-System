
// Select HTML elements
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const doctorSearch = document.getElementById("doctorSearch");
const doctorCards = document.querySelectorAll(".doctor-card");
const noResults = document.getElementById("noResults");

const appointmentForm = document.getElementById("appointmentForm");
const doctorSelect = document.getElementById("doctorSelect");
const appointmentDate = document.getElementById("appointmentDate");

const bookingList = document.getElementById("bookingList");
const formMessage = document.getElementById("formMessage");


// 1. Mobile Navigation
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});


// 2. Search Doctors
doctorSearch.addEventListener("input", () => {

    const searchValue = doctorSearch.value.toLowerCase().trim();

    let visibleCount = 0;

    doctorCards.forEach(card => {

        const doctorName = card.querySelector("h3").textContent.toLowerCase();
        const speciality = card.querySelector(".speciality").textContent.toLowerCase();

        if (
            doctorName.includes(searchValue) ||
            speciality.includes(searchValue)
        ) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    noResults.hidden = visibleCount !== 0;
});


// 3. Set Minimum Appointment Date to Today
function getLocalDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

appointmentDate.min = getLocalDate();


// 4. Book from Doctor Card
document.querySelectorAll(".book-doctor").forEach(button => {

    button.addEventListener("click", () => {

        const selectedDoctor = button.dataset.doctor;

        doctorSelect.value = selectedDoctor;

        document.getElementById("appointments").scrollIntoView({
            behavior: "smooth"
        });
    });
});


// 5. Get Saved Appointments from Local Storage
let appointments = JSON.parse(
    localStorage.getItem("appointments")
) || [];


// 6. Save Appointments
function saveAppointments() {

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );
}


// 7. Display Appointments
function displayAppointments() {

    bookingList.replaceChildren();

    if (appointments.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No appointments booked yet.";

        bookingList.appendChild(emptyMessage);

        return;
    }

    appointments.forEach(appointment => {

        const card = document.createElement("div");
        card.className = "booking-card";

        const details = document.createElement("div");

        const patientHeading = document.createElement("h3");
        patientHeading.textContent = appointment.name;

        const doctor = document.createElement("p");
        doctor.textContent = "Doctor: " + appointment.doctor;

        const date = document.createElement("p");
        date.textContent = "Date: " + appointment.date;

        const time = document.createElement("p");
        time.textContent = "Time: " + appointment.time;

        const email = document.createElement("p");
        email.textContent = "Email: " + appointment.email;

        const cancelButton = document.createElement("button");
        cancelButton.className = "cancel-btn";
        cancelButton.textContent = "Cancel Appointment";

        cancelButton.addEventListener("click", () => {
            cancelAppointment(appointment.id);
        });

        details.append(
            patientHeading,
            doctor,
            date,
            time,
            email
        );

        card.append(details, cancelButton);

        bookingList.appendChild(card);
    });
}


// 8. Cancel Appointment
function cancelAppointment(id) {

    const confirmed = confirm(
        "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    appointments = appointments.filter(
        appointment => appointment.id !== id
    );

    saveAppointments();
    displayAppointments();
}


// 9. Handle Appointment Form Submission
appointmentForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = document.getElementById("patientName").value.trim();
    const email = document.getElementById("patientEmail").value.trim();
    const phone = document.getElementById("patientPhone").value.trim();
    const doctor = doctorSelect.value;
    const date = appointmentDate.value;
    const time = document.getElementById("appointmentTime").value;
    const reason = document.getElementById("reason").value.trim();

    // Validate appointment date
    if (date < getLocalDate()) {

        formMessage.style.color = "red";
        formMessage.textContent = "Please select today or a future date.";

        return;
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {

        formMessage.style.color = "red";
        formMessage.textContent = "Please enter a valid 10-digit phone number.";

        return;
    }

    // Create Appointment Object
    const newAppointment = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        doctor: doctor,
        date: date,
        time: time,
        reason: reason
    };

    // Add appointment to array
    appointments.push(newAppointment);

    // Save to Local Storage
    saveAppointments();

    // Display updated appointments
    displayAppointments();

    // Show confirmation
    formMessage.style.color = "#087e8b";
    formMessage.textContent =
        "Your appointment request has been saved successfully!";

    // Reset form
    appointmentForm.reset();

    // Scroll to booking list
    document.getElementById("myAppointments").scrollIntoView({
        behavior: "smooth"
    });
});


// 10. Display Existing Appointments on Page Load
displayAppointments();
