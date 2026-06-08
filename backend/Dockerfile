FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .
ENV DATABASE_URL=sqlite:////app/data/booking.db
ENV FLASK_APP=app.py

RUN python -c "from app import app; from seed import seed_database; exec('with app.app_context():\n seed_database()')"

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
