from django.db import models
from django.core.exceptions import ValidationError


class Appointment(models.Model):
    # Patient info stored directly — no separate Patient model for MVP
    patient_name = models.CharField(max_length=150)
    patient_phone = models.CharField(max_length=30)

    dentist = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'dentist'},
        related_name='appointments',
    )

    date = models.DateField()
    start_time = models.TimeField()

    notes = models.TextField(blank=True, default='')

    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_appointments',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'start_time']
        indexes = [
            models.Index(fields=['date', 'dentist']),
            models.Index(fields=['patient_name']),
            models.Index(fields=['patient_phone']),
        ]

    def __str__(self):
        return (
            f"{self.patient_name} → {self.dentist.display_name()} "
            f"@ {self.date} {self.start_time}"
        )

