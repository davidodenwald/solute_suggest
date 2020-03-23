import flask
from models import products

app = flask.Flask(__name__)


@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/search")
def search():
    query = flask.request.args.get("q")

    prods = products.search(query)
    res = {
        "products": prods,
        "categories": products.categories(prods)
    }

    return flask.jsonify(res)