from flask import Flask, render_template
from generateJWT import getJwt
import threading
import time

app = Flask(__name__)

current_token = None

def refresh_token():
    global current_token
    while True:
        current_token = getJwt()
        #print("Token diperbarui:", current_token)
        print("Token Diperbarui")
        time.sleep(600)  # 600 detik = 10 menit

@app.route("/")
def index():
    token = getJwt()
    return render_template("index.html", token=token)

if __name__ == "__main__":
    t = threading.Thread(target=refresh_token, daemon=True)
    t.start()
    app.run(debug=True,host='143.198.90.217',port=443,ssl_context=("././origin.pem","././private.key"))
