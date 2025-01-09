document.getElementById('startButton').addEventListener('click', () => {
    // Start overall timer in background
    chrome.runtime.sendMessage({ action: 'startTimer' });

    // Load starting article and target article from storage
    loadArticles();
});

document.getElementById('endButton').addEventListener('click', () => {
    // Stop overall timer in background
    chrome.runtime.sendMessage({ action: 'stopTimer' });

    // Clear timer display
    document.getElementById('timer').innerText = `Overall Time: 0 seconds`;
});

function loadArticles() {
    chrome.storage.local.get(['start-page', 'end-page'], (result) => {
        const startPage = result['start-page'];
        const endPage = result['end-page'];

        if (startPage && endPage) {
            document.getElementById('article-info').innerHTML =
                `<p>Starting Article: <a href="${startPage}" target="_blank">${startPage}</a></p>
                 <p>Target Article: <a href="${endPage}" target="_blank">${endPage}</a></p>`;

            // Redirect to the starting page after displaying articles
            chrome.runtime.sendMessage({ action: 'redirectToStartPage', startPage });
        } else {
            console.error("Start or end page is not set.");
        }
    });
}

// Load past runs when the popup opens
loadPastRuns();
