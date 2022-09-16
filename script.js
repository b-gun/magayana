// Notes
// Need to attach action to button so user can save tabs.

urlArray = [];

chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
    for (let i = 0; i < tabs.length; i++) {
        urlArray.push(
            `<li>${tabs[i].title}: ${tabs[i].url}</li>`
        )
    }
    document.write(urlArray.toString());
});

// chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
//     document.write('<h3>These are your current tabs</h3>');
//     document.write('<ul>');
//     for (let i = 0; i < tabs.length; i++) {
//         document.write(`<li>${tabs[i].title}: ${tabs[i].url}</li>`)
//     }
//     document.write('</ul>')
// });