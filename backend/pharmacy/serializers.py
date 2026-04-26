from rest_framework import serializers
from .models import PharmacyItem, Prescription, Dispensing, Order, OrderItem
from appointments.serializers import AppointmentSerializer
from therapies.serializers import TherapySerializer

class PharmacyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacyItem
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)
    herbs_details = PharmacyItemSerializer(source='herbs', many=True, read_only=True)
    therapies_details = TherapySerializer(source='therapies', many=True, read_only=True)

    class Meta:
        model = Prescription
        fields = '__all__'
        extra_kwargs = {
            'herbs': {'required': False, 'allow_empty': True},
            'therapies': {'required': False, 'allow_empty': True}
        }

class DispensingSerializer(serializers.ModelSerializer):
    item_details = PharmacyItemSerializer(source='item', read_only=True)

    class Meta:
        model = Dispensing
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    item_details = PharmacyItemSerializer(source='item', read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    
    # Write only for creating items
    order_items = serializers.ListField(child=serializers.DictField(), write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_email', 'user_name', 'total_amount', 'status', 'delivery_address', 'created_at', 'items', 'order_items']
        read_only_fields = ['user', 'total_amount']

    def create(self, validated_data):
        items_data = validated_data.pop('order_items')
        user = self.context['request'].user
        order = Order.objects.create(user=user, **validated_data)
        
        total = 0
        for i_data in items_data:
            item_id = i_data.get('item')
            quantity = i_data.get('quantity', 1)
            pharmacy_item = PharmacyItem.objects.get(id=item_id)
            
            price = pharmacy_item.price_per_unit
            total += price * quantity
            
            OrderItem.objects.create(
                order=order,
                item=pharmacy_item,
                quantity=quantity,
                price_at_purchase=price
            )
            
        order.total_amount = total
        order.save()
        return order
