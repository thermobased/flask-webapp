from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    # hey
    return "<p>Hello, World!</p>"
