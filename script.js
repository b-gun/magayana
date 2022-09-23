//TODO
// Pull all from object store and populate list in extension window.
    //  Journey Div gets populated with names
    //  - Need to remove all divs from journey before re-populating.
    //  - (Bug) The most recent 'journey' doesn't show up in the list when saved.

// Restore all tabs from a 'journey' in extension window.
    // Add links to each element in journey div.
    // On click -> Open links in new window.

        
let urlArray = [];

document.addEventListener('DOMContentLoaded', function() {
    const addTabs = document.getElementById('add');

    addTabs.addEventListener('click', function() {
        const journeyName = document.getElementById('journeyName').value;
        let openRequest = indexedDB.open("magayana", 1);

        openRequest.onupgradeneeded = function() {
            let db = openRequest.result;

            if (!db.objectStoreNames.contains("sites")) { 
                db.createObjectStore("sites", {autoIncrement: true}); 
            }
        };

        openRequest.onsuccess = function() {
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

            let transaction = db.transaction("sites", "readonly");
            let siteObject = transaction.objectStore("sites");
            let sites = siteObject.getAll();

            sites.onsuccess = function(event) {
                linkArray = sites.result;
                let journeyNamesArray = linkArray.map(x => x.journeyName);
                journeyNamesArray = [...new Set(journeyNamesArray)];

                journeyNamesArray.forEach(x => {
                    const div = document.createElement("div")
                    div.className = 'journey';
                    div.innerHTML = x;
                    document.getElementById('saved').appendChild(div);
                });                
            };
        }
    });
})




