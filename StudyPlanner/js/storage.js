// Storage Manager - Handles all localStorage operations for subjects
const StorageManager = {
    // Get all subjects from localStorage
    getAllSubjects() {
        const data = localStorage.getItem('studyPlannerSubjects');
        return data ? JSON.parse(data) : [];
    },

    // Save subjects array to localStorage
    saveSubjects(subjects) {
        localStorage.setItem('studyPlannerSubjects', JSON.stringify(subjects));
    },

    // Add a new subject with auto-generated ID
    addSubject(subject) {
        const subjects = this.getAllSubjects();
        subject.id = Date.now().toString();
        subjects.push(subject);
        this.saveSubjects(subjects);
    },

    // Delete a subject by its ID
    deleteSubject(id) {
        const subjects = this.getAllSubjects().filter(s => s.id !== id);
        this.saveSubjects(subjects);
    },

    // Clear all subjects from localStorage
    clearAll() {
        localStorage.removeItem('studyPlannerSubjects');
    }
};
