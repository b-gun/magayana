//TODO
// Pull all from object store and populate list in extension window.
    //  - (Bug) The most recent 'journey' doesn't show up in the list when saved.

// Restore all tabs from a 'journey' in extension window.
    // Add links to each element in journey div.
    // On click -> Open links in new window.

// Add ability to delete a journey

// After the top three are done, V1.0 is finished.

document.addEventListener('DOMContentLoaded', function() {
    let openRequest = indexedDB.open("magayana", 1);

    openRequest.onupgradeneeded = function() {
        let db = openRequest.result;

        if (!db.objectStoreNames.contains("sites")) { 
            db.createObjectStore("sites", {autoIncrement: true}); 
        }
    };

    openRequest.onsuccess = function() {
        const addTabs = document.getElementById('add');
        init(openRequest);

        waitForElm('p').then((elm) => {
            const links = document.querySelectorAll('p');

            for (let i = 0; i < links.length; i++) {
                links[i].addEventListener('click', alertClick);
            }
        });

        addTabs.addEventListener('click', function() {
            const journeyName = document.getElementById('journeyName').value;
            save(openRequest, journeyName);
            // chrome.windows.create({url: ['http://www.google.com', 'https://www.theage.com.au/']});             
        });  

    };
});



// ***************
// Functions
// ***************

function alertClick() {
    console.log(this.id); 
}

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
    } 
}

// Save Tabs to a journey.
function save(openRequest, journeyName) {
    let db = openRequest.result;

    chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        let transaction = db.transaction("sites", "readwrite");
                  
        for (let i = 0; i < tabs.length; i++) {
            let links = transaction.objectStore("sites");

            let request = links.add({
                journeyName: journeyName,
                name: tabs[i].title,
                link: tabs[i].url
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