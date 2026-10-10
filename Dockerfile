# ---------- FRONTEND BUILD STAGE ----------
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies (fix peer deps issue)
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build


# ---------- BACKEND STAGE ----------
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (FIXED chromium issue)
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    wget \
    gnupg \
    unzip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Selenium
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

# Copy python requirements first to leverage Docker layer caching
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy remaining backend code
COPY backend/ ./backend/

# Copy built frontend into backend static folder
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose Flask port
EXPOSE 5000

# Run Flask app API server
CMD ["python", "backend/run_api_server.py", "--host", "0.0.0.0", "--port", "5000"]