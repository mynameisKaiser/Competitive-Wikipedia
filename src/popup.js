document.getElementById('startButton').addEventListener('click', () => {
    loadArticles();
});

// Start overall timer in background
chrome.runtime.sendMessage({ action: 'startTimer' });
// Load starting article and target article from storage

document.getElementById('endButton').addEventListener('click', () => {
    // Stop overall timer in background and reset without logging time
    chrome.runtime.sendMessage({ action: 'stopTimer' });

    // Clear timer display
    document.getElementById('timer').innerText = `Overall Time: 0 seconds`;
});

// Load articles from storage and redirect to starting page
function loadArticles() {
    chrome.storage.local.get(['start-page', 'end-page'], (result) => {
        const startPage = result['start-page'];
        const endPage = result['end-page'];

        if (startPage && endPage) {
            document.getElementById('article-info').innerHTML =
                `<p>Starting Article: <a href="${startPage}" target="_blank">${startPage}</a></p>
                 <p>Target Article: <a href="${endPage}" target="_blank">${endPage}</a></p>`;

            // Check if we are on the starting page or redirect to it
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const currentTab = tabs[0];

                if (currentTab.url !== startPage) {
                    // Redirect to starting page immediately
                    chrome.tabs.update(currentTab.id, { url: startPage });
                } else {
                    // Start timer if already on starting page
                    chrome.runtime.sendMessage({ action: 'startTimer' });
                    updateTimerDisplay(); // Update display immediately if on starting page
                }
            });
        } else {
            console.error("Start or end page is not set.");
        }
    });
}

// Function to update timer display based on stored elapsed time
function updateTimerDisplay() {
    // Clear any existing instance to avoid multiple instances running
    clearInterval(window.timerInterval);

    // Set a new interval to update the timer display
    window.timerInterval = setInterval(() => {
        chrome.storage.local.get('elapsedTime', (data) => {
            const elapsed = data.elapsedTime || 0; // Default to 0 if not set
            document.getElementById('timer').innerText = `Overall Time: ${elapsed} seconds`;
            console.log(`Timer updated: ${elapsed} seconds`); // Debug log to confirm updates
        });
    }, 1000);
}



// Check for end article every second while on a Wikipedia page
function checkForEndArticle() {
    chrome.storage.local.get(['end-page'], (result) => {
        const endPage = result['end-page'];

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentUrl = tabs[0].url;

            if (currentUrl === endPage) {
                // Log elapsed time when reaching the ending article
                chrome.runtime.sendMessage({ action: 'logElapsedTime' });
                alert("You've reached the target article!");
            }
        });
    });
}

// Check for end article every second while on a Wikipedia page
setInterval(checkForEndArticle, 1000);

// Load past runs when the popup opens (implement this function if needed)
function loadPastRuns() {
    // Implement loading past runs logic here if needed.
}
