from django.db import models
from django.conf import settings

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=100)
    minimum_quantity = models.PositiveIntegerField(default=1)
    current_quantity = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True, null=True)    

class Historical(models.Model):
    operation_type_choices = [
        ('Input', 'Input'),
        ('Output', 'Output'),
    ]

    operation_type = models.CharField(max_length=50, choices=operation_type_choices)
    operation_date = models.DateTimeField(auto_now_add=True)
    quantity_moved = models.IntegerField()

    movement_responsible = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="historical_record",
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="historical_records"
    )