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

// Modal close and tab open
chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.message === "openTab") {
            chrome.tabs.query({url: request.url}, function(tabs) { 
                if (tabs.length === 0) {
                    chrome.tabs.create({url: request.url, active: false});
                }
            });
        }
    }
);

/**
 * Disable browserAction on chrome settings pages, enable otherwise
 */
function setBrowserAction() {
    chrome.tabs.getSelected(null, function(tab){
        if (tab.url.startsWith("chrome://")){
            console.log("true");
            chrome.browserAction.disable();
        } else {
            chrome.browserAction.enable();
        }
    });
}