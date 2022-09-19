// Notes
// Bug: Have to click 'Add Tabs' twice to save the data?

let urlArray = [];

document.addEventListener('DOMContentLoaded', function() {
    const addTabs = document.getElementById('add');
    
    addTabs.addEventListener('click', function() {
        const journeyName = document.getElementById('journeyName').value;
        // Get all Tabs for Current Window
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
            for (let i = 0; i < tabs.length; i++) {
                urlArray.push(`${tabs[i].title}: ${tabs[i].url}`);
            }
        });

        const journeyObject = {}
        journeyObject[document.getElementById('journeyName').value] = urlArray

        chrome.storage.sync.set(journeyObject);
    });
})

// This command shows what was saved to sync data 
// Cause Google doesn't want to let you log it in the inspect tool it in extensions??
// chrome.storage.sync.get(null, function (data) { console.info(data) });
// This command lets you clear the sync storage
// chrome.storage.sync.clear()