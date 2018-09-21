// Create context menu
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
}); 


// Disable on chrome settings pages
chrome.tabs.onUpdated.addListener(function() {
    chrome.tabs.getSelected(null, function(tab){
        if (tab.url.startsWith("chrome://")){
            console.log("true");
            chrome.browserAction.disable();
        } else {
            chrome.browserAction.enable();
        }
    });
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