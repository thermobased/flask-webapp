from flask import Flask, request, render_template, redirect, url_for, make_response
from jinja2 import Template
import sqlite3, random, string, hashlib
from sqlite3 import IntegrityError

assert sqlite3.threadsafety == 3

app = Flask(__name__)
database = None


def get_db():
    global database
    if database is None:
        database = sqlite3.connect("collection.db", check_same_thread=False)
    return database


@app.route("/register", methods=["POST"])
def register():
    u = request.form["username"]
    p = request.form["password"]
    p = p.encode()
    p = hashlib.sha256(p)
    p = p.digest()
    con = get_db()
    cur = con.cursor()
    try:
        cur.execute("INSERT INTO items(login, password) VALUES(?, ?)", (u, p))
        con.commit()
        return redirect(url_for('main'))
    except IntegrityError as e:
        print("Login already exists, ", e)
        con.commit()
        return redirect(url_for('main', error=f"{e}"))


def make_key():
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(20))
    return result_str


@app.route("/login", methods=["POST"])
def login():
    u = request.form["username"]
    p = request.form["password"]
    p = p.encode()
    p = hashlib.sha256(p)
    p = p.digest()
    con = get_db()
    cur = con.cursor()
    i = cur.execute("""
        SELECT login FROM items WHERE login = ? and password = ?
        """, (u, p))
    if i.fetchone() is None:
        resp = make_response(redirect(url_for('main')))
    else:
        cookie_key = make_key()
        cur.execute("INSERT INTO sessions(login, cookie_key) VALUES(?, ?)", (u, cookie_key))
        resp = make_response(redirect(url_for('profile')))
        resp.set_cookie('authkey', cookie_key)
    return resp


@app.route("/profile", methods=['POST', 'GET'])
def profile():
    global user
    if request.method == 'GET':
        authkey = request.cookies.get('authkey')
        con = get_db()
        cur = con.cursor()
        i = cur.execute("""
                    SELECT login FROM sessions WHERE cookie_key = ?
                    """, (authkey,))
        welcome = i.fetchone()
        user = welcome[0]
        i = cur.execute("""
                    SELECT habit FROM habits WHERE login = ?
                    """, welcome)
        habits = i.fetchall()

        #       reducing list of tuples to list of strings
        for q in range(0, len(habits)):
            habits[q] = habits[q][0]

        if welcome is not None:
            body = render_template("welcome.html", habits=habits)

            return render_template("main.html", title="Profile", body=body, name=welcome[0])
        else:
            return redirect(url_for('main'))

    if request.method == 'POST':
        new_habit = request.form["new_habit"]
        con = get_db()
        cur = con.cursor()
        cur.execute("INSERT INTO habits (login, habit, checkmark) VALUES(?, ?, ?)", (user, new_habit, 0))
        con.commit()
        resp = redirect(url_for('profile'))
        return resp


@app.route("/logout", methods=['POST'])
def logout():
    con = get_db()
    cur = con.cursor()
    cooka = request.cookies.get('authkey')
    if cooka is not None:
        i = cur.execute("SELECT cookie_key FROM sessions WHERE (cookie_key) =?", (cooka,))
        if i.fetchone() is not None:
            cur.execute("DELETE FROM sessions WHERE cookie_key = ?", (cooka,))

    resp = make_response(redirect(url_for("main")))
    resp.set_cookie('authkey', 'null')
    return resp


@app.route("/delete_habit", methods=['POST'])
def delete_habit():
    habit_delete = request.form["habit_name"]
    con = get_db()
    cur = con.cursor()
    i = cur.execute("SELECT habit FROM habits where (habit) =?", (habit_delete, ))
    if i.fetchone() is not None:
        cur.execute("DELETE FROM habits WHERE habit = ?", (habit_delete,))
    resp = make_response(redirect(url_for("profile")))
    return resp


@app.route("/", methods=["GET"])
def main():
    logged_in = request.cookies.get('authkey')
    error = f"{request.args.get('error')}"
    body = f"""
    
    
    <form action="/login" method="post">
        Username:
        <input type="text" id="username" name="username" required>

        <br>
        Password:
        <input type="password" id="password" name="password" required>

        <br>
        <input type="submit" value="Login">
    </form>
    
    <form action="/register" method="post">
        Username:
        <input type="text" id="username" name="username" required>

        <br>
        Password:
        <input type="password" id="password" name="password" required>

        <br>
        <input type="submit" value="Register">
    </form>
    <div class = "error">Error: {error}</div>
    
        
    """
    con = get_db()
    cur = con.cursor()
    i = cur.execute("""
            SELECT cookie_key FROM sessions WHERE cookie_key = ?
            """, (logged_in,))
    if i.fetchone() is not None:
        return redirect(url_for('profile'))
    return render_template("main.html", title="Main page", body=body)
