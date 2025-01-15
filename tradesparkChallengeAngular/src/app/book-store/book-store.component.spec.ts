import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookStoreComponent } from './book-store.component';
import { BookStoreService } from '../book-store.service';
import { of } from 'rxjs';

describe('BookStoreComponent', () => {
  let component: BookStoreComponent;
  let fixture: ComponentFixture<BookStoreComponent>;
  let mockBookStoreService: jasmine.SpyObj<BookStoreService>;

  beforeEach(() => {
    // Crear un spy para el BookStoreService
    mockBookStoreService = jasmine.createSpyObj('BookStoreService', [
      'getBooks', 'addBook', 'updateBook', 'deleteBook', 'addCategory', 'removeCategory'
    ]);

    TestBed.configureTestingModule({
      declarations: [BookStoreComponent],
      providers: [
        { provide: BookStoreService, useValue: mockBookStoreService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookStoreComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba de filtrado de libros (Punto 1 del Challenge)
  it('should filter books correctly based on search text', () => {
    component.books = [
      { title: 'Libro 1', author: { name: 'Juan Pérez' }, categories: [{ name: 'Programación' }] },
      { title: 'Libro 2', author: { name: 'Armando Paredes' }, categories: [{ name: 'Finanzas' }] },
    ];

    component.onSearch('Libro 1');
    expect(component.filteredBooks.length).toBe(1); // Debería aparecer solo un resultado
  });

  // Prueba de eliminación de categoría de un libro (Punto 3 del Challenge)
  it('should remove a category from a book', () => {
    const removeCategorySpy = spyOn(mockBookStoreService, 'removeCategory').and.returnValue(of({})); // Mock del servicio

    const bookId = 1;
    const categoryId = 2;
    component.removeCategory(bookId, categoryId);

    expect(removeCategorySpy).toHaveBeenCalledWith(1, 2); // Se espera que el método se haya llamado, y que se haya llamado con los parámetros correctos
  });
});
