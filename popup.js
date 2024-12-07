const searchList = document.getElementById('search-list');
const addEngineBtn = document.getElementById('add-engine-btn');
const engineNameInput = document.getElementById('engine-name');
const engineUrlInput = document.getElementById('engine-url');

const defaultEngines = [
    { name: "Google", url: "https://www.google.com", icon: "icons/google.png" },
    { name: "Bing", url: "https://www.bing.com", icon: "icons/bing.png" },
    { name: "DuckDuckGo", url: "https://www.duckduckgo.com", icon: "icons/duckduckgo.png" },
    { name: "Yahoo", url: "https://www.yahoo.com", icon: "icons/yahoo.png" }
];

function loadEngines() {
    chrome.storage.local.get(['searchEngines'], data => {
        const engines = data.searchEngines || defaultEngines;
        renderEngines(engines);
    });
}

function saveEngines(engines) {
    chrome.storage.local.set({ searchEngines: engines });
}

function renderEngines(engines) {
    searchList.innerHTML = '';
    engines.forEach(engine => {
        const button = document.createElement('button');
        const img = document.createElement('img');
        img.src = engine.icon || 'icons/default.png';
        button.appendChild(img);
        button.appendChild(document.createTextNode(engine.name));
        button.onclick = () => chrome.tabs.create({ url: engine.url });
        searchList.appendChild(button);
    });
}

addEngineBtn.addEventListener('click', () => {
    const name = engineNameInput.value.trim();
    const url = engineUrlInput.value.trim();
    if (name && url) {
        chrome.storage.local.get(['searchEngines'], data => {
            const engines = data.searchEngines || defaultEngines;
            engines.push({ name, url, icon: "icons/default.png" });
            saveEngines(engines);
            renderEngines(engines);
            engineNameInput.value = '';
            engineUrlInput.value = '';
        });
    } else {
        alert("Please provide a valid name and URL!");
    }
});

loadEngines();
