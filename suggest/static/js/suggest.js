class Filter {
    categories = []
}

var currentFilter = new Filter()

$("#search-btn").click(() => {
    currentFilter = new Filter()

    query = $("#search-text").val().trim();
    $.getJSON(`/search?q=${query}`, result => {
        // clear divs
        $("#results").html("");
        $("#categories").html("");

        result["products"].forEach(product => {
            renderProduct($("#results"), product)
        });

        result["categories"].forEach(product => {
            renderCategory($("#categories"), product)
        });
    });
});

$(document.body).on("change", ".category-checkbox", event => {
    let checkbox = event.currentTarget;
    if (checkbox.checked) {
        currentFilter.categories.push(checkbox.name);
    } else {
        currentFilter.categories.pop(checkbox.name);
    }

    if (currentFilter.categories.length < 1) {
        $(".product").each((_, e) => {
            e.style.display = "block";
        });
        return;
    }
    
    $(".category-name").each((_, e) => {
        if (currentFilter.categories.includes(e.innerText)) {
            e.parentElement.style.display = "block";
        } else {
            e.parentElement.style.display = "none";
        }
    });
});

function renderProduct(parent, data) {
    parent.append(`
    <div class="card product">
    <p class="category-name" hidden>${data.category}</p>
    <img src="/static/img/poduct_placeholder.jpg" class="card-img-top" alt="placeholder">
        <div class="card-body">
            <h6 class="card-title">${data.name}</h5>
            <h6><small>ab</small> ${data.price.toFixed(2)} €</h6>
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