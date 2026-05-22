from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'patient_phone', 'dentist', 'date', 'start_time', 'created_at')
    list_filter = ('dentist', 'date')
    search_fields = ('patient_name', 'patient_phone')
    date_hierarchy = 'date'
    raw_id_fields = ('dentist', 'created_by')
    readonly_fields = ('created_at', 'updated_at', 'created_by')

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
