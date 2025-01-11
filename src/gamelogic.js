class Game {
    constructor() {
        this.startPage = null;
        this.endPage = null;

        // Generate random pages when the game is initialized
        this.generateRandomPages();
    }

    generateRandomPages() {
        fetch("https://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=2&origin=*")
            .then(response => response.json())
            .then(data => {
                this.startPage = `https://en.wikipedia.org/wiki/${data.query.random[0].title.replace(/ /g, "_")}`;
                this.endPage = `https://en.wikipedia.org/wiki/${data.query.random[1].title.replace(/ /g, "_")}`;

                // Store pages in local storage for later access
                chrome.storage.local.set({
                    'start-page': this.startPage,
                    'end-page': this.endPage
                });

                console.log(`Starting Article: ${this.startPage}`);
                console.log(`Target Article: ${this.endPage}`);
            })
            .catch(error => console.error('Error fetching random pages:', error));
    }
}

// Initialize the game instance globally so it can be accessed by popup.js.
const newGame = new Game();
