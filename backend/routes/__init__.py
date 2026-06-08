from .auth import auth_bp
from .services import services_bp
from .bookings import bookings_bp
from .admin import admin_bp

__all__ = ["auth_bp", "services_bp", "bookings_bp", "admin_bp"]
