from datetime import date, datetime, timedelta
from sqlalchemy import func
from models import db, Booking, Payment, Service, User
from controllers.service_controller import ServiceController


class BookingController:
    TIME_SLOTS = [
        "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
        "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
        "08:00 PM", "09:00 PM",
    ]

    @staticmethod
    def _get_or_create_user(data: dict):
        email = data.get("email", "").strip().lower()
        name = data.get("name", "").strip()
        phone = data.get("phone", "").strip()

        user = User.query.filter_by(email=email).first() if email else None
        if not user:
            if not email or not name:
                return None, {"error": "Name and email are required"}, 400
            user = User(name=name, email=email, phone=phone, role="customer")
            user.set_password("guest123")
            db.session.add(user)
            db.session.flush()
        elif phone and not user.phone:
            user.phone = phone
        return user, None, None

    @staticmethod
    def create(data: dict):
        user, error, status = BookingController._get_or_create_user(data)
        if error:
            return error, status

        service_id = data.get("service_id")
        booking_date = data.get("date")
        time_slot = data.get("time_slot")
        guests = int(data.get("guests", 1))
        notes = data.get("notes", "")

        service = Service.query.get(service_id)
        if not service:
            return {"error": "Service not found"}, 404

        avail, avail_status = ServiceController.check_availability(service_id, booking_date, time_slot)
        if avail_status != 200:
            return avail, avail_status
        if not avail.get("available"):
            return {"error": avail.get("reason", "Not available")}, 409

        try:
            parsed_date = date.fromisoformat(booking_date)
        except ValueError:
            return {"error": "Invalid date format"}, 400

        price = service.price * guests
        booking = Booking(
            booking_ref=Booking.generate_ref(),
            user_id=user.id,
            service_id=service_id,
            date=parsed_date,
            time_slot=time_slot,
            guests=guests,
            status="pending",
            price=price,
            notes=notes,
        )
        db.session.add(booking)
        db.session.commit()

        BookingController._send_notification_placeholder(booking, "created")
        return booking.to_dict(include_relations=True), 201

    @staticmethod
    def get_all(status=None, booking_date=None, user_id=None):
        query = Booking.query
        if status:
            query = query.filter_by(status=status)
        if booking_date:
            try:
                query = query.filter_by(date=date.fromisoformat(booking_date))
            except ValueError:
                return {"error": "Invalid date format"}, 400
        if user_id:
            query = query.filter_by(user_id=user_id)

        bookings = query.order_by(Booking.created_at.desc()).all()
        return [b.to_dict(include_relations=True) for b in bookings], 200

    @staticmethod
    def get_by_ref(booking_ref: str):
        booking = Booking.query.filter_by(booking_ref=booking_ref).first()
        if not booking:
            return {"error": "Booking not found"}, 404
        return booking.to_dict(include_relations=True), 200

    @staticmethod
    def update_status(booking_id: int, status: str):
        if status not in ["pending", "confirmed", "rejected", "cancelled"]:
            return {"error": "Invalid status"}, 400

        booking = Booking.query.get(booking_id)
        if not booking:
            return {"error": "Booking not found"}, 404

        booking.status = status
        db.session.commit()
        BookingController._send_notification_placeholder(booking, status)
        return booking.to_dict(include_relations=True), 200

    @staticmethod
    def process_payment(booking_ref: str, data: dict):
        booking = Booking.query.filter_by(booking_ref=booking_ref).first()
        if not booking:
            return {"error": "Booking not found"}, 404

        method = data.get("method", "razorpay")
        amount = float(data.get("amount", booking.price))

        payment = Payment.query.filter_by(booking_id=booking.id).first()
        if not payment:
            payment = Payment(
                booking_id=booking.id,
                amount=amount,
                method=method,
                status="completed",
                transaction_id=f"TXN{booking.booking_ref}",
            )
            db.session.add(payment)
        else:
            payment.status = "completed"
            payment.method = method
            payment.transaction_id = f"TXN{booking.booking_ref}"

        booking.status = "confirmed"
        db.session.commit()

        BookingController._send_notification_placeholder(booking, "payment_confirmed")
        return {
            "booking": booking.to_dict(include_relations=True),
            "payment": payment.to_dict(),
            "message": "Payment successful (demo mode)",
        }, 200

    @staticmethod
    def get_dashboard_stats():
        today = date.today()
        total_bookings = Booking.query.count()
        today_bookings = Booking.query.filter_by(date=today).count()
        confirmed = Booking.query.filter_by(status="confirmed").all()
        revenue = sum(b.price for b in confirmed)
        pending = Booking.query.filter_by(status="pending").count()

        return {
            "total_bookings": total_bookings,
            "today_bookings": today_bookings,
            "revenue": revenue,
            "pending_bookings": pending,
            "confirmed_bookings": len(confirmed),
        }, 200

    @staticmethod
    def get_analytics():
        today = date.today()
        days = []
        for i in range(6, -1, -1):
            d = today - timedelta(days=i)
            count = Booking.query.filter_by(date=d).count()
            rev = db.session.query(func.sum(Booking.price)).filter(
                Booking.date == d, Booking.status == "confirmed"
            ).scalar() or 0
            days.append({
                "date": d.strftime("%b %d"),
                "bookings": count,
                "revenue": float(rev),
            })

        popular = (
            db.session.query(Service.name, func.count(Booking.id).label("count"))
            .join(Booking, Booking.service_id == Service.id)
            .group_by(Service.id)
            .order_by(func.count(Booking.id).desc())
            .limit(5)
            .all()
        )

        return {
            "daily": days,
            "popular_services": [{"name": n, "bookings": c} for n, c in popular],
        }, 200

    @staticmethod
    def get_customers():
        customers = User.query.filter_by(role="customer").all()
        result = []
        for c in customers:
            bookings = Booking.query.filter_by(user_id=c.id).order_by(Booking.created_at.desc()).all()
            result.append({
                **c.to_dict(),
                "total_bookings": len(bookings),
                "total_spent": sum(b.price for b in bookings if b.status == "confirmed"),
                "bookings": [b.to_dict(include_relations=True) for b in bookings[:5]],
            })
        return result, 200

    @staticmethod
    def _send_notification_placeholder(booking: Booking, event: str):
        user = booking.user
        print(f"[NOTIFICATION] {event}: Booking {booking.booking_ref} for {user.email}")
        print(f"  -> Email placeholder: Sent to {user.email}")
        print(f"  -> WhatsApp placeholder: Sent to {user.phone or 'N/A'}")
