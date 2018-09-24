document.addEventListener('DOMContentLoaded', function() {

    let textarea = document.getElementById("textarea");
        
    // Paste text from storage
    chrome.storage.sync.get({ingredients : ""}, function(data) {
        if (data.ingredients != "") {
            textarea.value = data.ingredients;
        }
    });

    // Submit by ENTER
    textarea.addEventListener("keydown", function(e) {
        if(e.key === "Enter") {
            let ingredients = parseIngredients(textarea);
            analyze(ingredients, textarea);
        }
    });

    // Analyze/Edit Button
    let edit = document.getElementById("edit");
        edit.addEventListener("click", function() { 
            if (edit.textContent === "Edit") {
                hideResults();
            } else {
                let ingredients = parseIngredients(textarea);
                analyze(ingredients, textarea);
            }
        });

    // Switch view
    let dashboard = document.getElementById("dashboard");
    dashboard.addEventListener("click", function(){
        let url = chrome.extension.getURL('src/html/dashboard.html');
        window.location.href = url;
    });

    // Toggle tooltips
    let help = document.getElementById("help");
    help.addEventListener("click", function(){
        let helpTips = document.getElementsByClassName("help-guide");
        
        for (let elem of helpTips) {
            if (!elem.style.display || elem.style.display === "none") {
                elem.style.display = "block";
            } else {
                elem.style.display = "none";
            }
        }
    });

    // Toggle magnify 
    let magnify = document.getElementById("magnify");
    magnify.addEventListener("click", function(){
        
        magnifyFont(textarea);

        let results = document.getElementById("results")
        if (results != undefined) {
            magnifyFont(results);
        }
        
    });
});

/**
 * Switches from results back to textarea
 */
function hideResults() {
    let results = document.getElementById("results");
    results.style.display = "none";

    let textarea = document.getElementById("textarea");
    textarea.style.display = "block";

    let edit = document.getElementById("edit");
    edit.textContent = "Analyze";
}

/**
 * Parses ingredients from the textarea input
 * 
 * @param {Object} textarea 
 * 
 * @return {String[]} Returns the ingredients as an array of strings
 */
function parseIngredients(textarea) {
    textarea.value = textarea.value.trim();

    if (textarea.value.slice(-1) === ".") {
        textarea.value = textarea.value.slice(0, -1);
    }

    return textarea.value.split(",");
}


/**
 * Hide the textarea and show the analyzed ingredients results
 * 
 * @param {String[]} ingredients 
 */
function showResults(ingredients) {
    let textarea = document.getElementById("textarea");
    textarea.style.display = "none";

    let results = document.getElementById("results");
    results.innerHTML = ingredients;
    results.style.display = "block";

    let edit = document.getElementById("edit");
    edit.textContent = "Edit";
}


/**
 * Displays the ingredients colour coded by comedogenic rating
 * 
 * @param {String[]} ingredients 
 * @param {Object} textarea 
 */
function analyze(ingredients, textarea) {
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
                    ingredients[i] = ingredients[i].trim().replace(/.*\b/g, '<mark class="highlight ' + colours[rating] + '">$&</mark>');
                } else {
                    ingredients[i] = ingredients[i].trim().replace(/.*\b/g, '<mark class="highlight">$&</mark>');
                }
            }
            
            showResults(ingredients);
        });
}


/**
 * Toggles the font size
 * 
 * @param {Object} element 
 */
function magnifyFont(element) { 
    if (element.style.fontSize === "14px" || element.style.fontSize === "") {
        element.style.fontSize = "18px";
    } else {
        element.style.fontSize = "14px";
    }
}


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



