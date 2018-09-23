document.addEventListener('DOMContentLoaded', function() {

    let urlsAreSet = false;

    // Stores {anchor : checkbox} for each site
    let options = [
        {link: document.getElementById("mua"), toggle: document.getElementById("muaCheck")},
        {link: document.getElementById("cosdna"), toggle: document.getElementById("cosdnaCheck")},
        {link: document.getElementById("sephora"), toggle: document.getElementById("sephoraCheck")},
        {link: document.getElementById("beautypedia"), toggle: document.getElementById("beautypediaCheck")},
        {link: document.getElementById("pc"), toggle: document.getElementById("paulaschoiceCheck")}
    ]

    // Cross out disabled toggles
    chrome.windows.getCurrent(function(window) {
        let sliders = document.getElementsByClassName("slider");
        if (window.state === "fullscreen") {
            for(let i = 0; i < sliders.length; i++) {
                sliders[i].classList.add("toggle-disabled");
             };
        } else {
            for(let i = 0; i < sliders.length; i++) {
                sliders[i].classList.remove("toggle-disabled");
             };
        }
    });

    for (let i = 0; i < options.length; i++) {
        // Enable/Disable toggle switch
        let toggle = options[i].toggle;
        chrome.windows.getCurrent(function(window) {
            if (window.state === "fullscreen") {
                toggle.disabled = true;
            } else {
                toggle.disabled = false;
            }
        });

        let link = options[i].link;
        link.addEventListener("click", function() {
            if (urlsAreSet) {
                // Open popup
                if (toggle && toggle.checked) {
                    chrome.windows.create({
                        url: link.href,
                        type: "popup", 
                        height: 450, 
                        width: 800,
                        state: 'normal',
                        focused: true
                      });
                } 
                // Open new tab
                else {
                    chrome.tabs.create({url: link.href, active: false});
                }
            }
        });
    }
    
    let textInput = document.getElementById("productText");

    // Paste text from storage
    chrome.storage.sync.get({"selection" : ""}, function(data) {
        if (data.selection != "") {
            textInput.value = data.selection;
            urlsAreSet = setURLs(options, data.selection);
        }
    });

    textInput.addEventListener("keydown", function(e) {
        if (e.key === 'Enter') {  
            // Save to storage
            let text = textInput.value; 
            chrome.storage.sync.set({selection: text});
            
            // Set search URLs
            urlsAreSet = setURLs(options, text);
        }
    });

    textInput.addEventListener("input", function() {
        urlsAreSet = removeURLs(options);
    });

    
    let ingredients = document.getElementById("ingredients");
    ingredients.addEventListener("click", function(){
        let url = chrome.extension.getURL('src/html/ingredients.html');
        window.location.href = url;
    });
    

    let help = document.getElementById("help");
    help.addEventListener("click", function(){
        // Help guide elements
        let helpTips = document.getElementsByClassName("help-guide");
        
        for (let elem of helpTips) {
            if (!elem.style.display || elem.style.display === "none") {
                elem.style.display = "block";
            } else {
                elem.style.display = "none";
            }
        }
    });

});

/**
 * Assigns the hrefs to the links 
 * 
 * @param {Object[]} options 
 * @param {string} text 
 * 
 * @return {boolean} Whether or not the hrefs are set
 */
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
            case "pc":
                link.href = "https://www.paulaschoice.com/ingredient-dictionary?crefn1=name-first-letter&crefv1=" + encodeURIComponent(text.charAt(0).toUpperCase());
                break;
            default:
                return false;
        }

        // Highlight pink for ready
        link.style.color = "#FF1372";
    }
    return true;
}


/**
 * Removes hrefs from the links
 * 
 * @param {Object[]} options 
 * 
 * @return {boolean} Whether or not the hrefs are set
 */
function removeURLs(options) {
    for (let i = 0; i < options.length; i++) {
        let link = options[i].link;
        link.removeAttribute("href");
        link.style.color = "#5E5E5E";
    }
    return false;
}



