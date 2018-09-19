document.addEventListener('DOMContentLoaded', function() {

    let textInput = document.getElementById("productText");

    // TODO for testing, cleanup later
    let sephora = document.getElementById("sephora");
    let mua = document.getElementById("mua");
    let cosdna = document.getElementById("cosdna");
    let beautypedia = document.getElementById("beautypedia");
    let paulaschoice = document.getElementById("paulaschoice");
    
    var links = [];
    links.push(sephora);
    links.push(mua);
    links.push(cosdna);
    links.push(beautypedia);
    links.push(paulaschoice);

    // Get selection from context menu
    chrome.storage.sync.get({"selection" : ""}, function(data) {
        if (data.selection != "") {
            textInput.value = data.selection;
            setURLs(links, data.selection);
        }
    });

    // Add enter/submit event listener
    textInput.addEventListener("keydown", function(e) {
        if (e.key === 'Enter') {  
            // Save to storage
            let text = textInput.value; 
            chrome.storage.sync.set({selection: text});

            // Set search URLs
            setURLs(links, text);

            // Notify content script to inject modal
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "injectModal"});
            });
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
    // TODO: clean up 
    // TODO: for sephora, pc, beautypedia if toggle open modal else tab
    sephora.addEventListener("click", function() {
        if (sephora.href) {
            chrome.tabs.create({"url": sephora.href});
        }
    });

    mua.addEventListener("click", function() {
        if (mua.href) {
            chrome.tabs.create({"url": mua.href});
        }
    });

    beautypedia.addEventListener("click", function() {
        if (beautypedia.href) {
            chrome.tabs.create({"url": beautypedia.href});
        }
    });

    paulaschoice.addEventListener("click", function() {
        if (paulaschoice.href) {
            chrome.tabs.create({"url": paulaschoice.href});
        }
    });

    cosdna.addEventListener("click", function() {
        if (cosdna.href) {
            chrome.tabs.create({"url": cosdna.href});
        }
    });

});

function setURLs (links, text) {
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
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



