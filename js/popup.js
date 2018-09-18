document.addEventListener('DOMContentLoaded', function() {

    let textInput = document.getElementById("productText");
    let sephoraLink = document.getElementById("sephora");

    textInput.addEventListener("keydown", function(e) {
        if (e.key === 'Enter') {  
            // Generate search URLs
            let text = textInput.value; 
            sephoraLink.href = "https://www.sephora.com/search?keyword=" + encodeURIComponent(text);
            sephoraLink.style.color = "#FF1372";

            // Notify content script to inject modal
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"message": "injectModal"}, function(response) {
                });
            });
        }
    });

    sephoraLink.addEventListener("click", function() {
        if (sephoraLink.href) {
            // Save URL for modal 
            chrome.storage.sync.set({sephoraLink: sephoraLink.href}, function() {
            });
            
            // Notify content script to open modal
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"message": "openModal"}, function(response) {
                });
            });
        }
    });

});



