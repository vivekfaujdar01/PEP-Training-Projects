// Schedule Manager - Handles all schedule operations
const ScheduleManager = {
    // Get all schedules from localStorage
    getSchedules() {
        return JSON.parse(localStorage.getItem('schedules') || '[]');
    },

    // Add a new schedule with auto-generated ID
    addSchedule(schedule) {
        const schedules = this.getSchedules();
        schedule.id = Date.now().toString();
        schedules.push(schedule);
        localStorage.setItem('schedules', JSON.stringify(schedules));
        return schedule;
    },

    // Delete a schedule by ID
    deleteSchedule(id) {
        const schedules = this.getSchedules().filter(s => s.id !== id);
        localStorage.setItem('schedules', JSON.stringify(schedules));
    },

    // Check if a new schedule conflicts with existing ones
    hasConflict(day, startTime, endTime) {
        return this.getSchedules().some(s => {
            if (s.day !== day) return false;
            const newStart = this.timeToMinutes(startTime);
            const newEnd = this.timeToMinutes(endTime);
            const existingStart = this.timeToMinutes(s.startTime);
            const existingEnd = this.timeToMinutes(s.endTime);
            // Check if time ranges overlap
            return newStart < existingEnd && newEnd > existingStart;
        });
    },

    // Convert time string (HH:MM) to minutes for comparison
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
};

// DOM Elements
const scheduleForm = document.getElementById('scheduleForm');
let currentView = 'daily'; // Track current view (daily or weekly)

// Initialize schedule page
function initSchedule() {
    loadSubjectOptions();
    renderSchedule();
    scheduleForm.addEventListener('submit', addSchedule);
    document.getElementById('dailyViewBtn').addEventListener('click', () => switchView('daily'));
    document.getElementById('weeklyViewBtn').addEventListener('click', () => switchView('weekly'));
}

// Load available subjects into the dropdown
function loadSubjectOptions() {
    const subjects = StorageManager.getAllSubjects();
    const scheduleSubject = document.getElementById('scheduleSubject');
    scheduleSubject.innerHTML = '<option value="">Select Subject</option>' +
        subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
}

// Add a new schedule from form data
function addSchedule(e) {
    e.preventDefault();
    const day = document.getElementById('scheduleDay').value;
    const start = document.getElementById('startTime').value;
    const end = document.getElementById('endTime').value;

    // Validate that end time is after start time
    if (start >= end) {
        alert('End time must be after start time!');
        return;
    }

    // Check for time conflicts
    if (ScheduleManager.hasConflict(day, start, end)) {
        alert('Time conflict detected! This slot overlaps with an existing schedule.');
        return;
    }

    // Add the schedule
    ScheduleManager.addSchedule({
        subject: document.getElementById('scheduleSubject').value,
        day,
        startTime: start,
        endTime: end
    });

    scheduleForm.reset();
    renderSchedule();
}

// Switch between daily and weekly view
function switchView(view) {
    currentView = view;
    document.getElementById('dailyViewBtn').classList.toggle('active', view === 'daily');
    document.getElementById('weeklyViewBtn').classList.toggle('active', view === 'weekly');
    renderSchedule();
}

// Render the schedule based on current view
function renderSchedule() {
    currentView === 'daily' ? renderDailyView() : renderWeeklyView();
}

// Render daily view (shows only today's schedule)
function renderDailyView() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySchedules = ScheduleManager.getSchedules()
        .filter(s => s.day === today)
        .sort((a, b) => ScheduleManager.timeToMinutes(a.startTime) - ScheduleManager.timeToMinutes(b.startTime));

    document.getElementById('scheduleView').innerHTML = todaySchedules.length === 0
        ? `<div class="empty-schedule"><p>No schedules for today (${today})</p></div>`
        : `<div class="daily-view">
            <h3>${today}</h3>
            <div class="schedule-list">
                ${todaySchedules.map(s => `
                    <div class="schedule-item">
                        <div class="schedule-time">${formatTime(s.startTime)} - ${formatTime(s.endTime)}</div>
                        <div class="schedule-subject">${s.subject}</div>
                        <button class="btn-delete-schedule" onclick="deleteSchedule('${s.id}')">×</button>
                    </div>
                `).join('')}
            </div>
        </div>`;
}

// Render weekly view (shows all 7 days)
function renderWeeklyView() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedules = ScheduleManager.getSchedules();

    document.getElementById('scheduleView').innerHTML = `
        <div class="weekly-view">
            ${days.map(day => {
        const daySchedules = schedules
            .filter(s => s.day === day)
            .sort((a, b) => ScheduleManager.timeToMinutes(a.startTime) - ScheduleManager.timeToMinutes(b.startTime));

        return `
                    <div class="day-column">
                        <h4>${day}</h4>
                        <div class="day-schedules">
                            ${daySchedules.length === 0
                ? '<p class="no-schedule">No classes</p>'
                : daySchedules.map(s => `
                                    <div class="schedule-item-small">
                                        <div class="time-small">${formatTime(s.startTime)}</div>
                                        <div class="subject-small">${s.subject}</div>
                                        <button class="btn-delete-small" onclick="deleteSchedule('${s.id}')">×</button>
                                    </div>
                                `).join('')
            }
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// Delete a schedule with confirmation
function deleteSchedule(id) {
    if (confirm('Delete this schedule?')) {
        ScheduleManager.deleteSchedule(id);
        renderSchedule();
    }
}

// Format 24-hour time to 12-hour format with AM/PM
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const displayHour = h % 12 || 12; // Convert 0 to 12 for midnight
    return `${displayHour}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedule);
} else {
    initSchedule();
}
