import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS

# Импортируем наши модули
from documents import documents_bp
from auth import auth_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Настройка CORS для взаимодействия с frontend
CORS(app, supports_credentials=True)

# Регистрируем blueprint'ы
app.register_blueprint(documents_bp, url_prefix='/api/documents')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
