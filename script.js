// Notes

urlArray = [];

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('add');

    button.addEventListener('click', function() {
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
            for (let i = 0; i < tabs.length; i++) {
                urlArray.push(
                    `<li>${tabs[i].title}: ${tabs[i].url}</li>`
                )
            }

            chrome.storage.sync.set({"savedLinks": urlArray}, function() {});
        });
    });
})

// This command shows what was saved to sync data 
// Cause Google doesn't want to let you do it in extensions??
// chrome.storage.sync.get(null, function (data) { console.info(data) });