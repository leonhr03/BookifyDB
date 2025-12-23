import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import supabase from '../supabase';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CommonModule,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home {
  constructor(private cdr: ChangeDetectorRef) {}
  search: any = "";
  isSearch: boolean = false;
  books: any = [];
  showAlert: boolean = false;
  currentBook: string | null = "";
  lendName: string = "";
  returnCode: string = "";
  showReturnAlert: boolean = false;
  lendCode = "";
  showCodeAlert: boolean = false;
  addToBasketAlert: boolean = false;
  writer: string = "";
  book: string = "";

  ngOnInit() {
    this.loadBooks()
  }

  async loadBooks() {
    const { data, error } = await supabase.from('books').select('*');
    if (error) console.error('Supabase Load Error:', error.message);
    this.books = data ?? [];
    console.log('Books loaded:', this.books);
  }

  onSearch() {
    if (this.search != "") {
      this.isSearch = true;
    }
    if (this.search == "") {
      this.isSearch = false;
    }
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

  openAlert(book: any) {
    console.log('openAlert', book?.title);
    this.currentBook = book?.title ?? null;
    this.lendName = '';
    this.showAlert = true;
  }

  openCodeAlert() {
    this.showCodeAlert = true;
  }

  closeCodeAlert() {
    this.showCodeAlert = false;
    this.lendCode = '';
  }

  openReturn(book: any) {
    this.currentBook = book?.title ?? null;
    this.showReturnAlert = true;
  }

  async saveLend() {
    console.log('saveLend', this.currentBook, this.lendName);
    if (!this.currentBook) { alert('Kein Buch ausgewählt'); return; }
    if (!this.lendName?.trim()) { alert('Bitte Namen eingeben'); return; }

    this.lendCode = Date.now().toString().slice(9,14);

    this.books = this.books.map((b: any) =>
      b.title === this.currentBook ? { ...b, lend: this.lendName.trim() } : b
    );

    this.closeAlert();
    this.openCodeAlert();
    this.cdr.detectChanges();

    const { error } = await supabase
      .from('books')
      .update({ lend: this.lendName.trim(), code: this.lendCode })
      .eq('title', this.currentBook);

    if (error) {
      console.error('update lend error', error);
      alert('Fehler beim Speichern');
      return;
    }


  }

  async saveReturn() {
    if (!this.currentBook) { alert('Kein Buch ausgewählt'); return; }

    const { data, error } = await supabase
      .from('books')
      .select('code')
      .eq('title', this.currentBook)
      .single();

    if (error || !data) { alert('Fehler beim Abrufen!'); return; }

    const expected = (data.code);
    const entered = (this.returnCode);

    if (entered !== expected) { alert('Falscher Name!'); return; }

    const { error: updateError } = await supabase
      .from('books')
      .update({ lend: null, code: null })
      .eq('title', this.currentBook);

    if (updateError) { alert('Fehler beim Aktualisieren!'); return; }

    this.books = this.books.map((b: any) =>
      b.title === this.currentBook ? { ...b, lend: null } : b
    );

    this.returnCode = '';
    this.currentBook = '';
    this.closeReturnAlert();
    this.cdr.detectChanges();

  }

  closeReturnAlert() {
    this.showReturnAlert = false;
    this.cdr.detectChanges();
  }

  async addToBasket() {
    await supabase.from("basket").insert([{title: this.search, writer: this.writer}])
    this.writer = "";
    this.addToBasketAlert = false;
    this.search = "";
    this.isSearch = false;
    this.cdr.detectChanges();
  }
}
