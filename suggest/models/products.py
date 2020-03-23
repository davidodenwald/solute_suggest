import json

PRODUCTS_FILE = "models/top-1000-products.json"


def search(query):
    with open(PRODUCTS_FILE) as fp:
        all_products = json.load(fp)

    products = []
    for product in all_products:
        if _match(query, product["name"]):
            products.append(product)
    
    return products

def _match(query, text):
    return query.lower() in text.lower()

    

def categories(products):
    """returns all categories with the number of articles contained of the given products.
    The result is sorted by the number of articles contained."""
    
    categoies = dict()
    for product in products:
        category = product["category"]
        if category in categoies:
            categoies[category] += 1
        else:
            categoies[category] = 1
    
    categoies = sorted(categoies.items(), key=lambda e: e[1], reverse=True)
    
    return categoies