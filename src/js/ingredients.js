document.addEventListener('DOMContentLoaded', function() {

    let textarea = document.getElementById("textarea");
        
    // Paste text from storage
    chrome.storage.sync.get({"selection" : ""}, function(data) {
        if (data.selection != "") {
            textarea.value = data.selection;
        }
    });

    textarea.addEventListener("keydown", function(e) {

        if(e.key === "Enter") {
            
            // Parse ingredients
            textarea.value = textarea.value.trim();

            if (textarea.value.slice(-1) === ".") {
                textarea.value = textarea.value.slice(0, -1);
            }

            let ingredients = textarea.value.split(",");
            ingredients.map(str => str.trim());

            // Fetch comedogenic json
            let url = chrome.runtime.getURL('src/data/ingredients.json');
            fetch(url)
                .then(function(response) {
                    return response.json();
                })
                .then(function(comedogenic) {   
                    // Highlight classes
                    let colours = ["rating-0","rating-1","rating-2","rating-3","rating-4","rating-5"];

                    for (let i = 0; i < ingredients.length; i++) {
                        // Search in comedogenic ingredients
                        let index = binarySearch(ingredients[i], comedogenic);

                        // Highlight by rating
                        if (index > -1) {
                            let rating = comedogenic[index].rating;
                            ingredients[i] = ingredients[i].replace(/.*\b/g, '<mark class="highlight ' + colours[rating] + '">$&</mark>');
                        } else {
                            ingredients[i] = ingredients[i].replace(/.*\b/g, '<mark class="highlight">$&</mark>');
                        }
                    }

                    textarea.style.display = "none";

                    let results = document.getElementById("results");
                    results.innerHTML = ingredients;
                    results.style.display = "block";
                    
                });

            let edit = document.getElementById("edit");
            edit.addEventListener("click", function() {
                results.style.display = "none";
                textarea.style.display = "block";
            });
        }
    });

    let dashboard = document.getElementById("dashboard");
    dashboard.addEventListener("click", function(){
        let url = chrome.extension.getURL('src/html/dashboard.html');
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



