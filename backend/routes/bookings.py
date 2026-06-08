from flask import Blueprint, request, jsonify
from controllers.booking_controller import BookingController

bookings_bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")


@bookings_bp.route("", methods=["POST"])
def create_booking():
    result, status = BookingController.create(request.get_json() or {})
    return jsonify(result), status


@bookings_bp.route("/<booking_ref>", methods=["GET"])
def get_booking(booking_ref):
    result, status = BookingController.get_by_ref(booking_ref)
    return jsonify(result), status


@bookings_bp.route("/<booking_ref>/pay", methods=["POST"])
def pay_booking(booking_ref):
    result, status = BookingController.process_payment(booking_ref, request.get_json() or {})
    return jsonify(result), status


@bookings_bp.route("/time-slots", methods=["GET"])
def time_slots():
    return jsonify(BookingController.TIME_SLOTS), 200
