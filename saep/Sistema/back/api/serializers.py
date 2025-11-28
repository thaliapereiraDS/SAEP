from rest_framework import serializers
from .models import Product, Historical

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
class HistoricalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historical
        fields = '__all__'