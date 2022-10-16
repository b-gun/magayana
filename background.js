// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    // let openRequest = indexedDB.open("magayana", 1);

    // openRequest.onupgradeneeded = function() {
    //     let db = openRequest.result;

    //     if (!db.objectStoreNames.contains("sites")) { 
    //         db.createObjectStore("sites", {autoIncrement: true}); 
    //     }
    // };

    // openRequest.onsuccess = function() {
    //     console.log(openRequest);
    //     init(openRequest);
    // };
// });


// function init(openRequest) {
//     let db = openRequest.result;
//     let transaction = db.transaction("sites", "readonly");
//     let siteObject = transaction.objectStore("sites");
//     let sites = siteObject.getAll();
//     sites.onsuccess = function(e) {
//         let journeyNamesArray =  e.result.map(x => x.journeyName);
//         journeyNamesArray = [...new Set(journeyNamesArray)];
        
//         chrome.runtime.sendMessage(journeyNamesArray);         
//     } 
// }