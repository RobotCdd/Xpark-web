# Stage 1: Build React frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

# Stage 2: Backend with Django
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy Django project
COPY backend/ .

# Copy React build into Django static dir
COPY --from=frontend /app/frontend/build /app/static/

# Collect static files
RUN python manage.py collectstatic --noinput

# Start with Gunicorn
CMD ["gunicorn", "Website.wsgi:application", "--bind", "0.0.0.0:8000"]
