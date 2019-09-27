import flask
import json
# import decoder
from flask import render_template

app = flask.Flask(__name__)

# @app.route('/sasai', methods=['POST'])
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


@app.route('/p', methods=['GET'])
def get_str1():
    return render_template("form.html")

@app.route('/g', methods=['GET'])
def get_str2():
    return render_template("gallery.html")
    
@app.route('/miner', methods=['GET'])
def get_miner():
    return render_template("miner12.html")


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    # app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    # app.run(host='192.168.0.120', port=8080)
