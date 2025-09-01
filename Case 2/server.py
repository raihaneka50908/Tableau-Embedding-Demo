from flask import Flask, render_template
from generateJWT import getJwt

app = Flask(__name__)

@app.route("/")
def index():
    token = getJwt()
    return render_template("index.html", token=token)

if __name__ == "__main__":
    app.run(debug=True)
