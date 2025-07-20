from django.contrib import admin
from .models import Disease


@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ['name', 'disease_code', 'contagious', 'chronic', 'created_at']
    list_filter = ['contagious', 'chronic', 'created_at']
    search_fields = ['name', 'disease_code', 'symptoms']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'disease_code')
        }),
        ('Medical Details', {
            'fields': ('symptoms', 'treatments', 'contagious', 'chronic')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
