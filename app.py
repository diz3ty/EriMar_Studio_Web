from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/servicio/uñas')
def servicio_uñas():
    return render_template('nails_services.html')

@app.route('/servicio/pestañas')
def servicio_pestañas():
    return render_template('lashes_services.html')

@app.route('/servicio/capilares')
def servicio_capilares():
    return render_template('capilar_services.html')

@app.route('/promociones')
def promociones():
    return render_template('promociones.html')

# if __name__ == "__main__":
#    app.run(debug=True)