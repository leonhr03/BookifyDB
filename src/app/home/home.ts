import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import supabase from '../supabase';
import {CommonModule} from '@angular/common';
import {ListItem} from '../list-item/list-item';
import {LendAlert} from '../lend-alert/lend-alert';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CommonModule,
    ListItem,
    LendAlert,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home {
  search: any = "";
  isSearch: boolean = false;
  books: any = [];
  showAlert: boolean = false;
  currentBook: string = "";

  ngOnInit() {
    this.loadBooks()
  }

  async loadBooks() {
    const { data, error } = await supabase.from('books').select('*');
    if (error) console.error(error.message);
    this.books = data ?? [];
    console.log(this.books)
  }

  onSearch() {
    if (this.search != "") {
      this.isSearch = true;
    }
    if (this.search == "") {
      this.isSearch = false;
    }
  }

  lendBook(book: any) {
    this.currentBook = book.title
    this.showAlert = true
  }

  filteredBooks() {
    if(!this.search) return this.books;
    return this.books.filter(
      (book: any) =>
        book.title.toLowerCase().includes(this.search.toLowerCase()) ||
        book.section.toLowerCase().includes(this.search.toLowerCase())
    )
  }

  closeAlert() {
    this.showAlert = false;
  }
}
