from flask import Flask, request, render_template

app = Flask(__name__)


@app.route("/login", methods=["POST"])
def login():
    u = request.form["username"]
    p = request.form["password"]
    print(f"{u=} {p=}")
    body = f"""
    You entered {u=}, {p=}
    """
    return render_template("main.html", title="Login page", body=body)


@app.route("/")
def hello_world():
    # hey
    body = """
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
    return render_template("main.html", title="Main page", body=body)
