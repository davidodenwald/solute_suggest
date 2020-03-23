class State {
    products = []
    categories = []
    selCategories = []
}

var curState = new State();

$("#search-btn").click(() => {
    curState = new State();

    $("#suggestion-card").css("visibility", "hidden");

    query = $("#search-text").val().trim();
    $.getJSON(`/search?q=${query}`, result => {
        curState.products = result["products"];
        curState.categories = result["categories"];
        renderPage();
    });
});

$("#search-text").keyup(event => {
    if (event.keyCode == 13) {
        $("#search-btn").click();
        return;
    }
    
    $("#suggestion-card").css("visibility", "visible");
    $("#suggestions").html("");
    
    query = $("#search-text").val().trim();
    $.getJSON(`/suggest?t=${query}`, result => {
        result.forEach(e => {
            renderSuggestion(e);
        })
    });
});

$(document.body).on("click", ".suggestion", event => {
    $("#search-text").val(event.currentTarget.innerText);
    $("#search-btn").click();
});

$("#sort-select").change(() => {
    renderPage();
});

$(document.body).on("change", ".category-checkbox", event => {
    let checkbox = event.currentTarget;
    if (checkbox.checked) {
        curState.selCategories.push(checkbox.name);
    } else {
        curState.selCategories.pop(checkbox.name);
    }

    if (curState.selCategories.length < 1) {
        $(".product").each((_, e) => {
            e.style.display = "block";
        });
        return;
    }

    $(".category-name").each((_, e) => {
        if (curState.selCategories.includes(e.innerText)) {
            e.parentElement.style.display = "block";
        } else {
            e.parentElement.style.display = "none";
        }
    });
});


function renderSuggestion(suggestion) {
    $("#suggestions").append(`
    <div class="suggestion">
        <p>${suggestion.name}</p>
    </div>`);
}

function renderPage() {
    // clear divs
    $("#results").html("");
    $("#categories").html("");

    const sortAsc = "Preis (billigster oben)";
    const sortDesc = "Preis (teuerster oben)";

    if ($("#sort-select").val() == sortAsc) {
        curState.products.sort((a, b) => a.price - b.price);
    }

    if ($("#sort-select").val() == sortDesc) {
        curState.products.sort((a, b) => b.price - a.price);
    }

    curState.products.forEach(product => {
        renderProduct($("#results"), product)
    });

    curState.categories.forEach(product => {
        renderCategory($("#categories"), product)
    });
}

function renderProduct(parent, data) {
    parent.append(`
    <div class="card product">
    <p class="category-name" hidden>${data.category}</p>
    <img src="/static/img/poduct_placeholder.jpg" class="card-img-top" alt="placeholder">
        <div class="card-body">
            <h6 class="card-title">${data.name}</h5>
            <h6 style="color: #fb761f"><small>ab</small> ${data.price.toFixed(2)} €</h6>
        </div>
    </div>`);
}

function renderCategory(parent, data) {
    let [name, count] = data;

    parent.append(`
    <div class="form-check">
        <input class="form-check-input category-checkbox" type="checkbox" name="${name}">
        <label class="form-check-label" for="defaultCheck1">
            ${name} <span class="text-muted">(${count})</span>
        </label>
    </div>`);
}