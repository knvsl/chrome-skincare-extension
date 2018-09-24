// Create context menu and load data
chrome.runtime.onInstalled.addListener(function() {
    
    chrome.contextMenus.create({
        "title": "Copy to Product Search",
        "contexts": ["selection"],
        "id": "Product"
    });
    chrome.contextMenus.create({
        "title": "Copy to Ingredients",
        "contexts": ["selection"],
        "id": "Ingredients"
    });

    loadIngredients();
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.sync.clear();
    chrome.storage.local.get({ratings: ""}, function(data) {
        if (data.ratings === "") {
            loadIngredients();
        }
    });
});

// Save selection to storage
chrome.contextMenus.onClicked.addListener(function(info) {
    let text = info.selectionText;
    if (info.menuItemId === "Product") {
        chrome.storage.sync.set({product: text});
    } else {
        chrome.storage.sync.set({ingredients: text});
    }
});

// Clear on change tabs
chrome.tabs.onActivated.addListener(function() {
    chrome.storage.sync.remove(["product", "ingredients"]);
}); 

/**
 * Fetch the ingredients.json and load into local storage
 * 
 */
function loadIngredients() {
    // Fetch comedogenic json
    let url = chrome.runtime.getURL('src/data/ingredients.min.json');
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            chrome.storage.local.set({ratings: json});
        });
}