import os
from flask import Flask, render_template, jsonify
from dotenv import load_dotenv
from modules.contract import TickResponse, AgentState, Coordinates

load_dotenv()
app = Flask(__name__)
tick_counter = 0

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/api/tick')
def get_tick():
    global tick_counter
    tick_counter += 1
    delta = (tick_counter % 100) * 0.0005

    response = TickResponse(
        tick=tick_counter,
        shift_remaining_minutes=360 - tick_counter,
        baseline_agent=AgentState(
            agent_id="baseline",
            coords=Coordinates(lat=25.6866 + delta, lon=-100.3161),
            net_earnings=10.5 * tick_counter,
            fuel_spent=2.0 * tick_counter
        ),
        smart_agent=AgentState(
            agent_id="smart",
            coords=Coordinates(lat=25.6866, lon=-100.3161 - delta),
            net_earnings=15.2 * tick_counter,
            fuel_spent=1.8 * tick_counter
        )
    )
    return jsonify(response.model_dump())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5000)), debug=True)