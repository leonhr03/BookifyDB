import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import supabase from '../supabase';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  constructor(private cdr: ChangeDetectorRef) {}
  currentPage: number = 1;
  book: string = "";
  section: string = "";
  books: { title: string, section: string }[] = [];
  basket: any[] = [];

  async ngOnInit() {
    await this.loadBooks();
    await this.loadBasket();
    this.cdr.detectChanges();
  }

  async loadBooks() {
    const { data, error } = await supabase.from('books').select('*');
    if (error) console.error('Supabase Load Error:', error.message);
    console.log('Books loaded:', data);
    this.books = data ?? [];
    console.log('Books loaded:', this.books);
  }

  async loadBasket() {
    const { data, error } = await supabase.from('basket').select('*');
    if (error) console.error('Supabase Load Error:', error.message);
    this.basket = data ?? [];
  }

  async addBook() {
    if (!this.book || !this.section) return;

    const { data, error } = await supabase
      .from('books')
      .insert([{ title: this.book, section: this.section }]);

    if (!error && data) {
      this.books.push(data[0]);
      this.cdr.detectChanges();
    } else {
      alert("Fehler beim Hochladen");
      console.error(error);
    }

    this.book = "";
    this.section = "";
  }

  async deleteBook(book: any) {
    await supabase.from('books').delete().eq('title', book.title);
    this.books = this.books.filter(b => b.title !== book.title);
    this.cdr.detectChanges();
  }

  async bought(book: any) {
    await supabase.from('basket').delete().eq('title', book.title);
    this.basket = this.basket.filter(b => b.title !== book.title);

    this.cdr.detectChanges();
  }
}
