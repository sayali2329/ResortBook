from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .service import Service
from .booking import Booking
from .payment import Payment

__all__ = ["db", "User", "Service", "Booking", "Payment"]
