// Navigation functionality for Study Planner

document.addEventListener('DOMContentLoaded', function () {
    // Main navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    // Update active state on click
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
});
