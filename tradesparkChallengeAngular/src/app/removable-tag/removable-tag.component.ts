import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-removable-tag',
  templateUrl: './removable-tag.component.html',
  styleUrls: ['./removable-tag.component.css']
})
export class RemovableTagComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  @Input() tagText!: string; // Texto del tag
  @Input() searchText!: string; // Texto a resaltar

  /**
   * Evento que se emite al eliminar la etiqueta.
   */
  @Output() remove = new EventEmitter<void>();

  /**
   * Método que emite el evento de eliminación al componente padre (book-store).
   */
  onRemove(): void {
    this.remove.emit();
  }

}
