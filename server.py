import flask
import json
import os
# import decoder
from flask import render_template
import sqlite3
from flask import render_template, request, redirect, url_for

app = flask.Flask(__name__)

# @app.route('/sasai', methods=['POST'])
def db_connection(db_file):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS characters
                   (name text)""")
    return cursor, conn

# @app.route('/heresy', methods=['POST'])
# def post_theme():
#     res = flask.request.get_json()
#     print(res)
#     with open("heresy.json", "a") as w:
#         w.write(res.replace("[", "").replace("]", "").replace("\"", "") + ",")
#     decoder.decod()
#     return flask.Response(status=200)

@app.route('/page', methods=['GET'])
def get_str():
    return render_template("page.html")


@app.route('/', methods=['GET'])
def get_strdas1():
    return "Hui"
@app.route('/clock', methods=['GET'])
def get_clock():
    return render_template("clock1.html")


@app.route('/p', methods=['GET'])
def get_str1():
    return render_template("form.html")


@app.route('/g', methods=['GET'])
def get_str2():
    return render_template("gallery.html")
    


@app.route('/miner', methods=['GET'])
def get_miner():
    return render_template("miner2.html")

#---------------------- game -------------------------

@app.route('/game/save', methods=['post'])
def save_character():
    name = request.form.get('name')
    cursor, connection = db_connection('static/database.db')
    cursor.execute("""INSERT INTO characters VALUES (?)""", (name,))
    connection.commit()
    cursor.close()
    connection.close()
    return redirect(url_for('get_all_characters'))

characters = []
results = []

@app.route('/game/redact', methods=['get'])
def get_all_characters():
    global characters, results
    results = []
    characters = []
    cursor, connection = db_connection('static/database.db')
    users = cursor.execute("SELECT * FROM characters").fetchall()
    users = [i[0] for i in users]
    cursor.close()
    connection.close()
    print(users)
    return render_template("redact_characters.html", characters = users, num=len(users))

@app.route('/data', methods=['get'])
def get_data():
    cursor, connection = db_connection('static/database.db')
    users = cursor.execute("SELECT * FROM characters").fetchall()
    users = [i[0] for i in users]
    cursor.close()
    connection.close()
    return json.JSONEncoder().encode(users)

@app.route('/data/inp', methods=['post', 'get'])
def set_data():
    names = request.get_json()['names']
    names = [(i,) for i in names]
    cursor, connection = db_connection('static/database.db')
    cursor.executemany("""INSERT INTO characters VALUES (?)""", names)
    connection.commit()
    cursor.close()
    connection.close()
    return redirect("get_all_characters")

@app.route('/game/redact/del', methods=['post', 'get'])
def delete_characters():
    name = request.args.get('name')
    cursor, connection = db_connection('static/database.db')
    cursor.execute("""DELETE FROM characters where name like ?""", ('%' + name + '%',))
    connection.commit()
    cursor.close()
    connection.close()
    return redirect(url_for('get_all_characters'))

@app.route('/game', methods=['get'])
def start_game():
    global characters, results
    results = []
    cursor, connection = db_connection('static/database.db')
    characters = cursor.execute("SELECT * FROM characters").fetchall()
    cursor.close()
    connection.close()
    characters = {i[0] for i in characters}
    leng = len(characters)
    characters = [characters.pop() for i in range(min(leng, 30))]
    return redirect(url_for('get_three_characters'))

@app.route('/game/step', methods=['post', 'get'])
def get_three_characters():
    global characters, results
    new = characters[:3]
    if request.method == 'GET':
        if new:
            return render_template("game_step.html", characters=new,
                                   error=request.args.get('error'))
        else:
            print(results)
            return render_template("results.html", results=results)
    else:
        temp = {}
        for i in range(3):
            temp[request.form.get(new[i])] = new[i]
        if len(temp.keys()) == 3:
            results.append(temp)
            characters = characters[3:]
            return redirect(url_for("get_three_characters"))
        else:
            return redirect(url_for("get_three_characters", error=1))



if __name__ == '__main__':
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    # app.run()
    # app.run(host='192.168.0.120', port=8080)

