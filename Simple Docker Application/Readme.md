# Simple Docker Application Guide

This guide demonstrates how to create and run a basic Docker application using Python.

## Prerequisites
- Docker Desktop ([Download here](https://www.docker.com/products/docker-desktop))
- Basic understanding of command line

## Quick Start Guide

### Step 1: Create Application Files

1. Create a new directory:
```bash
mkdir simple-docker-app
cd simple-docker-app
```

2. Create a Python file application

### Step 2: Create Dockerfile

Create a file named `Dockerfile` (no extension):
```dockerfile
# Use an official Python runtime
FROM python:3.8-slim

# Set working directory
WORKDIR /app

# Copy application
COPY . /app

# Run the application
CMD ["python", "app.py"]
```

### Step 3: Build and Run

1. Build the Docker image:
```bash
docker build -t my-python-app .
```

2. Run the container:
```bash
docker run my-python-app
```

