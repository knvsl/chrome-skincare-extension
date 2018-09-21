chrome.runtime.onMessage.addListener(function(request) {
    // Inject Modal
    if (request.message === "injectModal") {
        $.get(chrome.extension.getURL('html/modal.html'), function(data) {
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

        // Set title
        let title = document.getElementById("beautyguruTitle");
        title.textContent = request.title;
        title.href = request.url;

        // Close and notify background to open tab
        title.addEventListener("click", function() {
            hideModal(modal, iframe, title);
            chrome.runtime.sendMessage({message:'openTab', url: request.url});
        });
        
        // Show modal
        let modal = document.getElementById('beautyguruModal');
        modal.style.display = "block";
        
        // Close modal
        let close = document.getElementById('beautyguruClose');
        close.addEventListener("click", function() {
            hideModal(modal, iframe, title);
        });
    }
});

/**
 * Hide the modal
 * 
 * @param modal
 * @param iframe
 * @param title
 */
function hideModal(modal, iframe, title) {
    modal.style.display = "none";
    iframe.removeAttribute("src");
    title.removeAttribute("href");
}



