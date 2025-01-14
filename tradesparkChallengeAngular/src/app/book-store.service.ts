import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Observable para manejar datos asíncronos (en este caso, respuestas HTTP)

@Injectable({
  providedIn: 'root'
})
export class BookStoreService {

  // URL base para realizar operaciones con el recurso 'books'
  private baseUrl : string = 'http://localhost:8000/bookStore/books';

  constructor(private client: HttpClient) { }

  /**
   * Obtiene la lista de libros desde el backend.
   * 
   * @returns Observable<any> - Un observable que emite la lista de libros obtenida.
   */
  getBooks(): Observable<any> {
    return this.client.get(`${this.baseUrl}/`)
  }

  /**
   * Elimina un libro dado su ID realizando una solicitud HTTP DELETE al backend.
   * 
   * @param bookId El ID del libro a eliminar.
   * @returns Observable<any> - Un observable que emite la respuesta del servidor.
   */
  deleteBook(bookId: number): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${bookId}/`);
  }

  /**
   * Tercer punto del challenge:
   * 
   * Elimina la relación entre una categoría específica con un libro dado realizando una solicitud
   * HTTP DELETE al backend.
   * 
   * @param bookId ID del libro del que se desea eliminar la categoría.
   * @param categoryId ID de la categoría que se desea eliminar del libro.
   * @returns Observable<any> - Un observable que emite la respuesta del servidor.
   */
  removeCategory(bookId: number, categoryId: number): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${bookId}/removeCategory/${categoryId}/`);
  }

}
