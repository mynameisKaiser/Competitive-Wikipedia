class Game {
    constructor() {
        this.startPage = null;
        this.endPage = null;

        // Fetch random pages when the game is initialized
        this.fetchRandomArticles();
    }

    async fetchRandomArticles() {
        const articles = [];
        let attempts = 0;

        while (articles.length < 2 && attempts < 10) { // Limit attempts to avoid infinite loop
            attempts++;
            const response = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=1&origin=*");
            const data = await response.json();
            const title = data.query.random[0].title;

            // Check if the article is a disambiguation page or a stub
            const isDisambiguationOrStub = await this.checkArticleType(title);

            if (!isDisambiguationOrStub) {
                articles.push(data.query.random[0]); // Add valid article to the list
            }
        }

        if (articles.length < 2) {
            throw new Error("Could not find enough valid articles.");
        }

        // Set start and end pages
        this.startPage = `https://en.wikipedia.org/wiki/${articles[0].title.replace(/ /g, "_")}`;
        this.endPage = `https://en.wikipedia.org/wiki/${articles[1].title.replace(/ /g, "_")}`;

        // Store pages in local storage for later access
        chrome.storage.local.set({
            'start-page': this.startPage,
            'end-page': this.endPage
        });

        console.log(`Starting Article: ${this.startPage}`);
        console.log(`Target Article: ${this.endPage}`);
    }

    async checkArticleType(title) {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageprops&format=json&origin=*`);
        const data = await response.json();

        const pageId = Object.keys(data.query.pages)[0];
        const pageProps = data.query.pages[pageId]?.pageprops;

        // Check for disambiguation or stub properties
        if (pageProps) {
            return pageProps.disambiguation || pageProps.stub; // Return true if it's a disambiguation or stub
        }

        return false; // Not a disambiguation or stub
    }
}

// Initialize the game instance globally so it can be accessed by popup.js.
const newGame = new Game();
