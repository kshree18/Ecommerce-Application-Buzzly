# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements (if any) - here we have only Flask
RUN pip install flask

# Copy the app code
COPY app.py /app/
COPY templates /app/templates

# Expose port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
