import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient_name', models.CharField(max_length=150)),
                ('patient_phone', models.CharField(max_length=30)),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('notes', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('dentist', models.ForeignKey(
                    limit_choices_to={'role': 'dentist'},
                    on_delete=django.db.models.deletion.PROTECT,
                    related_name='appointments',
                    to=settings.AUTH_USER_MODEL,
                )),
                ('created_by', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='created_appointments',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'ordering': ['date', 'start_time'],
            },
        ),
        migrations.AddIndex(
            model_name='appointment',
            index=models.Index(fields=['date', 'dentist'], name='appointmen_date_dentist_idx'),
        ),
        migrations.AddIndex(
            model_name='appointment',
            index=models.Index(fields=['patient_name'], name='appointmen_patient_name_idx'),
        ),
        migrations.AddIndex(
            model_name='appointment',
            index=models.Index(fields=['patient_phone'], name='appointmen_patient_phone_idx'),
        ),
    ]
