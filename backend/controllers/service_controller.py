from models import db, Service, Booking
from datetime import date


class ServiceController:
    @staticmethod
    def get_all(category=None, available_only=False):
        query = Service.query
        if category:
            query = query.filter_by(category=category)
        if available_only:
            query = query.filter_by(availability=True)
        services = query.order_by(Service.price).all()
        return [s.to_dict() for s in services], 200

    @staticmethod
    def get_by_id(service_id: int):
        service = Service.query.get(service_id)
        if not service:
            return {"error": "Service not found"}, 404
        return service.to_dict(), 200

    @staticmethod
    def create(data: dict):
        service = Service(
            name=data.get("name"),
            category=data.get("category", "room"),
            price=float(data.get("price", 0)),
            description=data.get("description", ""),
            image_url=data.get("image_url", ""),
            capacity=int(data.get("capacity", 2)),
            availability=data.get("availability", True),
        )
        db.session.add(service)
        db.session.commit()
        return service.to_dict(), 201

    @staticmethod
    def update(service_id: int, data: dict):
        service = Service.query.get(service_id)
        if not service:
            return {"error": "Service not found"}, 404

        for field in ["name", "category", "description", "image_url", "availability"]:
            if field in data:
                setattr(service, field, data[field])
        if "price" in data:
            service.price = float(data["price"])
        if "capacity" in data:
            service.capacity = int(data["capacity"])

        db.session.commit()
        return service.to_dict(), 200

    @staticmethod
    def delete(service_id: int):
        service = Service.query.get(service_id)
        if not service:
            return {"error": "Service not found"}, 404
        db.session.delete(service)
        db.session.commit()
        return {"message": "Service deleted"}, 200

    @staticmethod
    def check_availability(service_id: int, booking_date: str, time_slot: str):
        service = Service.query.get(service_id)
        if not service:
            return {"error": "Service not found"}, 404
        if not service.availability:
            return {"available": False, "reason": "Service is currently unavailable"}, 200

        try:
            parsed_date = date.fromisoformat(booking_date)
        except ValueError:
            return {"error": "Invalid date format"}, 400

        conflict = Booking.query.filter(
            Booking.service_id == service_id,
            Booking.date == parsed_date,
            Booking.time_slot == time_slot,
            Booking.status.in_(["pending", "confirmed"]),
        ).first()

        return {
            "available": conflict is None,
            "service": service.to_dict(),
            "reason": "Slot already booked" if conflict else None,
        }, 200
