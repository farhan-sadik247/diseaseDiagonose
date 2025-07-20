from rest_framework import serializers
from .models import Disease


class DiseaseSerializer(serializers.ModelSerializer):
    symptoms_list = serializers.SerializerMethodField()
    treatments_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Disease
        fields = [
            'id', 'name', 'symptoms', 'treatments', 'disease_code',
            'contagious', 'chronic', 'symptoms_list', 'treatments_list',
            'created_at', 'updated_at'
        ]
    
    def get_symptoms_list(self, obj):
        return obj.get_symptoms_list()
    
    def get_treatments_list(self, obj):
        return obj.get_treatments_list()


class DiseaseListSerializer(serializers.ModelSerializer):
    """Simplified serializer for disease list view"""
    symptoms_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Disease
        fields = [
            'id', 'name', 'disease_code', 'contagious', 'chronic', 'symptoms_count'
        ]
    
    def get_symptoms_count(self, obj):
        return len(obj.get_symptoms_list())


class SymptomCheckerSerializer(serializers.Serializer):
    symptoms = serializers.ListField(
        child=serializers.CharField(max_length=200),
        min_length=1,
        help_text="List of symptoms to check"
    )


class SymptomCheckerResultSerializer(serializers.ModelSerializer):
    match_score = serializers.IntegerField()
    match_percentage = serializers.FloatField()
    symptoms_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Disease
        fields = [
            'id', 'name', 'disease_code', 'contagious', 'chronic',
            'match_score', 'match_percentage', 'symptoms_list'
        ]
    
    def get_symptoms_list(self, obj):
        return obj.get_symptoms_list()
