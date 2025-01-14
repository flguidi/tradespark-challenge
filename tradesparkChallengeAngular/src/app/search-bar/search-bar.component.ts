import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  /**
   * Propiedad que almacena el valor ingresado por el usuario en el input.
   */
  searchText: string = '';

  /**
   * EventEmitter para enviar el texto de la búsqueda al componente padre (book-store).
   */
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void { }

  /**
   * Emite el texto de búsqueda cada vez que el usuario cambia el valor del input.
   */
  onInputChange(): void {
    this.search.emit(this.searchText);
  }

  /**
   * Limpia el input de búsqueda y emite el cambio al componente padre (book-store).
   */
  clearSearch(): void {
    this.searchText = '';
    this.search.emit(this.searchText);
  }

}
