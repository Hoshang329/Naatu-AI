# Use a lightweight, official Python base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the backend requirements file first to leverage Docker's build cache
COPY backend/requirements.txt .

# Install dependencies, including the smaller CPU-only version of PyTorch
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt --find-links https://download.pytorch.org/whl/cpu/torch_stable.html

# Copy your application code and data into the container
# This includes main.py, the chroma_db folder, etc.
COPY backend/ ./backend/
COPY knowledge_base.json .

# Expose the port the app will run on (Hugging Face standard)
EXPOSE 7860

# The command to start the Gunicorn server when the container launches
CMD ["gunicorn", "--chdir", "backend", "--bind", "0.0.0.0:7860", "--workers", "1", "main:app"]