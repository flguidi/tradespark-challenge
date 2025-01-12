import { Component, OnInit } from '@angular/core';
import { BookStoreService } from '../book-store.service';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css']
})
export class BookStoreComponent implements OnInit {

  books: any[] = [];
  filteredBooks: any[] = []; // Libros filtrados que se renderizarán

  constructor(private bookStoreService: BookStoreService) { }

  ngOnInit(): void {
    this.bookStoreService.getBooks().subscribe((data: any[]) => {
      this.books = data;
      this.filteredBooks = [...this.books]; // Se inicializa la lista filtrada con todos los libros
    })
  }

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
   * Método que maneja el filtrado de libros basado en el texto ingresado en la barra de búsqueda.
   * Filtra los libros por título, autor o categorías.
   * 
   * @param searchText El texto ingresado en la barra de búsqueda que se usará para filtrar los libros.
   */
  onSearch(searchText: string): void {
    const lowerCaseSearch = searchText.toLowerCase(); // El filtro no distingue entre mayúsculas y minúsculas
    this.filteredBooks = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerCaseSearch) || // Título
        book.author.name.toLowerCase().includes(lowerCaseSearch) || // Autor
        this.categoriesToString(book.categories).toLowerCase().includes(lowerCaseSearch) // Categorías
    );
  }

}
