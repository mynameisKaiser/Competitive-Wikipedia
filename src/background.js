let timerInterval;
let startTime = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'startTimer':
            if (!startTime) {
                startTime = Date.now();
                timerInterval = setInterval(() => {
                    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                    chrome.storage.local.set({ elapsedTime });
                }, 1000);
            }
            break;
        case 'stopTimer':
            clearInterval(timerInterval);
            startTime = null;
            chrome.storage.local.remove('elapsedTime');
            break;
        case 'getElapsedTime':
            sendResponse({ elapsedTime: Math.floor((Date.now() - startTime) / 1000) });
            break;
        case 'redirectToStartPage':
            chrome.tabs.update(sender.tab.id, { url: message.startPage });
            break;
    }
});
