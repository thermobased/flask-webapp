from flask import Flask, request, render_template, redirect, url_for, make_response, jsonify
from jinja2 import Template
import sqlite3, random, string, hashlib
from sqlite3 import IntegrityError
import time

assert sqlite3.threadsafety == 3

app = Flask(__name__)
database = None


def get_db():
    global database
    if database is None:
        database = sqlite3.connect("collection.db", check_same_thread=False)
        database.execute("PRAGMA foreign_keys = 1")
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
        cur.execute("INSERT INTO users(login, password) VALUES(?, ?)", (u, p))
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


def get_user():
    authkey = request.cookies.get('authkey')
    con = get_db()
    cur = con.cursor()
    i = cur.execute("""
                        SELECT login FROM sessions WHERE cookie_key = ?
                        """, (authkey,))
    (user, ) = i.fetchone()
    return user


def get_collection(user: str):
    con = get_db()
    cur = con.cursor()
    j = cur.execute("SELECT habit, occasion, datapoint, comment, id FROM datapoints WHERE login = ?", (user,))
    collection = j.fetchall()
    new_collection = []
    for i in collection:
        j = {
            "habit": i[0],
            "occasion": i[1],
            "datapoint": i[2],
            "comment": i[3],
            "id": i[4]
        }
        new_collection.append(j)
    con.commit()
    return new_collection


def get_habits(user: str) -> list[str]:
    con = get_db()
    cur = con.cursor()
    n = cur.execute("SELECT habit FROM habits WHERE login = ? ", (user,))
    habits = n.fetchall()
    for q in range(0, len(habits)):
        habits[q] = habits[q][0]
    con.commit()
    return habits


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
        SELECT login FROM users WHERE login = ? and password = ?
        """, (u, p))
    if i.fetchone() is None:
        resp = make_response(redirect(url_for('main')))
    else:
        cookie_key = make_key()
        cur.execute("INSERT INTO sessions(login, cookie_key) VALUES(?, ?)", (u, cookie_key))
        resp = make_response(redirect(url_for('profile')))
        resp.set_cookie('authkey', cookie_key)
    return resp


@app.route("/api/profile", methods=['POST'])
def handle_profile_post():
    con = get_db()
    cur = con.cursor()
    user = get_user()
    

@app.route("/api/new_habit", methods=['POST'])
def new_habit():
    con = get_db()
    cur = con.cursor()
    user = get_user()
    new_habit = request.json.get("new_habit")
    try:
        cur.execute("INSERT INTO habits (login, habit) VALUES(?, ?)", (user, new_habit))
        collection = get_collection(user)
        habits = get_habits(user)
        con.commit()
        return jsonify({'status': 'ok', "collection": collection, "habits": habits})
    except IntegrityError as e:
        print("habit already exists!, ", e)
        con.commit()
        return jsonify({'status': 'error', 'error': str(e)})


@app.route("/api/new_datapoint", methods=['POST'])
def new_datapoint():
    con = get_db()
    cur = con.cursor()
    user = get_user()
    new_datapoint = request.json.get("new_datapoint")
    new_datapoint_name = request.json.get("new_datapoint_name")
    new_datapoint_date = request.json.get("new_datapoint_date")
    new_datapoint_time = request.json.get("new_datapoint_time")
    new_id = str(random.getrandbits(64))
    try:
        cur.execute("""INSERT INTO datapoints (login, habit, occasion, datapoint, comment, id)
                        VALUES(?, ?, ?, ?, ?, ?)""",
                    (user, new_datapoint_name, new_datapoint_date, new_datapoint_time, new_datapoint, new_id))
        collection = get_collection(user)
        habits = get_habits(user)
        con.commit()
        return jsonify({'status': 'ok', "collection": collection, "habits": habits})
    except IntegrityError as e:
        print("datapoint already exists!, ", type(e))
        con.commit()
        return jsonify({'status': 'error', 'error': str(e)})


@app.route("/api/delete_habit", methods=['POST'])
def delete_habit():
    con = get_db()
    cur = con.cursor()
    user = get_user()
    habit_delete = request.json.get("habit_delete")
    try:
        cur.execute("DELETE FROM habits WHERE habit = ? and login = ?", (habit_delete, user))
        collection = get_collection(user)
        habits = get_habits(user)
        con.commit()
        return jsonify({'status': 'ok', "collection": collection, "habits": habits})
    except IntegrityError as e:
        print("couldn't delete habit!, ", type(e))
        con.commit()
        return jsonify({'status': 'error', 'error': str(e)})


@app.route("/api/delete_datapoint", methods=['POST'])
def delete_datapoint():
    con = get_db()
    cur = con.cursor()
    user = get_user()
    datapoint_delete_id = request.json.get("datapoint_delete")
    datapoint_delete_name = request.json.get("datapoint_delete_name")
    datapoint_delete_date = request.json.get("datapoint_delete_date")
    try:
        sql_del = cur.execute("DELETE FROM datapoints WHERE login = ? and id = ?", (user, datapoint_delete_id))
        collection = get_collection(user)
        habits = get_habits(user)
        con.commit()
        if sql_del.rowcount != 1:
            return print("delete_datapoint did not delete exactly 1 row")
        return jsonify({'status': 'ok', "collection": collection, "habits": habits})
    except IntegrityError as e:
        print("couldn't delete habit!, ", type(e))
        con.commit()
        return jsonify({'status': 'error', 'error': str(e)})


@app.route("/profile", methods=['GET'])
def profile():
    if request.method == 'GET':
        error = request.args.get('error')
        authkey = request.cookies.get('authkey')
        con = get_db()
        cur = con.cursor()
        i = cur.execute("""
                    SELECT login FROM sessions WHERE cookie_key = ?
                    """, (authkey,))
        welcome = i.fetchone()

        if welcome is not None:
            (user,) = welcome
            collection = get_collection(user)
            habits = get_habits(user)
            body = render_template("welcome.html", error=error, collection=collection, habits=habits)
            return render_template("main.html", title="Profile", body=body, name=user)
        else:
            return redirect(url_for('main'))


@app.route("/habit_expand", methods=['GET'])
def habit_expand():
    con = get_db()
    cur = con.cursor()
    user = get_user()
    habit = request.args.get("habit_to_expand")
    try:
        j = cur.execute("SELECT occasion, datapoint, comment, id FROM datapoints WHERE login = ? and habit = ?", (user, habit))
        collection = j.fetchall()
        new_collection = []
        for i in collection:
            j = {
                "occasion": i[0],
                "datapoint": i[1],
                "comment": i[2],
                "id": i[3]
            }
        new_collection.append(j)
        con.commit()
        body = render_template("habit_expand.html", collection=new_collection, habit_name=habit)
        return render_template("main.html", title="expand", body=body, name=user)

    except IntegrityError as e:
        con.commit()
        return jsonify({'status': 'error', 'error': str(e)})


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


@app.route("/", methods=["GET"])
def main():
    logged_in = request.cookies.get('authkey')
    error = request.args.get('error')
    body = render_template("login.html", error=error)
    con = get_db()
    cur = con.cursor()
    i = cur.execute("""
            SELECT cookie_key FROM sessions WHERE cookie_key = ?
            """, (logged_in,))
    if i.fetchone() is not None:
        return redirect(url_for('profile'))
    return render_template("main.html", title="Main page", body=body)
