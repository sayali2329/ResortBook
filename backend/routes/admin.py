from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from controllers.booking_controller import BookingController

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def _require_admin():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403
    return None


@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    err = _require_admin()
    if err:
        return err
    result, status = BookingController.get_dashboard_stats()
    return jsonify(result), status


@admin_bp.route("/bookings", methods=["GET"])
@jwt_required()
def list_bookings():
    err = _require_admin()
    if err:
        return err
    result, status = BookingController.get_all(
        status=request.args.get("status"),
        booking_date=request.args.get("date"),
    )
    return jsonify(result), status


@admin_bp.route("/bookings/<int:booking_id>/status", methods=["PATCH"])
@jwt_required()
def update_booking_status(booking_id):
    err = _require_admin()
    if err:
        return err
    data = request.get_json() or {}
    result, status = BookingController.update_status(booking_id, data.get("status"))
    return jsonify(result), status


@admin_bp.route("/customers", methods=["GET"])
@jwt_required()
def list_customers():
    err = _require_admin()
    if err:
        return err
    result, status = BookingController.get_customers()
    return jsonify(result), status


@admin_bp.route("/analytics", methods=["GET"])
@jwt_required()
def analytics():
    err = _require_admin()
    if err:
        return err
    result, status = BookingController.get_analytics()
    return jsonify(result), status
