from rest_framework.test import APITestCase
from rest_framework import status
from simpleBookStore.models import Book, Category, Author
from rest_framework.reverse import reverse

class BookViewSetTestCase(APITestCase):
    """Esta clase representa un conjunto de pruebas unitarias asociadas al ViewSet de libros."""
    
    def setUp(self):
        """
        Configuración inicial para la prueba. Crea libros, autores y categorías.
        """
        # Crear autor
        self.author = Author.objects.create(name="Test Author")
        
        # Crear categorías
        self.category1 = Category.objects.create(name="Test Category 1")
        self.category2 = Category.objects.create(name="Test Category 2")
        
        # Crear libro y asociarlo con categorías
        self.book = Book.objects.create(title="The Test Book", author=self.author)
        self.book.categories.add(self.category1, self.category2)
        
        # Obtener la URL de la acción remove_category para usarla en las pruebas
        self.url = reverse('book-remove_category', args=[self.book.id, self.category1.id])
        
    def test_remove_category_success(self):
        """
        Verifica que la categoría se elimine correctamente de un libro (con código de respuesta 204).
        """
        # Realizar solicitud DELETE y verificar respuesta
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verificar que la categoría ha sido eliminada del libro
        self.book.refresh_from_db()
        self.assertNotIn(self.category1, self.book.categories.all())

    def test_remove_category_not_found(self):
        """
        Verifica que se retorne un error 404 si la categoría no existe.
        """
        # Intentar eliminar una categoría que no existe
        invalid_category_id = 999
        url = reverse('book-remove_category', args=[self.book.id, invalid_category_id])
        
        response = self.client.delete(url)
        
        # Verificar que la respuesta es un error 404
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["detail"], "Category not found.")
        
    def test_remove_category_not_associated(self):
        """
        Verifica que se retorne un error 400 si la categoría no está asociada al libro.
        """
        # Crear una categoría que no está asociada al libro
        unrelated_category = Category.objects.create(name="Other Test Category")
        
        # Intentar eliminar una categoría no asociada al libro
        url = reverse('book-remove_category', args=[self.book.id, unrelated_category.id])
        
        response = self.client.delete(url)
        
        # Verificar que la respuesta es un error 400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "This category is not associated with the book.")