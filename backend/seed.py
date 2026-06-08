from datetime import date, timedelta
from models import db, User, Service, Booking, Payment


SERVICES = [
    {
        "name": "Ocean View Suite",
        "category": "room",
        "price": 8500,
        "description": "Luxurious suite with panoramic ocean views, king bed, and private balcony.",
        "image_url": "https://images.unsplash.com/photo-1611892440504-42a784e24d32?w=800&q=80",
        "capacity": 2,
    },
    {
        "name": "Garden Villa",
        "category": "room",
        "price": 12000,
        "description": "Private villa surrounded by tropical gardens with plunge pool.",
        "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        "capacity": 4,
    },
    {
        "name": "Deluxe Room",
        "category": "room",
        "price": 5500,
        "description": "Elegant room with modern amenities and city skyline views.",
        "image_url": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
        "capacity": 2,
    },
    {
        "name": "Rooftop Table",
        "category": "table",
        "price": 2500,
        "description": "Premium rooftop dining with sunset views and curated menu.",
        "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "capacity": 6,
    },
    {
        "name": "Garden Café Table",
        "category": "table",
        "price": 1500,
        "description": "Cozy outdoor seating in our lush garden café.",
        "image_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
        "capacity": 4,
    },
    {
        "name": "Spa & Wellness Package",
        "category": "service",
        "price": 4500,
        "description": "Full-day spa experience with massage, facial, and wellness lunch.",
        "image_url": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        "capacity": 1,
    },
    {
        "name": "Poolside Cabana",
        "category": "service",
        "price": 3000,
        "description": "Exclusive poolside cabana with butler service and refreshments.",
        "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "capacity": 4,
    },
    {
        "name": "Private Dining Experience",
        "category": "service",
        "price": 7500,
        "description": "Chef's table experience with wine pairing in a private setting.",
        "image_url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "capacity": 2,
    },
]


def seed_database():
    if Service.query.first():
        print("Database already seeded.")
        return

    admin = User(
        name="Admin User",
        email="admin@resortbook.com",
        phone="+91 98765 43210",
        role="admin",
    )
    admin.set_password("admin123")
    db.session.add(admin)

    for s in SERVICES:
        db.session.add(Service(**s, availability=True))

    customers = [
        ("Priya Sharma", "priya@email.com", "+91 98111 22334"),
        ("Rahul Mehta", "rahul@email.com", "+91 98222 33445"),
        ("Ananya Patel", "ananya@email.com", "+91 98333 44556"),
        ("Vikram Singh", "vikram@email.com", "+91 98444 55667"),
    ]
    users = []
    for name, email, phone in customers:
        u = User(name=name, email=email, phone=phone, role="customer")
        u.set_password("customer123")
        db.session.add(u)
        users.append(u)

    db.session.flush()

    services = Service.query.all()
    today = date.today()
    statuses = ["confirmed", "confirmed", "pending", "confirmed", "rejected"]
    slots = ["10:00 AM", "02:00 PM", "06:00 PM", "11:00 AM", "04:00 PM"]

    for i in range(15):
        svc = services[i % len(services)]
        usr = users[i % len(users)]
        d = today + timedelta(days=i % 7 - 3)
        status = statuses[i % len(statuses)]
        booking = Booking(
            booking_ref=Booking.generate_ref(),
            user_id=usr.id,
            service_id=svc.id,
            date=d,
            time_slot=slots[i % len(slots)],
            guests=min(2, svc.capacity),
            status=status,
            price=svc.price * min(2, svc.capacity),
        )
        db.session.add(booking)
        db.session.flush()

        if status == "confirmed":
            db.session.add(Payment(
                booking_id=booking.id,
                amount=booking.price,
                method="razorpay" if i % 2 == 0 else "upi",
                status="completed",
                transaction_id=f"TXN{booking.booking_ref}",
            ))

    db.session.commit()
    print("Database seeded successfully!")
    print("Admin login: admin@resortbook.com / admin123")
