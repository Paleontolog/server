# -*- coding: utf-8 -*-
import json
import os
import random
import uuid
import urllib
import argparse

from flask import Flask
# import decoder
from flask import render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exists

app = Flask(__name__)
parser = argparse.ArgumentParser()
parser.add_argument("--db", type=str,
                        default='sqlite:///D:\PycharmProjects\keyboard\static\database.db')
args = parser.parse_args()
app.config['SQLALCHEMY_DATABASE_URI'] = args.db

db = SQLAlchemy(app)
db.create_all()

class User(db.Model):
    __tablename__ = 'characters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)

    def __repr__(self):
        return self.name


class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(128), index=True)
    name = db.Column(db.String(64), index=True, unique=False)
    group = db.Column(db.Integer, index=False, unique=False)
    choose = db.Column(db.String(64), index=False, unique=False)

    def __repr__(self):
        return "{} {} {}".format(self.uuid, self.name, self.group)


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
    return render_template("miner1.html")
    return render_template("miner2.html")


# ---------------------- game -------------------------

@app.route('/game/save', methods=['post'])
def save_character():
    name = request.form.get('name')
    exist = db.session.query(exists().where(User.name == name)).scalar()
    if exist:
        return redirect(url_for('get_all_characters',
                                error=True,
                                error_character=name))
    u = User(name=name)
    print("user created", u)
    db.session.add(u)
    db.session.commit()
    return redirect(url_for('get_all_characters'))


@app.route('/game/redact', methods=['get'])
def get_all_characters():
    users = db.session.query(User.name).all()
    users = [i[0] for i in users]
    print(users)
    return render_template("redact_characters.html",
                           characters=users,
                           num=len(users),
                           error=request.args.get('error'),
                           error_character=request.args.get('error_character'))


@app.route('/data', methods=['get'])
def get_data():
    users = db.session.query(User.name).all()
    users = [i[0] for i in users]
    return json.JSONEncoder().encode(users)


@app.route('/data/inp', methods=['post', 'get'])
def set_data():
    names = request.get_json()['names']
    db.session.add_all([User(name=i) for i in names])
    db.session.commit()
    return redirect("get_all_characters")


@app.route('/game/redact/del', methods=['post', 'get'])
def delete_characters():
    name = request.args.get('name')
    user = db.session.query(User).filter(User.name == name).one()
    db.session.delete(user)
    db.session.commit()
    return redirect(url_for('get_all_characters'))


@app.route('/game', methods=['get'])
def start_game():
    new_uuid = uuid.uuid4()
    ch = db.session.query(User.name).all()
    ch = [x[0] for x in ch]
    random.shuffle(ch)
    return render_template("game_step.html",
                           game_uuid=new_uuid,
                           characters=ch[:3],
                           current_step=0)


@app.route('/game/charlist', methods=['get'])
def get_n_characters():
    characters = db.session.query(User.name).all()
    characters = {i[0] for i in characters}
    leng = len(characters)
    print(characters)
    characters = [characters.pop() for i in range(min(leng, 30))]
    return jsonify(characters)


@app.route('/game/step', methods=['post', 'get'])
def get_three_characters():
    request_data = request.get_data(as_text=True)

    request_data = request.form
    if not request_data:
        return redirect(url_for("start_game"))

    request_data = list(request_data.items())
    request_data = list(filter(lambda x: x[0] != "startGame", request_data))
    characters = list(filter(lambda x: not x[0] in ['game_uuid', 'current_step'],
                             request_data))
    game_uuid = list(filter(lambda x: x[0] == 'game_uuid', request_data))[0][1]
    current_step = int(list(filter(lambda x: x[0] == 'current_step', request_data))[0][1])

    if len(set([i[1] for i in characters])) < 3:
        return render_template("game_step.html",
                               game_uuid=game_uuid,
                               characters=[i[0] for i in characters],
                               current_step=current_step,
                               error=1)

    db.session.add_all([Game(uuid=game_uuid,
                             name=i[0],
                             choose=i[1],
                             group=current_step) for i in characters])
    db.session.commit()

    sub_q = db.session.query(Game.name) \
        .filter(Game.uuid == game_uuid).subquery()

    new_characters = db.session.query(User.name) \
        .filter(User.name.notin_(sub_q)).all()

    if new_characters:
        new_characters = [x[0] for x in new_characters]
        random.shuffle(new_characters)

        return render_template("game_step.html",
                               game_uuid=game_uuid,
                               characters=new_characters[:3],
                               current_step=current_step + 1)
    else:
        results = []
        uuid = request.form.get('game_uuid')
        data = db.session.query(Game).filter(Game.uuid == uuid) \
            .all()  # .group_by(Game.group).all()
        results = {}
        for d in data:
            if d.group in results:
                results[d.group][d.choose] = d.name
            else:
                results[d.group] = {d.choose: d.name}
        print(results)
        results = results.values()
        return render_template("results.html", results=results)
    
if __name__ == '__main__':
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    # app.run(host='127.0.0.1', port=port)
    # app.run()
    # app.run(host='192.168.0.120', port=8080)
