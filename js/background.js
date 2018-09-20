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
