import os
from flask import Flask, render_template, jsonify
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
