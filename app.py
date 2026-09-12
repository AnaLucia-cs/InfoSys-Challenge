from flask import Flask, render_template, jsonify, request
from modules.simulation import ShiftSimulator

app = Flask(__name__)
simulator = ShiftSimulator()

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/perfil')
def perfil():
    return render_template('perfil.html')

@app.route('/config')
def config():
    return render_template('config.html')


@app.route('/api/tick')
def get_tick():
    current_state = simulator.advance_tick()
    return jsonify(current_state.model_dump())


@app.route("/api/pedido/aceptar", methods=["POST"])
def aceptar_pedido():
    datos = request.get_json(silent=True) or {}
    pedido_id = datos.get("pedido_id")
    repartidor = datos.get("repartidor") or {}
    recogida = datos.get("recogida") or {}
    destino = datos.get("destino") or {}
    lat = repartidor.get("lat")
    lng = repartidor.get("lng")

    print("Pedido:", pedido_id)
    print("Latitud:", lat)
    print("Longitud:", lng)
    print("Recogida:", recogida)
    print("Destino:", destino)

    # Aquí haces lo que necesites:
    # guardar en BD
    # actualizar estado
    # enviar al repartidor, etc.

    return jsonify({
        "ok": True,
        "pedido_id": pedido_id,
        "lat": lat,
        "lng": lng,
        "recogida": recogida,
        "destino": destino
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


