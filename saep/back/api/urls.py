from django.urls import path
from .views import login_view, logout_view, ProductListCreateView, ProductRetrieveUpdateDeleteView, StockMovementView

urlpatterns = [
    path('login/', login_view),
    path('logout/', logout_view),
    path('products/', ProductListCreateView.as_view()), 
    path("products/<int:pk>/", ProductRetrieveUpdateDeleteView.as_view()),
    path("stock/movement/", StockMovementView.as_view())

]
