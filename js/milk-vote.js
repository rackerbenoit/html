// Milk Vote Application
// Handles form submission, data storage, and display

const API_URL = 'api.php'; // Update this to your server URL when deployed
const ADMIN_PASSWORD = 'milk';

// Deadline: Friday at noon CST (12:00 PM)

// Get the Monday of the current week (at midnight)
function getMondayOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0); // Set to midnight
    return monday;
}

// Get the Friday noon CST deadline for the current week
function getFridayDeadline() {
    const now = new Date();
    const monday = getMondayOfWeek(now);

    // Friday is 4 days after Monday
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    // Create the deadline at noon on Friday in CST
    // Use toLocaleString to get the date in CST timezone
    const fridayStr = friday.toLocaleDateString('en-US', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    // Parse the date string
    const [month, day, year] = fridayStr.split('/');

    // Create a new date with the CST date at noon
    // This creates the date in the local timezone, but we'll adjust for CST
    const deadline = new Date(`${year}-${month}-${day}T12:00:00`);

    // Get the timezone offset difference between local time and CST
    // CST is UTC-6 (or UTC-5 during CDT)
    const cstDate = new Date(deadline.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    const localDate = new Date(deadline.toLocaleString('en-US'));
    const offset = localDate - cstDate;

    // Adjust the deadline by the offset
    return new Date(deadline.getTime() - offset);
}

// Check if voting is still open (before Friday noon CST)
function isVotingOpen() {
    const now = new Date();
    const deadline = getFridayDeadline();
    return now < deadline;
}

// Update the countdown timer
function updateCountdown() {
    const now = new Date();
    const deadline = getFridayDeadline();
    const diff = deadline - now;

    const countdownEl = document.getElementById('countdown');
    const votingClosedEl = document.getElementById('votingClosed');
    const submitBtn = document.querySelector('.submit-btn');
    const formInputs = document.querySelectorAll('#milkVoteForm input');

    if (diff <= 0) {
        // Voting is closed
        countdownEl.style.display = 'none';
        votingClosedEl.style.display = 'block';
        submitBtn.disabled = true;
        formInputs.forEach(input => input.disabled = true);
        return;
    }

    // Voting is open
    countdownEl.style.display = 'block';
    votingClosedEl.style.display = 'none';
    submitBtn.disabled = false;
    formInputs.forEach(input => input.disabled = false);

    // Calculate time remaining
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update the display
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// API Functions

// Load votes from server
async function loadVotes() {
    try {
        const response = await fetch(`${API_URL}?action=getVotes`);
        const votes = await response.json();
        return Array.isArray(votes) ? votes : [];
    } catch (error) {
        console.error('Error loading votes:', error);
        return [];
    }
}

// Load history from server
async function loadHistory() {
    try {
        const response = await fetch(`${API_URL}?action=getHistory`);
        const history = await response.json();
        return Array.isArray(history) ? history : [];
    } catch (error) {
        console.error('Error loading history:', error);
        return [];
    }
}

// Load last reset date from server
async function loadLastReset() {
    try {
        const response = await fetch(`${API_URL}?action=getLastReset`);
        const data = await response.json();
        return data.lastReset;
    } catch (error) {
        console.error('Error loading last reset:', error);
        return null;
    }
}

// Add a new vote to server
async function addVote(name, gallons) {
    try {
        const vote = {
            name: name,
            gallons: parseFloat(gallons),
            timestamp: new Date().toISOString()
        };

        const response = await fetch(`${API_URL}?action=addVote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vote)
        });

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error adding vote:', error);
        return false;
    }
}

// Add history record to server
async function addToHistory(weekStart, totalGallons, totalVoters) {
    try {
        const historyRecord = {
            weekStart: weekStart,
            totalGallons: totalGallons,
            totalVoters: totalVoters,
            timestamp: new Date().toISOString()
        };

        const response = await fetch(`${API_URL}?action=addHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(historyRecord)
        });

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error adding history:', error);
        return false;
    }
}

// Set last reset date on server
async function setLastReset(date) {
    try {
        const response = await fetch(`${API_URL}?action=setLastReset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lastReset: date })
        });

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error setting last reset:', error);
        return false;
    }
}

// Clear all votes on server
async function clearVotesOnServer(password) {
    try {
        const response = await fetch(`${API_URL}?action=clearVotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password })
        });

        if (response.status === 403) {
            return { success: false, error: 'Invalid password' };
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error clearing votes:', error);
        return { success: false, error: 'Network error' };
    }
}

// Display Functions

