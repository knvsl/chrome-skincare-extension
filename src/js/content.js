chrome.runtime.onMessage.addListener(function(request) {
    // Inject Modal
    if (request.message === "injectModal") {
        $.get(chrome.extension.getURL('src/html/modal.html'), function(data) {
            $($.parseHTML(data)).appendTo('body');
        });
    }
    // Open Modal
    else if (request.message === "openModal") {
        // Set logo
        let img = document.getElementById("bgLogo");
        img.src = chrome.extension.getURL("src/img/kiss48.png");
        
        // Show modal
        let modal = document.getElementById('bgModal');
        modal.style.display = "block";

        let textarea = document.getElementById("bgTextarea");
        textarea.addEventListener("keydown", function(e) {

            if(e.key === "Enter") {
                // Parse ingredients
                let ingredients = textarea.value.split(",");

                // Fetch comedogenic json
                let url = chrome.runtime.getURL('src/data/ingredients.json');
                fetch(url)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(comedogenic) {
                        // Highlight classes
                        let colours = ["bg-0","bg-1","bg-2","bg-3","bg-4","bg-5"];

                        for (let i = 0; i < ingredients.length; i++) {
                            // Search in comedogenic ingredients
                            let index = binarySearch(ingredients[i], comedogenic);

                            // Highlight by rating
                            if (index > -1) {
                                let c = comedogenic[index].rating;
                                ingredients[i] = ingredients[i].replace(/.*\b/g, '<mark class="bg-mark ' + colours[c] + '">$&</mark>');
                            } else {
                                ingredients[i] = ingredients[i].replace(/.*\b/g, '<mark class="bg-mark">$&</mark>');
                            }
                        }

                        textarea.style.display = "none";

                        let results = document.getElementById("bgResults");
                        results.innerHTML = ingredients;
                        results.style.display = "block";

                        let legend = document.getElementById("bgLegend");
                        legend.style.display = "block";

                        let back = document.getElementById("bgBack");
                        back.addEventListener("click", function() {
                            legend.style.display = "none";
                            textarea.style.display = "block";
                        });
                        
                    });
                }
        });

        // Close modal
        let close = document.getElementById('bgClose');
        close.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }
});


/**
 * Searches for the target string in the list of comedogenic ingredients
 * 
 * @param {string} target 
 * @param {Object[]} ingredients 
 * 
 * @return {number} The index of the target or -1 if not found
 */
function binarySearch(target, ingredients) {

    if (target === undefined || ingredients === undefined)
        return -1;
    
    target = target.trim().toUpperCase();

    let left = 0;
    let right = ingredients.length;

    while (left <= right) {

        let mid = Math.floor((left + right) / 2);

        if (target < ingredients[mid].ingredient.toUpperCase()) {
            right = mid - 1;
        } else if (target > ingredients[mid].ingredient.toUpperCase()) {
            left = mid + 1;
        } else {
            return mid;
        }
    }

    return -1;

}



