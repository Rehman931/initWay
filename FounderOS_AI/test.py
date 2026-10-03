from flask import Flask, jsonify, request
from flask_cors import CORS

from schemas.Details import details_state
from llm.connect_agents import graph

app = Flask(__name__)

CORS(
    app,
    origins=[
        "https://init-way.vercel.app"
    ]
)


@app.route("/agents", methods=["POST"])
def agent():
    data = request.get_json() or {}

    startup_context = data.get("constantquest")
    feature = data.get("feature")
    feature_input = data.get("featureInput", {})
    tav_results = data.get("internetdata")

    if not startup_context:
        return jsonify({
            "message": "Constant questions are required."
        }), 400

    if not feature:
        return jsonify({
            "message": "Feature is required."
        }), 400

    state: details_state = {
        "startupContext": startup_context,
        "feature": feature,
        "featureInput": feature_input,
        "tav_results": tav_results,
    }

    response = graph.invoke(state)

    return jsonify({
        "output": response.get("output"),
    }), 200


@app.route("/research", methods=["POST"])
def research():

    data = request.get_json() or {}
    startup_context = data.get("constantquest")

    if not startup_context:
        return jsonify({
            "message": "Constant questions are required."
        }), 400

    state = {
        "startupContext": startup_context,
        "feature": "prompt",
        "featureInput": {},
        "tav_results": {},
    }

    try:
        response = graph.invoke(state)

    except Exception as err:
        print("Graph error:", err)

        return jsonify({
            "message": "AI service failed."
        }), 500

    return jsonify({
        "internetdata": response.get("tav_results"),
    }), 200


@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}, 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
