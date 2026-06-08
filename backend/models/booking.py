import uuid
from datetime import datetime
from . import db


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    booking_ref = db.Column(db.String(20), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time_slot = db.Column(db.String(20), nullable=False)
    guests = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default="pending")  # pending | confirmed | rejected | cancelled
    price = db.Column(db.Float, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    payment = db.relationship("Payment", backref="booking", uselist=False, lazy=True)

    @staticmethod
    def generate_ref():
        return f"BK{uuid.uuid4().hex[:8].upper()}"

    def to_dict(self, include_relations=False):
        data = {
            "id": self.id,
            "booking_ref": self.booking_ref,
            "user_id": self.user_id,
            "service_id": self.service_id,
            "date": self.date.isoformat(),
            "time_slot": self.time_slot,
            "guests": self.guests,
            "status": self.status,
            "price": self.price,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_relations:
            data["user"] = self.user.to_dict() if self.user else None
            data["service"] = self.service.to_dict() if self.service else None
            data["payment"] = self.payment.to_dict() if self.payment else None
        return data
