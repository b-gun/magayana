// Notes

// Using IndexedDB (Not Finished)
let urlArray = [];

document.addEventListener('DOMContentLoaded', function() {
    const addTabs = document.getElementById('add');

    addTabs.addEventListener('click', function() {
        const journeyName = document.getElementById('journeyName').value;
        let openRequest = indexedDB.open("magayana", 1);

        openRequest.onupgradeneeded = function() {
            let db = openRequest.result;
            if (!db.objectStoreNames.contains(journeyName)) { 
                db.createObjectStore(journeyName, {keyPath: 'id'}); 
            }
        };

        openRequest.onsuccess = function() {
            let db = openRequest.result;
            
            chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
                let transaction = db.transaction(journeyName, "readwrite");
                
                
                for (let i = 0; i < tabs.length; i++) {
                    let links = transaction.objectStore(journeyName);

                    let request = links.add({
                        id: i,
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

        //TODO
        // Pull all from object store and populate list in extension window.
        // Restore all tabs from a 'journey' in extension window.

    });
})

// Data Structure should look something like this 
// const links = {
//     "AI": ['https://hynek.me/articles/productive-fruit-fly-programmer/',
//         'https://mail.google.com/mail/u/0/#inbox'],
//     "Mechanical Keyboards": ['https://hynek.me/articles/productive-fruit-fly-programmer/',
//         'https://mail.google.com/mail/u/0/#inbox'],
//     "Something Else": ['https://hynek.me/articles/productive-fruit-fly-programmer/',
//         'https://mail.google.com/mail/u/0/#inbox']
// };
