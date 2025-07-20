import os
import sys
from pathlib import Path
import csv
from http.server import BaseHTTPRequestHandler
import json
import urllib.parse

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent / 'disease_diagnosis_backend'
sys.path.insert(0, str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'disease_diagnosis_backend.settings_vercel')

# Import and configure Django
import django
from django.conf import settings
django.setup()

# Import models
from diseases.models import Disease

# Load CSV data if database is empty
def load_csv_data():
    if Disease.objects.count() == 0:
        csv_path = Path(__file__).parent.parent / 'Diseases_Symptoms.csv'
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

# Initialize data
load_csv_data()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # Health check
        if path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                'status': 'healthy',
                'backend': 'django',
                'diseases_loaded': Disease.objects.count() > 0,
                'total_diseases': Disease.objects.count()
            }
            self.wfile.write(json.dumps(response).encode())
            return

        # Stats endpoint
        if path == '/api/stats':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            total_diseases = Disease.objects.count()
            contagious_count = Disease.objects.filter(contagious=True).count()
            chronic_count = Disease.objects.filter(chronic=True).count()

            response = {
                'total_diseases': total_diseases,
                'contagious_diseases': contagious_count,
                'chronic_diseases': chronic_count,
                'non_contagious_diseases': total_diseases - contagious_count,
                'non_chronic_diseases': total_diseases - chronic_count,
            }
            self.wfile.write(json.dumps(response).encode())
            return

        # Diseases list endpoint
        if path == '/api/diseases/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            diseases = Disease.objects.all()[:20]  # First 20 diseases
            results = []
            for disease in diseases:
                results.append({
                    'id': disease.id,
                    'name': disease.name,
                    'disease_code': disease.disease_code,
                    'contagious': disease.contagious,
                    'chronic': disease.chronic,
                    'symptoms_count': len(disease.symptoms.split(',')) if disease.symptoms else 0
                })

            response = {
                'count': Disease.objects.count(),
                'next': None,
                'previous': None,
                'results': results
            }
            self.wfile.write(json.dumps(response).encode())
            return

        # Default response
        self.send_response(404)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'error': 'Not found'}).encode())
