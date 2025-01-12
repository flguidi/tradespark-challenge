from rest_framework import serializers
from .models import Author, Category, Book

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()
    categories = CategorySerializer(many=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'categories']

    # Sobreescritura del método create() del serializer en DRF.
    def create(self, validated_data):
        author_data = validated_data.pop('author')
        categories_data = validated_data.pop('categories')
        
        if not Author.objects.filter(**author_data).exists():
            Author.objects.create(**author_data)
            
        author = Author.objects.get(**author_data)
        book = Book.objects.create(author=author, **validated_data)
        
        for category_data in categories_data:
            if not Category.objects.filter(**category_data).exists():
                Category.objects.create(**category_data)
                
            category = Category.objects.get(**category_data)
            book.categories.add(category)
            
        return book

    # Sobreescritura del método update() del serializer en DRF para poder modificar libros con 
    # objetos anidados (autores y categorías).
    def update(self, instance, validated_data):
        author_data = validated_data.pop('author', None)
        categories_data = validated_data.pop('categories', None)

        # Validar que el autor exista
        if author_data:
            try:
                author = Author.objects.get(**author_data)
            except Author.DoesNotExist:
                raise serializers.ValidationError(f"Author '{author_data.get('name')}' not found.")
        
        # Validar que todas las categorías existan
        if categories_data:
            for category_data in categories_data:
                if not Category.objects.filter(**category_data).exists():
                    raise serializers.ValidationError(f"Category '{category_data.get('name')}' not found.")
        
        # Actualizar los campos si las validaciones son exitosas
        if 'title' in validated_data:
            instance.title = validated_data['title']

        if author_data:
            instance.author = author  # Asignar el nuevo autor

        if categories_data:
            instance.categories.clear()  # Limpiar las categorías actuales
            for category_data in categories_data:
                category = Category.objects.get(**category_data)
                instance.categories.add(category)  # Asignar las nuevas categorías

        # Guardar los cambios en la instancia y retornarla
        instance.save()
        return instance
