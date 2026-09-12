from flask import Flask, render_template


def create_app() -> Flask:
    app = Flask(__name__)

    @app.route("/")
    def home() -> str:
        return render_template("main.html")

    @app.get("/health")
    def health() -> tuple[dict[str, str], int]:
        return {"status": "ok"}, 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
