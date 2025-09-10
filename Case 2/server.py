from flask import Flask, render_template
from generateJWT import getJwt
import threading
import time
import json
import os

app = Flask(__name__)

current_token = None
lock = threading.Lock()

def refresh_token():
    global current_token
    while True:
        with lock:
            current_token = getJwt()
            print("Token diperbarui:", current_token[:30], "...")

            # simpan ke static/token.json
            with open(os.path.join("static", "token.json"), "w") as f:
                json.dump({"token": current_token}, f)

        time.sleep(540)  # refresh setiap 9 menit

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    with lock:
        current_token = getJwt()
        with open(os.path.join("static", "token.json"), "w") as f:
            json.dump({"token": current_token}, f)

    t = threading.Thread(target=refresh_token, daemon=True)
    t.start()
    app.run(debug=True)
