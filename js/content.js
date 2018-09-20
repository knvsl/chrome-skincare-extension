chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Inject Modal
    if (request.message === "injectModal") {
        $.get(chrome.extension.getURL('modal.html'), function(data) {
            $($.parseHTML(data)).appendTo('body');
        });
    }
    // Open Modal
    else if (request.message === "openModal") {
        // Set src of iframe
        let iframe = document.getElementById("beautyguruIframe");
        iframe.src = request.url;
        
        // Set logo
        let img = document.getElementById("beautyguruLogo");
        img.src = chrome.extension.getURL("img/kiss48.png");
        
        // Show modal
        let modal = document.getElementById('beautyguruModal');
        modal.style.display = "block";
        
        // Add listener to close modal
        let close = document.getElementById('beautyguruClose');
        close.addEventListener("click", function() {
            modal.style.display = "none";
            iframe.removeAttribute("src");
        });
    }
});


