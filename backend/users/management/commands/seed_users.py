"""
Creates the initial admin + dentist accounts for the clinic.

Usage:
    python manage.py seed_users

Run once after your first `migrate`. Safe to re-run — skips users
that already exist. Prints credentials to stdout (change passwords
immediately after first login via Django admin).
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

USERS = [
    # (username, password, first_name, last_name, role)
    ('admin',    'admin1234',   'Admin',   '',        'admin'),
    ('dentist1', 'dentist1234', 'Aliya',   'Seitkali','dentist'),
    ('dentist2', 'dentist1234', 'Bekzod',  'Rahimov', 'dentist'),
    ('dentist3', 'dentist1234', 'Dinara',  'Ospanova','dentist'),
]


class Command(BaseCommand):
    help = 'Seed initial admin and dentist accounts'

    def handle(self, *args, **options):
        self.stdout.write('\nSeeding users...\n')

        for username, password, first, last, role in USERS:
            if User.objects.filter(username=username).exists():
                self.stdout.write(f'  SKIP  {username} (already exists)')
                continue

            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first,
                last_name=last,
                role=role,
                is_staff=(role == 'admin'),
                is_superuser=(role == 'admin'),
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'  OK    {username} / {password}  [{role}]'
                )
            )

        self.stdout.write('\n⚠️  Change all passwords immediately after first login!')
        self.stdout.write('   Django admin → /admin/ → Users\n')
