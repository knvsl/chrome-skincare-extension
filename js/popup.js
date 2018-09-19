document.addEventListener('DOMContentLoaded', function() {

    let textInput = document.getElementById("productText");
    let openButton = document.getElementById("openAll");
    
    // Site links
    let urlsAreSet = false;

    //var option = {link: document.getElementById("mua"), toggle: null};

    let links = [
        document.getElementById("mua"), 
        document.getElementById("cosdna"), 
        document.getElementById("sephora"),
        document.getElementById("beautypedia"),
        document.getElementById("paulaschoice")
    ];

    // Toggle switches
    let toggles = [
        document.getElementById("sephoraCheck"), 
        document.getElementById("beautypediaCheck"),
        document.getElementById("paulaschoiceCheck")
    ];

    // Get selection from context menu
    chrome.storage.sync.get({"selection" : ""}, function(data) {
        if (data.selection != "") {
            textInput.value = data.selection;
            setURLs(links, data.selection);
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
            setURLs(links, text);
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
            for (let i = 0; i < links.length; i++) {
                let link = links[i];
                chrome.tabs.create({"url": link.href});
            }
        }
    });

    // Open Modal listener
    /*
    sephora.addEventListener("click", function() {
        if (sephora.href) {
            // Notify content script to open modal
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "openModal", url: sephora.href});
            });
        }
    });
    */

    // Click event listeners
    // TODO: for sephora, pc, beautypedia if toggle open modal else tab
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        link.addEventListener("click", function() {
            if (urlsAreSet) {
                chrome.tabs.create({"url": link.href});
            }
        });
    }

});

function setURLs (links, text) {
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
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



