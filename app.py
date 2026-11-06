from flask import Flask, redirect, render_template, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/services')
def services():
    return redirect(url_for('home', _anchor='services-view'))

@app.route('/policies')
def policies():
    return redirect(url_for('home', _anchor='policies-view'))

@app.route('/contact')
def contact():
    return redirect(url_for('home', _anchor='contact-view'))

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
    return redirect(url_for('home', _anchor='promos-view'))

@app.route('/courses')
def courses():
    return redirect(url_for('home', _anchor='courses-view'))

# if __name__ == "__main__":
#     app.run(debug=True)