// DOM Elements
const subjectForm = document.getElementById('subjectForm');
const subjectsList = document.getElementById('subjectsList');
const clearAllBtn = document.getElementById('clearAllBtn');

init();

function init() {
    loadSubjects();
    updateStats();

    // Event listeners
    subjectForm.addEventListener('submit', addSubject);
    clearAllBtn.addEventListener('click', clearAll);
}

// Add new subject
function addSubject(e) {
    e.preventDefault();

    const subject = {
        name: document.getElementById('subjectName').value,
        studyHours: document.getElementById('studyHours').value,
        deadline: document.getElementById('deadline').value,
        priority: document.getElementById('priority').value
    };

    StorageManager.addSubject(subject);
    subjectForm.reset();
    loadSubjects();
    updateStats();
}

// Load and display all subjects
function loadSubjects() {
    const subjects = StorageManager.getAllSubjects();

    if (subjects.length === 0) {
        subjectsList.innerHTML = '<p class="empty-state">No subjects added yet!</p>';
        return;
    }

    // Sort by deadline
    subjects.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Display subjects
    subjectsList.innerHTML = subjects.map(subject => `
        <div class="subject-card priority-${subject.priority}">
            <div class="card-header">
                <h3>${subject.name}</h3>
                <span class="priority-badge ${subject.priority}">${subject.priority}</span>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <span>Study Hours:</span>
                    <span>${subject.studyHours} hrs/week</span>
                </div>
                <div class="info-row">
                    <span>Deadline:</span>
                    <span>${formatDate(subject.deadline)}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-small btn-delete" onclick="deleteSubject('${subject.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete a subject
function deleteSubject(id) {
    if (confirm('Delete this subject?')) {
        StorageManager.deleteSubject(id);
        loadSubjects();
        updateStats();
    }
}

// Clear all subjects
function clearAll() {
    if (confirm('Delete all subjects?')) {
        StorageManager.clearAll();
        loadSubjects();
        updateStats();
    }
}

// Update statistics
function updateStats() {
    const subjects = StorageManager.getAllSubjects();

    document.getElementById('totalSubjects').textContent = subjects.length;

    const totalHours = subjects.reduce((sum, s) => sum + parseInt(s.studyHours), 0);
    document.getElementById('totalHours').textContent = totalHours;

    const upcoming = subjects.filter(s => {
        const days = Math.ceil((new Date(s.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return days >= 0 && days <= 7;
    }).length;
    document.getElementById('upcomingDeadlines').textContent = upcoming;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
