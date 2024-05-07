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

def get_collection(user):
    con = get_db()
    cur = con.cursor()
    j = cur.execute("SELECT habit, occasion, datapoint, comment FROM datapoints WHERE login = ?", (user,))
    collection = j.fetchall()
    new_collection = []
    for i in collection:
        j = {
            "habit": i[0],
            "occasion": i[1],
            "datapoint": i[2],
            "comment": i[3]
        }
        new_collection.append(j)
    print('old collection: ', collection)
    print('new collection: ', new_collection)
    con.commit()
    return collection

def get_habits(user):
    con = get_db()
    cur = con.cursor()
    n = cur.execute("SELECT habit FROM habits WHERE login = ? ", (user,))
    habits = n.fetchall()
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


@app.route("/api/profile", methods=['POST'])
def handle_profile_post():
    global user
    authkey = request.cookies.get('authkey')
    con = get_db()
    cur = con.cursor()
    i = cur.execute("""
                        SELECT login FROM sessions WHERE cookie_key = ?
                        """, (authkey,))
    welcome = i.fetchone()
    user = welcome[0]

    new_habit = request.form.get("new_habit")
    new_datapoint = request.form.get("new_datapoint")
    new_datapoint_name = request.form.get("new_datapoint_name")
    habit_delete = request.form.get("habit_delete")
    new_datapoint_date = request.form.get("new_datapoint_date")
    datapoint_delete = request.form.get("datapoint_delete")
    datapoint_delete_name = request.form.get("datapoint_delete_name")
    datapoint_delete_date = request.form.get("datapoint_delete_date")
    new_datapoint_time = request.form.get("new_datapoint_time")
    if new_habit:
        #time.sleep(2)
        try:
            cur.execute("INSERT INTO habits (login, habit) VALUES(?, ?)", (user, new_habit))
            collection = get_collection(user)
            habits = get_habits(user)
            for q in range(0, len(habits)):
                habits[q] = habits[q][0]
            con.commit()
            return jsonify({'status': 'ok', "collection": collection, "habits": habits})
        except IntegrityError as e:
            print("habit already exists!, ", e)
            con.commit()
            return jsonify({'status': 'error', 'error': str(e)})
    if new_datapoint:
        #time.sleep(2)
        try:
            cur.execute("""INSERT INTO datapoints (login, habit, occasion, datapoint, comment)
                            VALUES(?, ?, ?, ?, ?)""",
                        (user, new_datapoint_name, new_datapoint_date, new_datapoint_time, new_datapoint))
            collection = get_collection(user)
            habits = get_habits(user)
            con.commit()
            return jsonify({'status': 'ok', "collection": collection, "habits": habits})
        except IntegrityError as e:
            print("datapoint already exists!, ", type(e))
            con.commit()
            return jsonify({'status': 'error', 'error': str(e)})
    if habit_delete:
        #time.sleep(2)
        try:
            i = cur.execute("SELECT habit FROM habits where habit = ? and login = ?", (habit_delete, user))
            if i.fetchone() is not None:
                cur.execute("DELETE FROM datapoints WHERE habit = ? and login = ?", (habit_delete, user))
                cur.execute("DELETE FROM habits WHERE habit = ? and login = ?", (habit_delete, user))
                collection = get_collection(user)
                habits = get_habits(user)
                for q in range(0, len(habits)):
                    habits[q] = habits[q][0]
                con.commit()
                return jsonify({'status': 'ok', "collection": collection, "habits": habits})
        except IntegrityError as e:
            print("couldn't delete habit!, ", type(e))
            con.commit()
            return jsonify({'status': 'error', 'error': str(e)})
    if datapoint_delete:
        # time.sleep(2)
        try:
            i = cur.execute("SELECT comment FROM datapoints where habit = ? and comment = ?", (datapoint_delete_name, datapoint_delete))
            if i.fetchone() is not None:
                cur.execute("DELETE FROM datapoints WHERE habit = ? and comment = ? and occasion = ?", (datapoint_delete_name, datapoint_delete, datapoint_delete_date))
                collection = get_collection(user)
                habits = get_habits(user)
                for q in range(0, len(habits)):
                    habits[q] = habits[q][0]
                con.commit()
                return jsonify({'status': 'ok', "collection": collection, "habits": habits})
        except IntegrityError as e:
            print("couldn't delete habit!, ", type(e))
            con.commit()
            return jsonify({'status': 'error', 'error': str(e)})


@app.route("/profile", methods=['GET'])
def profile():
    global user
    if request.method == 'GET':
        error = request.args.get('error')
        authkey = request.cookies.get('authkey')
        con = get_db()
        cur = con.cursor()
        i = cur.execute("""
                    SELECT login FROM sessions WHERE cookie_key = ?
                    """, (authkey,))
        welcome = i.fetchone()
        user = welcome[0]
        collection = get_collection(user)
        habits = get_habits(user)

        if welcome is not None:
            body = render_template("welcome.html", error=error, collection=collection, habits=habits)
            return render_template("main.html", title="Profile", body=body, name=welcome[0])
        else:
            return redirect(url_for('main'))


@app.route("/habit_expand", methods=['GET'])
def habit_expand():
    global user
    habit = request.args.get("habit_to_expand")
    con = get_db()
    cur = con.cursor()
    try:
        j = cur.execute("SELECT occasion, datapoint, comment FROM datapoints WHERE login = ? and habit = ?", (user, habit))
        collection = j.fetchall()
        con.commit()
        body = render_template("habit_expand.html", collection=collection, habit_name=habit)
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
