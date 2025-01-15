from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Author, Category, Book
from .serializers import AuthorSerializer, CategorySerializer, BookSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    @action(detail=True, methods=['post'], url_path='addCategory', url_name='add_category')
    def add_category(self, request, pk=None):
        """
        Agrega una categoría a un libro específico.
        Endpoint: POST /books/<book_id>/addCategory/
        """
        book = self.get_object()
        category_name = request.data.get('name')

        # Validar que se proporcionó el category_id
        if not category_name:
            return Response({"detail": "Category name is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si la categoría existe; si no, crearla
        category, created = Category.objects.get_or_create(name=category_name)

        # Agregar la categoría al libro
        book.categories.add(category)

        return Response({"detail": "Category added successfully."}, status=status.HTTP_200_OK)
    
    
    @action(detail=True, methods=['delete'], url_path='removeCategory/(?P<category_id>\d+)', url_name="remove_category")
    def remove_category(self, request, pk=None, category_id=None):
        """
        Elimina una categoría dado su ID de un libro específico (no elimina la categoría de la base de datos).
        Endpoint: DELETE /books/<book_id>/removeCategory/<category_id>/        
        """
        
        book = self.get_object()  # Obtener el libro con el ID dado en la URL
        
        # Intentar obtener la categoría utilizando el category_id proporcionado en la URL.
        # Si la categoría no existe, devolver un error 404.
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"detail": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si la categoría está asociada con el libro. Si no lo está, devolver un error 400.
        if category not in book.categories.all():
            return Response({"detail": "This category is not associated with the book."}, status=status.HTTP_400_BAD_REQUEST)

        # Eliminar la relación entre el libro y la categoría
        book.categories.remove(category)

        # Respuesta exitosa con código de estado 204 (No Content).
        return Response({"detail": "Category removed from book successfully."}, status=status.HTTP_204_NO_CONTENT)