// Display all votes
async function displayVotes() {
    const votes = await loadVotes();
    const votesList = document.getElementById('votesList');

    if (votes.length === 0) {
        votesList.innerHTML = '<p class="no-votes">No entries yet this week.</p>';
        return;
    }

    // Sort by name
    votes.sort((a, b) => a.name.localeCompare(b.name));

    votesList.innerHTML = votes.map(vote => `
        <div class="vote-item">
            <span class="voter-name">${escapeHtml(vote.name)}</span>
            <span class="voter-gallons">${vote.gallons} ${vote.gallons === 1 ? 'gallon' : 'gallons'}</span>
        </div>
    `).join('');
}

// Update summary statistics
async function updateSummary() {
    const votes = await loadVotes();
    const totalGallons = votes.reduce((sum, vote) => sum + vote.gallons, 0);
    const totalVoters = votes.length;

    document.getElementById('totalGallons').textContent = totalGallons.toFixed(1);
    document.getElementById('totalVoters').textContent = totalVoters;
}

// Display history
async function displayHistory() {
    const history = await loadHistory();
    const historyList = document.getElementById('historyList');

    if (!historyList) return; // Element not found

    if (history.length === 0) {
        historyList.innerHTML = '<p class="no-history">No history yet. Check back after the first week!</p>';
        return;
    }

    // Display most recent first
    const reversedHistory = [...history].reverse();

    historyList.innerHTML = reversedHistory.map(record => {
        const weekDate = new Date(record.weekStart);
        const formattedDate = weekDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return `
            <div class="history-item">
                <span class="history-date">Week of ${formattedDate}</span>
                <span class="history-gallons">${record.totalGallons.toFixed(1)} gallons</span>
                <span class="history-voters">${record.totalVoters} ${record.totalVoters === 1 ? 'voter' : 'voters'}</span>
            </div>
        `;
    }).join('');
}

// Check if we need to reset votes (if it's a new Monday)
async function shouldResetVotes() {
    const lastReset = await loadLastReset();
    const currentMonday = getMondayOfWeek(new Date());

    if (!lastReset) {
        return true; // First time, reset to start fresh
    }

    const lastResetDate = new Date(lastReset);
    const lastResetMonday = getMondayOfWeek(lastResetDate);

    // If current Monday is after the last reset Monday, it's time to reset
    return currentMonday > lastResetMonday;
}

// Initialize the app
async function initApp() {
    // Check if we need to reset for a new Monday
    if (await shouldResetVotes()) {
        // Save current week's data to history before resetting
        const votes = await loadVotes();
        if (votes.length > 0) {
            const totalGallons = votes.reduce((sum, vote) => sum + vote.gallons, 0);
            const totalVoters = votes.length;
            const lastReset = await loadLastReset();
            const weekStart = lastReset || new Date().toISOString();
            await addToHistory(weekStart, totalGallons, totalVoters);
        }

        // Auto-reset votes (no confirmation needed for Monday reset)
        await clearVotesOnServer('milk');
        await setLastReset(new Date().toISOString());
    }

    await displayVotes();
    await updateSummary();
    await displayHistory();

    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000); // Update every second
}

// Clear all votes (password protected)
async function clearAllVotes() {
    const password = prompt('Enter admin password to clear all entries:');

    if (!password) {
        return; // User cancelled
    }

    if (password !== ADMIN_PASSWORD) {
        alert('Incorrect password. Access denied.');
        return;
    }

    if (confirm('Are you sure you want to clear all entries? This cannot be undone.')) {
        // Save current data to history before clearing
        const votes = await loadVotes();
        if (votes.length > 0) {
            const totalGallons = votes.reduce((sum, vote) => sum + vote.gallons, 0);
            const totalVoters = votes.length;
            const lastReset = await loadLastReset();
            const weekStart = lastReset || new Date().toISOString();
            await addToHistory(weekStart, totalGallons, totalVoters);
        }

        const result = await clearVotesOnServer(password);

        if (result.success) {
            await setLastReset(new Date().toISOString());
            await displayVotes();
            await updateSummary();
            await displayHistory();
            alert('All entries have been cleared successfully.');
        } else {
            alert('Error clearing entries: ' + (result.error || 'Unknown error'));
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Handle form submission
document.getElementById('milkVoteForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Check if voting is still open
    if (!isVotingOpen()) {
        alert('Submissions are closed for this week. The deadline was Friday at noon CST.');
        return;
    }

    const nameInput = document.getElementById('voterName');
    const gallonsInput = document.getElementById('gallons');

    const name = nameInput.value.trim();
    const gallons = gallonsInput.value;

    if (!name || !gallons || gallons < 0) {
        alert('Please enter a valid name and number of gallons.');
        return;
    }

    const success = await addVote(name, gallons);

    if (success) {
        await displayVotes();
        await updateSummary();
        showSuccessMessage();

        // Reset form
        this.reset();
        nameInput.focus();
    } else {
        alert('Error submitting entry. Please try again.');
    }
});

// Handle clear button
document.getElementById('clearVotes').addEventListener('click', clearAllVotes);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
