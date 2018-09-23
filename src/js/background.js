// Create context menu
// TODO: Add option to paste to ingredients -> save text & inject modal
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": "Copy to BeautyGuru",
        "contexts": ["selection"],
        "id": "beautyguru"
    });
});

// Save selection to storage
chrome.contextMenus.onClicked.addListener(function(info) {
    if(info.menuItemId === "beautyguru") {
        let text = info.selectionText;
        chrome.storage.sync.set({selection: text});
    }
});

// Clear on change tabs
chrome.tabs.onActivated.addListener(function() {
    chrome.storage.sync.clear();
    setBrowserAction();
}); 

// Disable on chrome settings pages
chrome.tabs.onUpdated.addListener(function() {
    setBrowserAction();
}); 

/**
 * Disable browserAction on chrome settings pages, enable otherwise
 */
function setBrowserAction() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        if (tabs[0] != undefined && tabs[0].url.startsWith("chrome://")) {
            chrome.browserAction.disable();
        } else {
            chrome.browserAction.enable();
        }
    });
}