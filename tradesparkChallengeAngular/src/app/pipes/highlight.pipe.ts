import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Para sanitizar inputs

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Resalta las coincidencias de texto con una etiqueta `<mark>`.
   * Usa DomSanitizer para sanear el HTML generado.
   * 
   * @param value String que se va a procesar.
   * @param searchText Substring dentro de `value` que será resaltado.
   * @returns Un objeto `SafeHtml` que es seguro para insertar en el DOM.
   */
  transform(value: string, searchText: string): SafeHtml {
    if (!searchText) {
      return value; // Si no hay texto en el input de búsqueda, se retorna el string sin modificar
    }

    const regex = new RegExp(`(${searchText})`, 'gi'); // Expresión regular para encontrar el texto de búsqueda.
    const highlighted = value.replace(regex, '<mark>$1</mark>'); // Resaltar coincidencias.

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
  
}