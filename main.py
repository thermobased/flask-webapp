from flask import Flask, request, render_template, redirect, url_for, make_response
import sqlite3, random, string

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

def makekey():
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(20))
    return result_str


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
        resp = make_response(redirect(url_for('main')))
    else:
        cookie_key = makekey();
        cur.execute("INSERT INTO sessions(login, cookie_key) VALUES(?, ?)", (u, cookie_key))
        resp = make_response(redirect(url_for('profile')))
        resp.set_cookie('authkey', cookie_key)
    return resp


@app.route('/profile')
def profile():
    authkey =  request.cookies.get('authkey')
    con = get_db()
    cur = con.cursor()
    i = cur.execute("""
                SELECT login FROM sessions WHERE cookie_key = ?
                """, (authkey,))
    welcome = i.fetchone()
    if welcome is not None:
        body = f"""
        <h1>Welcome, {welcome[0]}!</h1>
        <form action="/logout" method="post">
        <input type="submit" value="Logout">
        </form>
         """
        return render_template("main.html", title="Profile", body=body)
    else:
        return redirect(url_for("main"))


@app.route("/logout", methods=["POST"])
def logout():
    con = get_db()
    cur = con.cursor()
    cooka = request.cookies.get('authkey')
    if cooka is not None:
        i = cur.execute("SELECT cookie_key FROM sessions WHERE (cookie_key) =?", (cooka, ))
        if i.fetchone() is not None:
            cur.execute("DELETE FROM sessions WHERE cookie_key = ?", (cooka, ))

    resp = make_response(redirect(url_for("main")))
    resp.set_cookie('authkey', 'null')
    return resp

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
    con = get_db()
    cur = con.cursor()
    i = cur.execute("""
            SELECT cookie_key FROM sessions WHERE cookie_key = ?
            """, (loggedin, ))
    if i.fetchone() is not None:
        return redirect(url_for('profile'))
    return render_template("main.html", title="Main page", body=body)
