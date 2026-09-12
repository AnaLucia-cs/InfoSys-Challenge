import os
from flask import Flask, render_template, jsonify, request
from modules.simulation import ShiftSimulator

app = Flask(__name__)
simulator = ShiftSimulator()

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/api/tick')
def get_tick():
    current_state = simulator.advance_tick()
    return jsonify(current_state.model_dump())


@app.route("/api/pedido/aceptar", methods=["POST"])
def aceptar_pedido():
    datos = request.get_json()
    pedido_id = datos.get("pedido_id")
    lat = datos.get("lat")
    lng = datos.get("lng")
    print("Pedido:", pedido_id)
    print("Latitud:", lat)
    print("Longitud:", lng)
    # Aquí haces lo que necesites:
    # guardar en BD
    # actualizar estado
    # enviar al repartidor, etc.
    return jsonify({
        "ok": True,
        "pedido_id": pedido_id,
        "lat": lat,
        "lng": lng
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


