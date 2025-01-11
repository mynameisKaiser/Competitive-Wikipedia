let timerInterval;
let startTime = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'startTimer':
            if (!startTime) {
                startTime = Date.now();
                timerInterval = setInterval(() => {
                    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                    chrome.storage.local.set({ elapsedTime }); // Store elapsed time
                }, 1000);
            }
            break;
        case 'stopTimer':
            clearInterval(timerInterval);
            startTime = null;
            chrome.storage.local.remove('elapsedTime'); // Reset stored time
            break;
        case 'logElapsedTime':
            const loggedTime = Math.floor((Date.now() - startTime) / 1000);
            chrome.storage.local.set({ loggedTime }); // Log time when target article is reached
            break;
    }
});
