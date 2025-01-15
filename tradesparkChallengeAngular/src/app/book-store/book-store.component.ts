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
  isCreateFormVisible: boolean = false; // Indica si se debe mostrar el formulario de creación de libros

  constructor(private bookStoreService: BookStoreService) { }

  ngOnInit(): void {
    this.loadBooks(); // Cargar los libros al inicializar el componente
  }

  openForm() {
    this.isCreateFormVisible = true;
  }

  closeForm() {
    this.isCreateFormVisible = false;
  }

  /**
   * Agrega un nuevo libro utilizando el servicio `BookStoreService`.
   * 
   * @param book Objeto que contiene la información del libro a crear (título, autor y categorías).
   */
  addBook(book: any) {
    // Llamar al servicio para crear un nuevo libro
    this.bookStoreService.addBook(book).subscribe({
      next: () => {
        this.loadBooks(); // Actualizar la lista de libros
        this.closeForm(); // Se cierra el formulario
      },
      error: (err) => {
        console.error('Error creating book: ', err);
      },
    });
  }

  /**
   * Carga los libros desde el backend y los asigna a las listas de libros y libros filtrados.
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
   * Elimina un libro con el ID dado. 
   * Antes de la eliminación, pregunta al usuario si está seguro de realizar la operación.
   * Luego de intentar eliminar el libro, informa al usuario si la operación se pudo concretar.
   * 
   * @param bookId ID del libro a eliminar.
   */
  deleteBook(bookId: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookStoreService.deleteBook(bookId).subscribe({
        next: () => {
          this.filteredBooks = this.filteredBooks.filter(book => book.id !== bookId);
          alert('Book deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          alert('Failed to delete the book. Please try again.');
        }
      });
    }
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

  /**
   * Tercer punto del challenge:
   * 
   * Método que llama al servicio para eliminar una categoría de un libro específico.
   * Una vez eliminada la categoría, recarga los libros para mostrar los cambios.
   * 
   * @param bookId El ID del libro al que pertenece la categoría.
   * @param categoryId El ID de la categoría que se desea eliminar.
   */
  removeCategory(bookId: number, categoryId: number): void {
    this.bookStoreService.removeCategory(bookId, categoryId).subscribe(
      () => {
        this.loadBooks(); // Recargar libros para actualizar la vista
      },
      (error) => {
        console.error('Error removing category: ', error);
      }
    );
  }

}
