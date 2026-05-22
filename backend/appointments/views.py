from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from .models import Appointment
from .serializers import AppointmentSerializer
from .permissions import IsAdminOrReadOnly


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.select_related('dentist', 'created_by')

        # Dentists only ever see their own appointments
        if user.role == 'dentist':
            qs = qs.filter(dentist=user)

        # --- Filters (used by admin to navigate the schedule) ---

        # Filter by specific date — main day view
        date = self.request.query_params.get('date', '').strip()
        if date:
            qs = qs.filter(date=date)

        # Filter by dentist (admin only — dentist filter is already applied above)
        dentist_id = self.request.query_params.get('dentist_id', '').strip()
        if dentist_id and user.role == 'admin':
            qs = qs.filter(dentist_id=dentist_id)

        # Search by patient name or phone
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(patient_name__icontains=search) |
                Q(patient_phone__icontains=search)
            )

        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Extra guard: only admin can delete
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can delete appointments.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)
