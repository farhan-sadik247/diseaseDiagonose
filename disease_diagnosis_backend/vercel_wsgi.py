import os
import sys
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(project_dir))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'disease_diagnosis_backend.settings_vercel')

import django
from django.core.wsgi import get_wsgi_application

# Initialize Django
django.setup()

# Import models and run initial setup
from diseases.models import Disease
from django.core.management import execute_from_command_line
import csv

def initialize_database():
    """Initialize database with disease data if empty"""
    try:
        # Check if database is empty
        if Disease.objects.count() == 0:
            # Load CSV data
            csv_path = project_dir / 'Diseases_Symptoms.csv'
            if csv_path.exists():
                with open(csv_path, 'r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)

                    for row in reader:
                        if row.get('Name') and row.get('Disease_Code'):
                            contagious = str(row.get('Contagious', 'False')).lower() in ['true', '1', 'yes']
                            chronic = str(row.get('Chronic', 'False')).lower() in ['true', '1', 'yes']

                            Disease.objects.get_or_create(
                                disease_code=row['Disease_Code'],
                                defaults={
                                    'name': row['Name'],
                                    'symptoms': row.get('Symptoms', ''),
                                    'treatments': row.get('Treatments', ''),
                                    'contagious': contagious,
                                    'chronic': chronic,
                                }
                            )
                print(f"Loaded {Disease.objects.count()} diseases")
    except Exception as e:
        print(f"Error initializing database: {e}")

# Run migrations and initialize data
try:
    execute_from_command_line(['manage.py', 'migrate', '--run-syncdb'])
    initialize_database()
except Exception as e:
    print(f"Setup error: {e}")

# Get WSGI application
application = get_wsgi_application()

# Vercel handler
def handler(request, context):
    return application(request, context)
