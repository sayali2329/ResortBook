from flask_jwt_extended import create_access_token
from models import db, User


class AuthController:
    @staticmethod
    def register(data: dict):
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        phone = data.get("phone", "").strip()
        password = data.get("password", "")

        if not all([name, email, password]):
            return {"error": "Name, email and password are required"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already registered"}, 409

        user = User(name=name, email=email, phone=phone, role="customer")
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
        return {"user": user.to_dict(), "token": token}, 201

    @staticmethod
    def login(data: dict):
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"error": "Invalid email or password"}, 401

        token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
        return {"user": user.to_dict(), "token": token}, 200

    @staticmethod
    def admin_login(data: dict):
        result, status = AuthController.login(data)
        if status != 200:
            return result, status
        user = User.query.filter_by(email=data.get("email", "").strip().lower()).first()
        if user.role != "admin":
            return {"error": "Admin access required"}, 403
        return result, status
