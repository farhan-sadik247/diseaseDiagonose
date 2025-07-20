import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent / 'disease_diagnosis_backend'
sys.path.insert(0, str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'disease_diagnosis_backend.settings_vercel')

# Import and configure Django
import django
django.setup()

# Import the WSGI application
from disease_diagnosis_backend.vercel_wsgi import application

# Vercel function handler
def handler(request):
    return application(request)
