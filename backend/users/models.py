from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('dentist', 'Dentist'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='dentist')

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        full = self.get_full_name()
        return f"{full} ({self.role})" if full else f"{self.username} ({self.role})"

    @property
    def is_admin_role(self):
        return self.role == 'admin'

    @property
    def is_dentist_role(self):
        return self.role == 'dentist'

    def display_name(self):
        return self.get_full_name() or self.username
