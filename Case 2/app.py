from flask import Flask, render_template
from generateJWT import getJwt

app = Flask(__name__)

@app.route("/")
def home():
    # generate JWT setiap kali halaman diminta
    token = getJwt()
    return render_template("index.html", jwt_token=token)

if __name__ == "__main__":
    app.run(debug=True)
