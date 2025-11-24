import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import supabase from '../supabase';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  book: string = "";
  section: string = "";

  async addBook() {
    const { data, error } = await supabase
      .from('books')
      .insert([{ title: this.book, section: this.section }]);

    if (!error) {
      console.log(data);
    }
    else {
      alert("Fehler beim Hochladen")
    }
    this.book = "";
    this.section = "";
  }
}
