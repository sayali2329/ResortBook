from flask import Blueprint, request, jsonify
from controllers.auth_controller import AuthController

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    result, status = AuthController.register(request.get_json() or {})
    return jsonify(result), status


@auth_bp.route("/login", methods=["POST"])
def login():
    result, status = AuthController.login(request.get_json() or {})
    return jsonify(result), status


@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    result, status = AuthController.admin_login(request.get_json() or {})
    return jsonify(result), status
