from django.shortcuts import render

# Create your views here.

from rest_framework import generics, permissions
from .models import Product
from .serializers import (
    ProductSerializer,
    RegisterSerializer
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class ProductListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = ProductSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return Product.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = ProductSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return Product.objects.filter(
            user=self.request.user
        )