// Magayana 1.0

// Bug Tracker
// ************
//  - The most recent 'journey' doesn't show up in the list when saved.

// To-Do
// ************
// - Add Favicons
// - Fix Bugs in Bug Tracker
// - Brainstorm some extra features
// - Push to Web Store?

document.addEventListener('DOMContentLoaded', function() {
    let openRequest = indexedDB.open("magayana", 1);

    openRequest.onupgradeneeded = function() {
        let db = openRequest.result;

        if (!db.objectStoreNames.contains("sites")) { 
            let magayana = db.createObjectStore("sites", {autoIncrement: true});
            magayana.createIndex("journey_idx", "journeyName");
        }
    };

    openRequest.onsuccess = function() {
        const addTabs = document.getElementById('add');
        init(openRequest);

        waitForElm('p').then(() => {
            const links = document.querySelectorAll('p');

            for (const element of links) {
                element.addEventListener('click', function() {
                    openlinks(this.id, openRequest);
                    
                });
            }
        });

        addTabs.addEventListener('click', function() {
            const journeyName = document.getElementById('journeyName').value;
            save(openRequest, journeyName);         
        });  

    };
});

// ***************
// Functions
// ***************
// Deletes Items in Journey
function deleteJourney(id, openRequest) {
    let db = openRequest.result;
    let transaction = db.transaction("sites", 'readwrite');
    let siteObject = transaction.objectStore("sites");
    let index = siteObject.index("journey_idx");
    let request = index.openCursor(id);

    request.onsuccess = function(e) {
        let row = e.target.result;
        if(row) {
            row.delete();
            row.continue();
        }
    }
}

// Retrieves & open all Links for an Journey.
function openlinks(id, openRequest) {
    let db = openRequest.result;
    let transaction = db.transaction("sites", "readonly");
    let siteObject = transaction.objectStore("sites");
    let linkIndex = siteObject.index("journey_idx");
    let request = linkIndex.getAll(id);
    
    request.onsuccess = function(e) {
        if (request.result !== undefined) {
            let linkArray =  request.result.map(x => x.link);
            chrome.windows.create({url: linkArray});
            deleteJourney(id, openRequest);
        } else {
            console.log("No Links");
        }
    };
}

// Checks that elements have populated.
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Initialize extension and show all saved journeys.
function init(openRequest) {
    document.getElementById('saved').innerHTML = "";

    let db = openRequest.result;
    let transaction = db.transaction("sites", "readonly");
    let siteObject = transaction.objectStore("sites");
    let sites = siteObject.getAll();

    sites.onsuccess = function(e) {
        let journeyNamesArray =  sites.result.map(x => x.journeyName);
        journeyNamesArray = [...new Set(journeyNamesArray)];
        
        journeyNamesArray.forEach(x => {
            const div = document.createElement("div")
            div.className = 'journey';
            div.innerHTML = `<p id='${x}'>${x}</p>`
            saved.appendChild(div);         
        });          
    }; 
}

// Save Tabs to a journey.
function save(openRequest, journeyName) {
    let db = openRequest.result;

    chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        let transaction = db.transaction("sites", "readwrite");
                  
        for (const element of tabs) {
            let links = transaction.objectStore("sites");

            let request = links.add({
                journeyName: journeyName,
                name: element.title,
                link: element.url
            });

            request.onsuccess = function() {
                console.log("Link succesfully added to store.")
            }

            request.onerror = function() {
                console.log("There was an error", request.error)
            }
        }
    });
}