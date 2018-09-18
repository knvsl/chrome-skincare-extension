chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Inject Modal
    if (request.message === "injectModal") {
        $.get(chrome.extension.getURL('modal.html'), function(data) {
            $($.parseHTML(data)).appendTo('body');
        });
    }
    // Open Modal
    else if (request.message === "openModal") {
        let modal = document.getElementById('beautyguruModal');
        modal.style.display = "block";

        // Set src of iframe
        let iframe = document.getElementById("beautyguruIframe");
        chrome.storage.sync.get('sephoraLink', function(data) {
            iframe.src = data.sephoraLink;
          });

        let img = document.getElementById("beautyguruLogo");
        img.src = chrome.extension.getURL("img/kiss48.png");
        
        // Add listener to close modal
        let close = document.getElementById('beautyguruClose');
        close.addEventListener("click", function() {
            modal.style.display = "none";
        });

    }
    
});


