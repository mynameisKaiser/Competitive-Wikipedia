chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'redirectToStartPage') {
        window.location.href = message.startPage; // Redirect current tab to starting page
    }
});


