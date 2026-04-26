from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PharmacyItemViewSet, PrescriptionViewSet, DispensingViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'items', PharmacyItemViewSet, basename='pharmacy-item')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'dispense', DispensingViewSet, basename='dispense')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
