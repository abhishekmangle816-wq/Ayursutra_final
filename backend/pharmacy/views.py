from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import PharmacyItem, Prescription, Dispensing, Order
from .serializers import PharmacyItemSerializer, PrescriptionSerializer, DispensingSerializer, OrderSerializer
from core.permissions import IsPharmacy, IsDoctor, IsPatient

class PharmacyItemViewSet(viewsets.ModelViewSet):
    queryset = PharmacyItem.objects.all()
    serializer_class = PharmacyItemSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsPharmacy]
        return [permission() for permission in permission_classes]

class PrescriptionViewSet(viewsets.ModelViewSet):
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return Prescription.objects.filter(appointment__doctor__user=user)
        elif user.role == 'patient':
            return Prescription.objects.filter(appointment__patient__user=user)
        elif user.role in ['admin', 'pharmacy']:
            return Prescription.objects.all()
        return Prescription.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDoctor]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class DispensingViewSet(viewsets.ModelViewSet):
    serializer_class = DispensingSerializer
    queryset = Dispensing.objects.all()

    def get_permissions(self):
        permission_classes = [IsPharmacy]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        item = serializer.validated_data['item']
        qty = serializer.validated_data['quantity_dispensed']
        
        if item.quantity < qty:
            return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
            
        item.quantity -= qty
        item.save()
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

from rest_framework.decorators import action

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'pharmacy']:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsPharmacy])
    def accept(self, request, pk=None):
        order = self.get_object()
        if order.status != 'booked':
            return Response({'error': 'Only booked orders can be accepted.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'accepted'
        order.save()
        return Response({'status': 'Order accepted'})

    @action(detail=True, methods=['post'], permission_classes=[IsPharmacy])
    def reject(self, request, pk=None):
        order = self.get_object()
        if order.status not in ['booked', 'accepted']:
            return Response({'error': 'Order cannot be rejected at this stage.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'rejected'
        order.save()
        return Response({'status': 'Order rejected'})

    @action(detail=True, methods=['post'], permission_classes=[IsPharmacy])
    def mark_delivered(self, request, pk=None):
        order = self.get_object()
        if order.status == 'delivered':
            return Response({'error': 'Order is already delivered.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check inventory first
        for order_item in order.items.all():
            if order_item.item.quantity < order_item.quantity:
                return Response({'error': f'Not enough stock for {order_item.item.name}'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Deduct inventory
        for order_item in order.items.all():
            order_item.item.quantity -= order_item.quantity
            order_item.item.save()
            
        order.status = 'delivered'
        order.save()
        return Response({'status': 'Order marked as delivered successfully'})

    @action(detail=True, methods=['post'], permission_classes=[IsPharmacy])
    def fulfill(self, request, pk=None):
        # Alias for backward compatibility if any
        return self.mark_delivered(request, pk)
