import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder='.', template_folder='.')

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serves CSS, JavaScript, and other static assets."""
    return send_from_directory('.', filename)

if __name__ == '__main__':
    print("=" * 50)
    print(" Concert Piano is running!")
    print(" Open your browser and go to: http://localhost:8000")
    print("=" * 50)
    app.run(debug=True, port=8000)
