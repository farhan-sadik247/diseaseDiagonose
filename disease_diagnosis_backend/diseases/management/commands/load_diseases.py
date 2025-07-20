import csv
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from diseases.models import Disease


class Command(BaseCommand):
    help = 'Load diseases data from CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--csv-file',
            type=str,
            default='Diseases_Symptoms.csv',
            help='Path to the CSV file containing diseases data'
        )

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        
        # Try to find the CSV file in the project root
        if not os.path.isabs(csv_file):
            # Look in the parent directory of the Django project
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            csv_file = os.path.join(project_root, csv_file)
        
        if not os.path.exists(csv_file):
            self.stdout.write(
                self.style.ERROR(f'CSV file not found: {csv_file}')
            )
            return

        self.stdout.write(f'Loading diseases from: {csv_file}')
        
        # Clear existing data
        Disease.objects.all().delete()
        self.stdout.write('Cleared existing disease data')
        
        loaded_count = 0
        skipped_count = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row in reader:
                    # Skip empty rows
                    if not row.get('Name') or not row.get('Disease_Code'):
                        skipped_count += 1
                        continue
                    
                    # Convert string boolean values
                    contagious = row.get('Contagious', 'False').strip().lower() in ['true', '1', 'yes']
                    chronic = row.get('Chronic', 'False').strip().lower() in ['true', '1', 'yes']
                    
                    try:
                        disease, created = Disease.objects.get_or_create(
                            disease_code=row['Disease_Code'].strip(),
                            defaults={
                                'name': row['Name'].strip(),
                                'symptoms': row.get('Symptoms', '').strip(),
                                'treatments': row.get('Treatments', '').strip(),
                                'contagious': contagious,
                                'chronic': chronic,
                            }
                        )
                        
                        if created:
                            loaded_count += 1
                            if loaded_count % 50 == 0:
                                self.stdout.write(f'Loaded {loaded_count} diseases...')
                        else:
                            skipped_count += 1
                            
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(f'Error loading disease {row.get("Name", "Unknown")}: {e}')
                        )
                        skipped_count += 1
                        
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error reading CSV file: {e}')
            )
            return
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully loaded {loaded_count} diseases. Skipped {skipped_count} entries.'
            )
        )
