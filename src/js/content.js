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
        let img = document.getElementById("beautyguruLogo");
        img.src = chrome.extension.getURL("src/img/kiss48.png");
        
        // Show modal
        let modal = document.getElementById('beautyguruModal');
        modal.style.display = "block";

        let textarea = document.getElementById("beautyguruTextarea");
        textarea.addEventListener("input", function() {
            let ingredients = textarea.value.split(",");
            for (let i = 0; i < ingredients.length; i++) {
                console.log(ingredients[i]);
            }

            console.log("testing...");

            let url = chrome.runtime.getURL('src/data/ingredients.json');

            fetch(url)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    console.log(JSON.stringify(myJson));
                });
        });

        
        // Close modal
        let close = document.getElementById('beautyguruClose');
        close.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }
});

function myFunction() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }



