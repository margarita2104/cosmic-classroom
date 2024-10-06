<img src="frontend/app/assets/images/rocket.png">

# Cosmic Classroom
Kepler's Horizon's Submission project for the 2024 NASA Space Apps Challenge
The following participants involved in this project:
<strong>Alan Geirnaert, Mamoona Quddus, Margarita Ferreira, Muhammad Rayyan, Olivier Lüthy, Valdilene Siqueira.</strong>

## Technologies used
1. Next.js
2. Django
3. Axios

## Project Setup Guide

This guide will help you set up the project using Next.js for the frontend and Django for the backend.

### Prerequisites

Make sure you have the following installed on your machine:

- Python 3.x
- Node.js and npm
- Django
- Virtualenv

### Getting Started

#### Backend Setup (Django)

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```
2. **Navigate to the frontend directory** (if applicable):

   ```bash
   cd backend
   ```
3. **Create a virtual environment**

   ```bash
   python -m venv .venv
   ```

4. **Activate the virtual environment**:

     ```bash
     python -m venv .venv. .venv/bin/activate
     ```

5. **Install the required Python packages**:

   ```bash
   pip install -r requirements.txt
   ```

6. **Run database migrations**:

   ```bash
   python manage.py migrate
   ```

7. **Create a superuser (optional)**:

   ```bash
   python manage.py createsuperuser
   ```

8. **Start the Django development server**:

   ```bash
   python manage.py runserver
   ```

#### Frontend Setup (Next.js)

1. **Navigate to the frontend directory** (if applicable):

   ```bash
   cd frontend
   ```

2. **Install the required Node.js packages**:

   ```bash
   npm install
   ```

3. **Start the Next.js development server**:

   ```bash
   npm run dev
   ```

### Accessing the Application

- The Django backend will be running on `http://127.0.0.1:8000/`.
- The Next.js frontend will typically be available at `http://localhost:3000/`.

Note that both environments need to be running so that you can see the items that have been retrieved from the database while you're accessing the frontend.

### Additional Notes

- Make sure to check your `.env` file for any environment variables required for the project.
- For production deployment, follow the respective deployment guides for Django and Next.js.