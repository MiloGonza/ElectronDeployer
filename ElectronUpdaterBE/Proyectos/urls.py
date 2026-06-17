from django.urls import path
from . import views

urlpatterns = [
    path('', views.GetProyectos, name='GetProyectos'),
]