// Create context menu
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": "Copy to Product Search",
        "contexts": ["selection"],
        "id": "beautyguruProduct"
    });
    chrome.contextMenus.create({
        "title": "Copy to Ingredients",
        "contexts": ["selection"],
        "id": "beautyguruIngredients"
    });
});

// Save selection to storage
chrome.contextMenus.onClicked.addListener(function(info) {
    let text = info.selectionText;
    if (info.menuItemId === "beautyguruProduct") {
        chrome.storage.sync.set({product: text});
    } else {
        chrome.storage.sync.set({ingredients: text});
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