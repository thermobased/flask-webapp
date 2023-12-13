from flask import Flask, request

app = Flask(__name__)

@app.route("/login", methods = ["POST"])
def login():
    u = request.form["username"]
    p = request.form["password"]
    print(f"{u=} {p=}")
    return f"""
    You entered {u=}, {p=}
    """

@app.route("/")
def hello_world():
    # hey
    return """
    <form action="/login" method="post">
        Username:
        <input type="text" id="username" name="username" required>

        <br>
        Password:
        <input type="password" id="password" name="password" required>

        <br>
        <input type="submit" value="Login">
    </form>
    """
