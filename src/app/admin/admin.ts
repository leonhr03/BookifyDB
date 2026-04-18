import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {onValue, push, ref, remove} from 'firebase/database';
import {db} from '../firebase';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  constructor(private cdr: ChangeDetectorRef) {}
  currentPage: 1 | 2 | 3 | 4 | undefined;
  currentBook: string = "";
  book: string = "";
  section: string = "";
  books: { title: string, section: string }[] = [];
  basket: any[] = [];
  course: any[] = [];
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
    const booksRef = ref(db, 'books');

    onValue(booksRef, snapshot => {
      const data = snapshot.val();
      this.books = data ? Object.entries(data).map(([id, book]: any) => ({id, ...book})) : [];
      console.log('books', this.books);
    })
  }

  async loadBasket() {
    const booksRef = ref(db, 'basket');

    onValue(booksRef, snapshot => {
      const data = snapshot.val();
      this.basket = data ? Object.entries(data).map(([id, book]: any) => ({id, ...book})) : [];
      console.log('books', this.books);
    })
  }

  async addBook() {
    if (!this.book || !this.section) return;

    push(ref(db, `books`), {
      title: this.book,
      section: this.section
    })

    this.loadBooks();

    this.book = "";
    this.section = "";

    this.cdr.detectChanges();
  }

  async deleteBook(book: any) {

    await remove(ref(db, `books/${book.id}`))
    await this.loadBooks();
    this.cdr.detectChanges();
  }

  async bought(book: any) {
    remove(ref(db, `basket/${book.id}`))
    this.loadBasket();

    push(ref(db, "books"), {
      title: book.title,
      section: book.section
    })

    this.loadBooks();


    this.cdr.detectChanges();
  }

  async loadCourse() {
    const booksRef = ref(db, 'books');

    onValue(booksRef, snapshot => {
      const data = snapshot.val();

      const entry = Object.entries(data).find(
        ([id, book]: any) => book.title === this.currentBook
      );

      if (entry) {
        const [id] = entry;

        const courseRef = ref(db, `books/${id}/course`);

        onValue(courseRef, snap => {
          const courseData = snap.val();

          this.course = courseData
            ? Object.values(courseData).map((item: any) => item.name)
            : [];
        });
      }
    });
    console.log(this.course)
    this.cdr.detectChanges();
  }


}
