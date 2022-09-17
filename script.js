// Notes

urlArray = [];

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('add');

    button.addEventListener('click', function() {
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
            for (let i = 0; i < tabs.length; i++) {
                urlArray.push(
                    `${tabs[i].title}: ${tabs[i].url}`
                )
            }

            chrome.storage.sync.set({"savedLinks": urlArray}, function() {});
        });
    });
})

// This command shows what was saved to sync data 
// Cause Google doesn't want to let you log it in the inspect tool it in extensions??
// chrome.storage.sync.get(null, function (data) { console.info(data) });
// This command lets you clear the sync storage
// chrome.storage.local.clear()