import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ref, onValue, update, get, push} from 'firebase/database';
import {MatIcon} from '@angular/material/icon';
import {db} from '../firebase';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    MatIcon,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
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
  section: string = "";

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    const booksRef = ref(db, 'books');

    onValue(booksRef, snapshot => {
      const data = snapshot.val();
      this.books = data ? Object.entries(data).map(([id, book]: any) => ({id, ...book})) : [];
      console.log('books', this.books);
    })
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
    this.currentBook = book?.id ?? null;
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
    this.currentBook = book?.id ?? null;
    this.showReturnAlert = true;
  }

  async saveLend() {
    console.log('saveLend', this.currentBook, this.lendName);
    if (!this.currentBook) { alert('Kein Buch ausgewählt'); return; }
    if (!this.lendName?.trim()) { alert('Bitte Namen eingeben'); return; }

    this.lendCode = Date.now().toString().slice(9,14);

    this.books = this.books.map((b: any) =>
      b.id === this.currentBook ? { ...b, lend: this.lendName.trim() } : b
    );

    this.closeAlert();
    this.openCodeAlert();
    this.cdr.detectChanges();

    await update(ref(db, `books/${this.currentBook}`), {
      code: this.lendCode,
      lend: this.lendName.trim(),
    })

    await push(ref(db, `books/${this.currentBook}/course`), {
      name: this.lendName.trim(),
    })

  }

  async saveReturn() {
    if (!this.currentBook) { alert('Kein Buch ausgewählt'); return; }

    const snapshot = await get(ref(db, `books/${this.currentBook}/code`));
    const expected = snapshot.val();

    const entered = this.returnCode;

    if(entered !== expected)  { alert('Falscher Name!'); return; }

    await update(ref(db, `books/${this.currentBook}`), {
      code: null,
      lend: null
    })

    this.books = this.books.map((b: any) =>
      b.id === this.currentBook ? { ...b, lend: null } : b
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

    push(ref(db, `basket`), {
      title: this.search,
      section: this.section,
    })
    this.addToBasketAlert = false;
    this.section = "";
    this.search = "";
    this.isSearch = false;
    this.cdr.detectChanges();
  }

}
