from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Disease
from .serializers import (
    DiseaseSerializer, DiseaseListSerializer,
    SymptomCheckerSerializer, SymptomCheckerResultSerializer
)


class DiseaseListView(generics.ListAPIView):
    """
    List all diseases with search and filtering capabilities
    """
    serializer_class = DiseaseListSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = Disease.objects.all()

        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(symptoms__icontains=search) |
                Q(disease_code__icontains=search)
            )

        # Filter by contagious
        contagious = self.request.query_params.get('contagious', None)
        if contagious is not None:
            contagious_bool = contagious.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(contagious=contagious_bool)

        # Filter by chronic
        chronic = self.request.query_params.get('chronic', None)
        if chronic is not None:
            chronic_bool = chronic.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(chronic=chronic_bool)

        return queryset.order_by('name')


class DiseaseDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific disease by ID
    """
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer


@api_view(['POST'])
def symptom_checker(request):
    """
    Check symptoms against disease database and return ranked matches
    """
    serializer = SymptomCheckerSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    input_symptoms = serializer.validated_data['symptoms']

    # Get all diseases and calculate match scores
    diseases = Disease.objects.all()
    results = []

    for disease in diseases:
        match_score = disease.symptom_match_score(input_symptoms)
        if match_score > 0:  # Only include diseases with at least one symptom match
            total_symptoms = len(disease.get_symptoms_list())
            match_percentage = (match_score / max(len(input_symptoms), total_symptoms)) * 100

            # Add match data to disease object for serialization
            disease.match_score = match_score
            disease.match_percentage = round(match_percentage, 2)
            results.append(disease)

    # Sort by match score (descending) and then by match percentage
    results.sort(key=lambda x: (-x.match_score, -x.match_percentage))

    # Limit to top 10 results
    results = results[:10]

    serializer = SymptomCheckerResultSerializer(results, many=True)

    return Response({
        'input_symptoms': input_symptoms,
        'total_matches': len(results),
        'results': serializer.data
    })


@api_view(['GET'])
def disease_stats(request):
    """
    Get statistics about the disease database
    """
    total_diseases = Disease.objects.count()
    contagious_count = Disease.objects.filter(contagious=True).count()
    chronic_count = Disease.objects.filter(chronic=True).count()

    return Response({
        'total_diseases': total_diseases,
        'contagious_diseases': contagious_count,
        'chronic_diseases': chronic_count,
        'non_contagious_diseases': total_diseases - contagious_count,
        'non_chronic_diseases': total_diseases - chronic_count,
    })
