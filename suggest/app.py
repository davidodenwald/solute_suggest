import flask
from models import products

app = flask.Flask(__name__)


@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/suggest")
def suggest():
    text = flask.request.args.get("t")
    return flask.jsonify(products.search(text, max=10))


@app.route("/search")
def search():
    query = flask.request.args.get("q")

    prods = products.search(query)
    res = {
        "products": prods,
        "categories": products.categories(prods)
    }

    return flask.jsonify(res)