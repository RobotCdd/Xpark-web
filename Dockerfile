# Stage 1: Build React frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/ .
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 2: Backend with Django
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY website/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy Django project
COPY website/ .

# Copy React build into Django static dir
COPY --from=frontend /app/frontend/build/static /app/staticfiles/
COPY --from=frontend /app/frontend/build/index.html /app/templates/index.html

# Collect static files
RUN python manage.py collectstatic --noinput

RUN ls -l /app/templates/
RUN ls -l /app/staticfiles/

# Start with Gunicorn
CMD ["gunicorn", "website.wsgi:application", "--bind", "0.0.0.0:8080"]

COPY frontend/public/XPLogo.png /app/staticfiles/XPLogo.png
COPY frontend/public/PlaceholderProfile.png /app/staticfiles/PlaceholderProfile.png
COPY frontend/public/XparkBackdrop.jpg /app/staticfiles/XparkBackdrop.jpg
COPY frontend/public/XparkBackdrop2.jpg /app/staticfiles/XparkBackdrop2.jpg
COPY frontend/public/XparkBackdrop3.jpg /app/staticfiles/XparkBackdrop3.jpg
COPY frontend/public/XparkBackdrop4.jpg /app/staticfiles/XparkBackdrop4.jpg
