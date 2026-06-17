
from rest_framework import serializers
from .models import Proyectos


class ProyectosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos
        fields = '__all__'