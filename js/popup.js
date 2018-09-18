document.addEventListener('DOMContentLoaded', function() {

    let textInput = document.getElementById("productText");
    let sephoraLink = document.getElementById("sephora");

    // Get selection from context menu
    chrome.storage.sync.get({"selection" : ""}, function(data) {
        if (data.selection != "") {
            textInput.value = data.selection;
        }
    });

    textInput.addEventListener("keydown", function(e) {
        if (e.key === 'Enter') {  
            // Save to storage
            let text = textInput.value; 
            chrome.storage.sync.set({selection: text});

            // Generate search URL
            sephoraLink.href = "https://www.sephora.com/search?keyword=" + encodeURIComponent(text);
            sephoraLink.style.color = "#FF1372";

            // Notify content script to inject modal
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"message": "injectModal"});
            });
        }
    });

    sephoraLink.addEventListener("click", function() {
        if (sephoraLink.href) {
            // Save URL for modal 
            chrome.storage.sync.set({sephoraLink: sephoraLink.href});
            
            // Notify content script to open modal
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"message": "openModal"});
            });
        }
    });

});



