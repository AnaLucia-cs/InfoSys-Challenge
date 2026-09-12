from flask import Flask, render_template, request


def create_app() -> Flask:
    app = Flask(__name__)

    @app.route("/")
    def home() -> str:
        return render_template("main.html")

    @app.route('/ubi_repartidor_inicial', methods=['POST'])
    def guardar_punto():

        datos = request.get_json()

        lat = datos['lat']
        lon = datos['lon']

        print("Latitud:", lat)
        print("Longitud:", lon)

        return "Punto recibido"




    @app.get("/health")
    def health() -> tuple[dict[str, str], int]:
        return {"status": "ok"}, 200

    return app




app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
