chrome.runtime.onMessage.addListener(function(request) {
    // Inject Modal
    if (request.message === "injectModal") {
        $.get(chrome.extension.getURL('html/modal.html'), function(data) {
            $($.parseHTML(data)).appendTo('body');
        });
    }
    // Open Modal
    else if (request.message === "openModal") {
        // Set logo
        let img = document.getElementById("beautyguruLogo");
        img.src = chrome.extension.getURL("img/kiss48.png");
        
        // Show modal
        let modal = document.getElementById('beautyguruModal');
        modal.style.display = "block";
        
        // Close modal
        let close = document.getElementById('beautyguruClose');
        close.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }
});



