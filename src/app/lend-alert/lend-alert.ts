import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import supabase from '../supabase';

@Component({
  selector: 'app-lend-alert',
  imports: [
    FormsModule
  ],
  templateUrl: './lend-alert.html',
  styleUrl: './lend-alert.css',
})
export class LendAlert {
  name: string = "";
  class: string = "";

  @Input() currentBook: string = "";

  @Output() close = new EventEmitter<void>();

  async onSave() {
    let newLend = `${this.name} - ${this.class}`
    const {error} = await supabase.from('books').update({lend: `${newLend}`}).eq('title', this.currentBook);
    if (error) console.error(error);
    this.close.emit();
  }

}
