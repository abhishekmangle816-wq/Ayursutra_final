from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TherapyViewSet

router = DefaultRouter()
router.register(r'', TherapyViewSet, basename='therapy')

urlpatterns = [
    path('', include(router.urls)),
]
