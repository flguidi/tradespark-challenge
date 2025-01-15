import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-book-form',
  templateUrl: './create-book-form.component.html',
  styleUrls: ['./create-book-form.component.css']
})
export class CreateBookFormComponent implements OnInit {

  @Input() isVisible: boolean = false; // Controla si la ventana está visible
  @Output() close = new EventEmitter<void>(); // Emite evento para cerrar la ventana
  @Output() createBook = new EventEmitter<any>(); // Emite evento para crear el libro

  constructor() { }

  ngOnInit(): void { }

  book = {
    title: '',
    author: {
      'name': ''
    },
    categories: []
  };

  submitForm(): void {
    this.createBook.emit(this.book);
    this.closeForm();
  }

  closeForm(): void {
    this.close.emit();
  }
  
}
