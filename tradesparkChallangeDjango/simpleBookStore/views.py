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
    
    
    @action(detail=False, methods=['delete'], url_path='removeCategory', url_name="remove_category")
    def remove_category(self, request):
        """
        Tercer punto del Challenge:
        
        Elimina una categoría dado su nombre y el título de un libro específico.
        Endpoint: DELETE /books/removeCategoryByName
        Body JSON: {"book_title": "Book Title", "category_name": "Category Name"}
        """
        book_title = request.data.get("book_title")
        category_name = request.data.get("category_name")

        # Verificar si se proporcionaron ambos parámetros en el cuerpo de la solicitud
        if not book_title or not category_name:
            return Response({"detail": "Both book title and category name are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Intentar obtener el libro utilizando el título proporcionado
        try:
            book = Book.objects.get(title=book_title)
        except Book.DoesNotExist:
            return Response({"detail": f"Book with title '{book_title}' not found."}, status=status.HTTP_404_NOT_FOUND)

        # Intentar obtener la categoría utilizando el nombre proporcionado
        try:
            category = Category.objects.get(name=category_name)
        except Category.DoesNotExist:
            return Response({"detail": f"Category with name '{category_name}' not found."}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si la categoría está asociada con el libro
        if category not in book.categories.all():
            return Response({"detail": f"The category '{category_name}' is not associated with the book '{book_title}'."}, status=status.HTTP_400_BAD_REQUEST)

        # Eliminar la relación entre el libro y la categoría
        book.categories.remove(category)

        # Respuesta exitosa
        return Response({"detail": f"Category '{category_name}' removed from book '{book_title}' successfully."}, status=status.HTTP_204_NO_CONTENT)
