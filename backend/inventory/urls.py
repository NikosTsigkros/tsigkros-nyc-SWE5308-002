from django.urls import path

from .views import (
    RegisterView,
    ProductListCreateView,
    ProductDetailView
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path(
        'register/',
        RegisterView.as_view()
    ),

    path(
        'login/',
        TokenObtainPairView.as_view()
    ),

    path(
        'token/refresh/',
        TokenRefreshView.as_view()
    ),

    path(
        'products/',
        ProductListCreateView.as_view()
    ),

    path(
        'products/<int:pk>/',
        ProductDetailView.as_view()
    ),
]