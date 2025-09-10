from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

# Tableau config
SERVER = "https://prod-apsoutheast-c.online.tableau.com"
TOKEN_NAME = "TRec"
TOKEN_SECRET = "7YJd315VQuetS2z1GOdX7g==:5CM5OrBt49cw43QEKPWiVyW3ElrtUsD5"
SITE = "Suplosite"  # ganti dengan nama site kamu, "" jika default
API_VERSION = "3.21"

def get_tableau_token():
    url = f"{SERVER}/api/{API_VERSION}/auth/signin"
    payload = {
        "credentials": {
            "personalAccessTokenName": TOKEN_NAME,
            "personalAccessTokenSecret": TOKEN_SECRET,
            "site": {"contentUrl": SITE}
        }
    }
    res = requests.post(url, json=payload)
    res.raise_for_status()
    return res.json()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tableau_token")
def tableau_token():
    return jsonify(get_tableau_token())

if __name__ == "__main__":
    app.run(debug=False,host="143.198.90.217",port=443,ssl_context=("../../origin.pem","../../private.key"))

