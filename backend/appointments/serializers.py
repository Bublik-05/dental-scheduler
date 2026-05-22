from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    dentist_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient_name',
            'patient_phone',
            'dentist',
            'dentist_name',
            'date',
            'start_time',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'dentist_name', 'created_at', 'updated_at']

    def get_dentist_name(self, obj):
        return obj.dentist.display_name()

    def validate_dentist(self, value):
        if value.role != 'dentist':
            raise serializers.ValidationError('Selected user is not a dentist.')
        if not value.is_active:
            raise serializers.ValidationError('Selected dentist account is inactive.')
        return value

    def validate(self, data):
        date = data.get('date')
        if date and date.weekday() == 6:  # Sunday
            raise serializers.ValidationError({'date': 'Clinic is closed on Sundays.'})
        return data
