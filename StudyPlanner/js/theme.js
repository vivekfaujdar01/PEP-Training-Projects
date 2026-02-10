// Theme Manager - Handles dark/light theme switching
const ThemeManager = {
    // Initialize theme on page load from saved preference
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        this.updateToggleButton();
    },

    // Toggle between dark and light theme
    toggle() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateToggleButton();
    },

    // Update the toggle button icon based on current theme
    updateToggleButton() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            const isDark = document.body.classList.contains('dark-theme');
            toggleBtn.textContent = isDark ? 'Light' : 'Dark';
            toggleBtn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    }
};

// Initialize theme when page loads
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
