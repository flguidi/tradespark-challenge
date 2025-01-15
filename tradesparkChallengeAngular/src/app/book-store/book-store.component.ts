import { Component, OnInit } from '@angular/core';
import { BookStoreService } from '../book-store.service';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css']
})
export class BookStoreComponent implements OnInit {

  books: any[] = []; // Almacena todos libros de la base de datos
  filteredBooks: any[] = []; // Libros filtrados que se renderizarán
  searchText: string = ''; // Texto de la búsqueda utilizado para resaltar coincidencias

  constructor(private bookStoreService: BookStoreService) { }

  ngOnInit(): void {
    this.loadBooks(); // Cargar los libros al inicializar el componente
  }

  /**
   * Primer punto del challenge:
   * 
   * Método que maneja el filtrado de libros basado en el texto ingresado en la barra de búsqueda.
   * Filtra los libros por título, autor o categorías.
   * 
   * @param searchText El texto ingresado en la barra de búsqueda que se usará para filtrar los libros.
   */
  onSearch(searchText: string): void {
    this.searchText = searchText.toLowerCase(); // El filtro no es case sensitive
    this.filteredBooks = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(this.searchText) || // Título
        book.author.name.toLowerCase().includes(this.searchText) || // Autor
        this.categoriesToString(book.categories).toLowerCase().includes(this.searchText) // Categorías
    );
  }

  /**
   * Carga los libros desde el backend (a través del servicio) y los asigna a las listas de libros 
   * y libros filtrados.
   */
  loadBooks(): void {
    this.bookStoreService.getBooks().subscribe(
      (data) => {
        this.books = data;
        this.filteredBooks = [...this.books]; // Inicializar libros filtrados con todos los libros
      },
      (error) => {
        console.error('Error loading books: ', error);
      }
    );
  }

  /**
   * Agrega un nuevo libro utilizando el servicio `BookStoreService`.
   * Se pide al usuario que ingrese el nuevo título y el nuevo nombre de autor.
   * 
   * @param book Objeto que contiene la información del libro a crear (título y autor).
   */
  addBook(): void {
    const title = prompt('Enter the book title:');
    if (!title) {
      alert('Book title is required.');
      return;
    }

    const authorName = prompt('Enter the author name:');
    if (!authorName) {
      alert('Author name is required.');
      return;
    }

    const newBook = {
      title: title,
      author: { name: authorName },
      categories: [] // Lista de categorías vacía para respetar el formato requerido por el backend
    };

    // Llamar al servicio para crear un nuevo libro
    this.bookStoreService.addBook(newBook).subscribe({
      next: () => {
        this.loadBooks(); // Actualizar la lista de libros
      },
      error: (err) => {
        console.error('Error creating book: ', err);
      },
    });
  }

  /**
   * Modifica el título y autor del libro con el ID especificado.
   * 
   * @param bookId ID del libro modificado.
   */
  updateBook(bookId: number): void {
    const newTitle = prompt('Enter the book title:');
    if (!newTitle) {
      alert('Book title is required.');
      return;
    }

    const newAuthorName = prompt('Enter the author name:');
    if (!newAuthorName) {
      alert('Author name is required.');
      return;
    }

    const updatedBook = {
      title: newTitle,
      author: { name: newAuthorName },
      categories: [] // Lista de categorías vacía para respetar el formato requerido por el backend
    };

    // Llamar al servicio para modificar el libro
    this.bookStoreService.updateBook(bookId, updatedBook).subscribe({
      next: () => {
        this.loadBooks(); // Actualizar la lista de libros
      },
      error: (err) => {
        console.error('Error updating book: ', err);
      },
    });
  }

  /**
   * Elimina un libro con el ID dado. 
   * Antes de la eliminación, pregunta al usuario si está seguro de realizar la operación.
   * Luego de intentar eliminar el libro, informa al usuario el resultado de la operación.
   * 
   * @param bookId ID del libro a eliminar.
   */
  deleteBook(bookId: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookStoreService.deleteBook(bookId).subscribe({
        next: () => {
          this.filteredBooks = this.filteredBooks.filter(book => book.id !== bookId);
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          alert('Failed to delete the book. Please try again.');
        }
      });
    }
  }

  /**
   * Agrega una categoría a un libro dado.
   * 
   * @param bookId ID del libro al que se le agregará la categoría.
   */
  addCategory(bookId: number): void {
    // Se solicita el nombre de la nueva categoría
    const newCategoryName = prompt('Enter new category name:');
    if (!newCategoryName) {
      alert('Category name is required.');
      return;
    }

    const newCategoryJSON = { name: newCategoryName };

    // Comunicación con el servicio
    this.bookStoreService.addCategory(bookId, newCategoryJSON).subscribe(
      () => {
        this.loadBooks(); // Recargar libros para actualizar la vista
      },
      (error) => {
        console.error('Error adding category: ', error);
      }
    );
  }

  /**
   * Tercer punto del challenge:
   * 
   * Método que llama al servicio `BookStoreService` para eliminar una categoría de un libro específico.
   * Una vez eliminada la categoría, recarga los libros para mostrar los cambios.
   * 
   * @param bookTitle El título del libro al que pertenece la categoría.
   * @param categoryName El ID de la categoría que se desea eliminar.
   */
  removeCategory(bookTitle: string, categoryName: string): void {
    this.bookStoreService.removeCategoryFromBook(bookTitle, categoryName).subscribe(
      () => {
        this.loadBooks(); // Recargar libros para actualizar la vista
      },
      (error) => {
        console.error('Error removing category: ', error);
      }
    );
  }

  /**
   * Convierte una lista de categorías en un string separado por comas.
   * 
   * @param categories La lista de categorías asociadas a un libro.
   * @returns Un string con los nombres de las categorías separados por comas.
   */
  categoriesToString(categories: any[]): string {
    let categoriesString = "";
    categories.forEach((category, index) => {
      categoriesString += category.name;
      if (index < categories.length - 1) {
        categoriesString += ", ";
      }
    });
    return categoriesString;
  }

}
