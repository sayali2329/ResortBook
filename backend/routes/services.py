from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from controllers.service_controller import ServiceController

services_bp = Blueprint("services", __name__, url_prefix="/api/services")


@services_bp.route("", methods=["GET"])
def list_services():
    category = request.args.get("category")
    available_only = request.args.get("available") == "true"
    result, status = ServiceController.get_all(category, available_only)
    return jsonify(result), status


@services_bp.route("/<int:service_id>", methods=["GET"])
def get_service(service_id):
    result, status = ServiceController.get_by_id(service_id)
    return jsonify(result), status


@services_bp.route("/<int:service_id>/availability", methods=["GET"])
def check_availability(service_id):
    booking_date = request.args.get("date")
    time_slot = request.args.get("time_slot")
    if not booking_date or not time_slot:
        return jsonify({"error": "date and time_slot are required"}), 400
    result, status = ServiceController.check_availability(service_id, booking_date, time_slot)
    return jsonify(result), status


@services_bp.route("", methods=["POST"])
@jwt_required()
def create_service():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403
    result, status = ServiceController.create(request.get_json() or {})
    return jsonify(result), status


@services_bp.route("/<int:service_id>", methods=["PUT"])
@jwt_required()
def update_service(service_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403
    result, status = ServiceController.update(service_id, request.get_json() or {})
    return jsonify(result), status


@services_bp.route("/<int:service_id>", methods=["DELETE"])
@jwt_required()
def delete_service(service_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403
    result, status = ServiceController.delete(service_id)
    return jsonify(result), status
