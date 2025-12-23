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
  isLogIn: boolean = false;
  loginCode: string = "";

  logIn() {
    if (this.loginCode ==  "1234") {
      this.isLogIn = true;
      this.loadBasket()
      this.loadBooks();
      this.cdr.detectChanges();
    }
    else{
      alert("falscher code");
    }
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

    const {data: insertData } = await supabase.from('books').select('*')
    this.books = insertData ?? [];

    this.book = "";
    this.section = "";

    this.cdr.detectChanges();
  }

  async deleteBook(book: any) {
    await supabase.from('books').delete().eq('title', book.title);
    this.books = this.books.filter(b => b.title !== book.title);
    this.cdr.detectChanges();
  }

  async bought(book: any) {
    await supabase.from('basket').delete().eq('title', book.title);
    this.basket = this.basket.filter(b => b.title !== book.title);

    this.book = book.title;
    this.section = book.section;

    const { data, error } = await supabase
      .from('books')
      .insert([{ title: this.book, section: this.section }]);

      const {data: insertData } = await supabase.from('books').select('*')
      this.books = insertData ?? [];


    this.cdr.detectChanges();
  }


}
