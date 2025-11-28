import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models.functions import Lower


from .models import Product, Historical
from .serializers import ProductSerializer, HistoricalSerializer

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response



class UnsafeSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # desabilita CSRF só nesta API

class ProductListCreateView(ListCreateAPIView):
    serializer_class = ProductSerializer
    authentication_classes = [UnsafeSessionAuthentication]

    def get_queryset(self):
        queryset = Product.objects.all()
        name = self.request.query_params.get("name")

        if name:
            queryset = queryset.filter(name__icontains=name)

        # Ordenação insensível a maiúsculas/minúsculas
        queryset = queryset.order_by(Lower("name"))

        return queryset

class ProductRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [UnsafeSessionAuthentication]

class StockMovementView(APIView):
    authentication_classes = [UnsafeSessionAuthentication]
    
    def post(self, request):
        data = request.data

        product_id = data.get("product")
        quantity = int(data.get("quantity_moved"))
        operation = data.get("operation_type")
        movement_date = data.get("operation_date")
        user = request.user

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Produto não encontrado."}, status=404)

        # Atualiza o estoque
        if operation == "Input":
            product.current_quantity += quantity
        elif operation == "Output":
            if product.current_quantity - quantity < 0:
                return Response({"error": "Saída maior do que o estoque disponível."},
                                status=400)
            product.current_quantity -= quantity
        else:
            return Response({"error": "Tipo de operação inválida."}, status=400)

        product.save()

        # Registrar no histórico
        Historical.objects.create(
            operation_type=operation,
            quantity_moved=quantity,
            movement_responsible=user,
            product=product,
            operation_date=movement_date,  # permitindo data manual
        )

        # alerta automático — item 7.1.4
        low_stock = product.current_quantity < product.minimum_quantity

        response = {
            "message": "Movimentação registrada com sucesso.",
            "product": product.name,
            "current_quantity": product.current_quantity,
            "low_stock_alert": low_stock,
        }

        return Response(response, status=201)

@csrf_exempt
def login_view(request):
    '''View to handle user login'''
    if request.method != "POST":
        return JsonResponse({"error": "Método inválido"}, status=405)

    data = json.loads(request.body.decode("utf-8"))
    username = data.get("username")
    password = data.get("password")

    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse({"error": "Credenciais inválidas"}, status=401)

    login(request, user)
    return JsonResponse({"message": "Login realizado com sucesso", "user": user.username, "id": user.id})


def logout_view(request):
    '''View to handle user logout'''
    logout(request)
    return JsonResponse({"message": "Logout realizado com sucesso"})
