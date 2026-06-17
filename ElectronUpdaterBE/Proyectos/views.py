from django.shortcuts import render
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Proyectos
from .serializer import ProyectosSerializer
import base64

# Create your views here.
@api_view(['GET'])
def GetProyectos(request):
    proyectos = Proyectos.objects.all()
    page_size = 15
    page = request.GET.get('page', 1)
    paginator = Paginator(proyectos, page_size)

    try:
        proyectos_page = paginator.page(page)
    except PageNotAnInteger:
        proyectos_page = paginator.page(1)
    except EmptyPage:
        proyectos_page = paginator.page(paginator.num_pages)

    serializer = ProyectosSerializer(proyectos_page, many=True)
    return Response({
        'count': paginator.count,
        'page': proyectos_page.number,
        'num_pages': paginator.num_pages,
        'results': serializer.data,
    })


@api_view(['POST'])
def PostProyectos(request):
    data = request.data.copy()
    icon_file = request.FILES.get('icon')

    if icon_file:
        try:
            encoded_icon = base64.b64encode(icon_file.read()).decode('utf-8')
            data['icon'] = encoded_icon
        except Exception as exc:
            return Response({'detail': 'No se pudo leer el archivo icon', 'error': str(exc)}, status=400)

    serializer = ProyectosSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    # If the only error is about missing icon, try saving without it
    errors = serializer.errors
    if 'icon' in errors and (len(errors) == 1):
        data['icon'] = None
        serializer = ProyectosSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
    