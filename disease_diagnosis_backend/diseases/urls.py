from django.urls import path
from . import views

urlpatterns = [
    path('diseases/', views.DiseaseListView.as_view(), name='disease-list'),
    path('diseases/<int:pk>/', views.DiseaseDetailView.as_view(), name='disease-detail'),
    path('symptom-checker/', views.symptom_checker, name='symptom-checker'),
    path('stats/', views.disease_stats, name='disease-stats'),
]
