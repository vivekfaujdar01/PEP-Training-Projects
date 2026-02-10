// Update all dashboard statistics and displays
function updateDashboard() {
    const subjects = JSON.parse(localStorage.getItem('studyPlannerSubjects')) || [];
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];

    // Update total subjects count
    document.getElementById('dashTotalSubjects').textContent = subjects.length;

    // Calculate and display total study hours per week
    const totalHours = subjects.reduce((sum, s) => sum + parseInt(s.studyHours || 0), 0);
    document.getElementById('dashTotalHours').textContent = totalHours;

    // Count upcoming deadlines (future dates only)
    const today = new Date();
    const upcomingDeadlines = subjects.filter(s => new Date(s.deadline) >= today).length;
    document.getElementById('dashUpcomingDeadlines').textContent = upcomingDeadlines;

    // Get today's day name and count today's scheduled classes
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[today.getDay()];
    const todaySchedules = schedules.filter(s => s.day === todayName);
    document.getElementById('dashTodaySchedule').textContent = todaySchedules.length;

    // Display high priority subjects (max 3)
    const priorityContainer = document.getElementById('prioritySubjects');
    const highPriority = subjects.filter(s => s.priority?.toLowerCase() === 'high').slice(0, 3);

    priorityContainer.innerHTML = highPriority.length === 0
        ? '<div class="empty-dash">No high priority subjects</div>'
        : highPriority.map(s => `<div class="priority-item"><strong>${s.name}</strong> - ${s.studyHours}h/week</div>`).join('');

    // Display today's schedule
    const todayContainer = document.getElementById('todaySchedule');
    todayContainer.innerHTML = todaySchedules.length === 0
        ? '<div class="empty-dash">No classes scheduled today</div>'
        : todaySchedules.map(s => `<div class="today-item"><strong>${s.subject}</strong><br>${s.startTime} - ${s.endTime}</div>`).join('');
}

// Load dashboard when page is ready
document.addEventListener('DOMContentLoaded', updateDashboard);
