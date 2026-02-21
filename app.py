from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/service/nails')
def service_nails():
    return render_template('nails_services.html')

@app.route('/service/lashes')
def service_lashes():
    return render_template('lashes_services.html')

@app.route('/service/capilar')
def service_capilar():
    return render_template('capilar_services.html')

@app.route('/promos')
def promos():
    return render_template('promos.html')

@app.route('/courses')
def courses():
    return render_template('courses.html')

#if __name__ == "__main__":
#    app.run(debug=True)