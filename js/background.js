chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": "Copy to BeautyGuru",
        "contexts": ["selection"],
        "id": "beautyguru"
    });
});

chrome.contextMenus.onClicked.addListener(function(info) {
    if(info.menuItemId === "beautyguru") {
        let text = info.selectionText;
        chrome.storage.sync.set({selection: text});
    }
});

// Erase past searches everytime tab changes
chrome.tabs.onActivated.addListener(function() {
    chrome.storage.sync.clear();
}); 

