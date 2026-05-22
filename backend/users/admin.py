from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'first_name', 'last_name', 'role', 'is_active')
    list_filter = ('role', 'is_active')
    list_editable = ('role',)
    fieldsets = UserAdmin.fieldsets + (
        ('Clinic Role', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Clinic Role', {'fields': ('role', 'first_name', 'last_name')}),
    )
