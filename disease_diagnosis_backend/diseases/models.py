from django.db import models
from django.contrib.postgres.search import SearchVectorField
from django.contrib.postgres.indexes import GinIndex


class Disease(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)
    symptoms = models.TextField(blank=True, null=True)
    treatments = models.TextField(blank=True, null=True)
    disease_code = models.CharField(max_length=10, unique=True, db_index=True)
    contagious = models.BooleanField(default=False)
    chronic = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['disease_code']),
            models.Index(fields=['contagious']),
            models.Index(fields=['chronic']),
        ]

    def __str__(self):
        return f"{self.name} ({self.disease_code})"

    def get_symptoms_list(self):
        """Return symptoms as a list, split by comma"""
        if self.symptoms:
            return [symptom.strip() for symptom in self.symptoms.split(',')]
        return []

    def get_treatments_list(self):
        """Return treatments as a list, split by comma"""
        if self.treatments:
            return [treatment.strip() for treatment in self.treatments.split(',')]
        return []

    def symptom_match_score(self, input_symptoms):
        """Calculate how many input symptoms match this disease's symptoms"""
        if not self.symptoms or not input_symptoms:
            return 0

        disease_symptoms = [s.strip().lower() for s in self.symptoms.split(',')]
        input_symptoms_lower = [s.strip().lower() for s in input_symptoms]

        matches = 0
        for input_symptom in input_symptoms_lower:
            for disease_symptom in disease_symptoms:
                if input_symptom in disease_symptom or disease_symptom in input_symptom:
                    matches += 1
                    break

        return matches
