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
            document.getElementById('saved').innerText = urlArray.toString();
        });
    });
})