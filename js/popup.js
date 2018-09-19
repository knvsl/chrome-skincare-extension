document.addEventListener('DOMContentLoaded', function() {

    let urlsAreSet = false;

    let textInput = document.getElementById("productText");
    let openButton = document.getElementById("openAll");

    let options = [
        {link: document.getElementById("mua"), toggle: null},
        {link: document.getElementById("cosdna"), toggle: null},
        {link: document.getElementById("sephora"), toggle: document.getElementById("sephoraCheck")},
        {link: document.getElementById("beautypedia"), toggle: document.getElementById("beautypediaCheck")},
        {link: document.getElementById("paulaschoice"), toggle: document.getElementById("paulaschoiceCheck")}
    ]

    // Get selection from context menu
    chrome.storage.sync.get({"selection" : ""}, function(data) {
        if (data.selection != "") {
            textInput.value = data.selection;
            setURLs(options, data.selection);
            urlsAreSet = true;
        }
    });

    // Enter/submit text event listener
    textInput.addEventListener("keydown", function(e) {
        if (e.key === 'Enter') {  
            // Save to storage
            let text = textInput.value; 
            chrome.storage.sync.set({selection: text});

            // Set search URLs
            setURLs(options, text);
            urlsAreSet = true;

            // Notify content script to inject modal
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "injectModal"});
            });
        }
    });
    
    // Open all tabs event listener
    openButton.addEventListener("click", function(){
        if (urlsAreSet) {
            for (let i = 0; i < options.length; i++) {
                let link = options[i].link;
                chrome.tabs.create({"url": link.href});
            }
        }
    });

    // Click event listeners
    for (let i = 0; i < options.length; i++) {
        let link = options[i].link;
        let toggle = options[i].toggle;
        link.addEventListener("click", function() {
            if (urlsAreSet) {
                // Open Modal
                if (toggle && toggle.checked) {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {message: "openModal", url: link.href});
                    });
                } 
                // Open new tab
                else {
                    chrome.tabs.create({"url": link.href});
                }
            }
        });
    }

});

function setURLs (options, text) {
    for (let i = 0; i < options.length; i++) {
        let link = options[i].link;
        switch (link.id) {
            case "sephora":
                link.href = "https://www.sephora.com/search?keyword=" + encodeURIComponent(text);
                break;
            case "mua":
                link.href = "https://www.makeupalley.com/product/searching.asp?Brand=&BrandName=&CategoryID=0&title=" + encodeURIComponent(text);
                break;
            case "cosdna":
                link.href = "http://www.cosdna.com/eng/product.php?q=" + encodeURIComponent(text);
                break;
            case "beautypedia":
                link.href = "https://www.beautypedia.com/?s=" + encodeURIComponent(text);
                break;
            case "paulaschoice":
                link.href = "https://www.paulaschoice.com/ingredient-dictionary?crefn1=name-first-letter&crefv1=" + encodeURIComponent(text.charAt(0).toUpperCase());
                break;
        }
        link.style.color = "#FF1372";
    }
}



