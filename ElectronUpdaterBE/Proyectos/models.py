from django.db import models

# Create your models here.
class Proyectos(models.Model):
    ID = models.AutoField(primary_key=True)
    Nombre = models.CharField(max_length=999)
    Descripcion = models.TextField()
    icono = models.TextField(blank=True, null=True)
    ruta = models.CharField(max_length=999)

    def __str__(self):
        return self.Nombre