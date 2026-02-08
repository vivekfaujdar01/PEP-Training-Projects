const StorageManager = {
    // Get all subjects from LocalStorage
    getAllSubjects() {
        const data = localStorage.getItem('studyPlannerSubjects');
        return data ? JSON.parse(data) : [];
    },

    // Save all subjects to LocalStorage
    saveSubjects(subjects) {
        localStorage.setItem('studyPlannerSubjects', JSON.stringify(subjects));
    },

    // Add a new subject
    addSubject(subject) {
        const subjects = this.getAllSubjects();
        subject.id = Date.now().toString();
        subjects.push(subject);
        this.saveSubjects(subjects);
    },

    // Delete a subject by ID
    deleteSubject(id) {
        const subjects = this.getAllSubjects();
        const filtered = subjects.filter(s => s.id !== id);
        this.saveSubjects(filtered);
    },

    // Clear all subjects
    clearAll() {
        localStorage.removeItem('studyPlannerSubjects');
    }
};
