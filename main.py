from flask import Flask, request, render_template, redirect, url_for, make_response
import sqlite3

app = Flask(__name__)

database = None


def get_db():
    global database
    if database is None:
        database = sqlite3.connect("collection.db")
    return database


@app.route("/register", methods=["POST"])
def register():
    u = request.form["username"]
    p = request.form["password"]
    con = get_db()
    cur = con.cursor()
    cur.execute("INSERT INTO items(login, password) VALUES(?, ?)", (u, p))
    con.commit()
    return redirect(url_for('main'))


@app.route("/login", methods=["POST"])
def login():
    u = request.form["username"]
    p = request.form["password"]
    con = get_db()
    cur = con.cursor()
    i = cur.execute("""
        SELECT login FROM items WHERE login = ? and password = ?
        """, (u, p))
    if i.fetchone() is None:
        body = "Wrong login/password"
    else:

        body = f"""
        Login successful, <em> {u} </em>, Welcome!
        """
    resp = make_response(render_template("main.html", title="Login page", body=body))
    resp.set_cookie('authkey', u)
    return resp

@app.route('/profile')
def profile():
 return f"""welcome, <em> {request.cookies.get('authkey')} </em> """

@app.route("/")
def main():
    loggedin = request.cookies.get('authkey')
    # hey
    body = """
    Login:
    <form action="/login" method="post">
        Username:
        <input type="text" id="username" name="username" required>

        <br>
        Password:
        <input type="password" id="password" name="password" required>

        <br>
        <input type="submit" value="Login">
    </form>
    Register:
    <form action="/register" method="post">
        Username:
        <input type="text" id="username" name="username" required>

        <br>
        Password:
        <input type="password" id="password" name="password" required>

        <br>
        <input type="submit" value="Register">
    </form>
    """
    if loggedin is not None:
        return redirect(url_for('profile'))
    return render_template("main.html", title="Main page", body=body)
