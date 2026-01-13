import { Component, ChangeDetectorRef } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatIcon} from '@angular/material/icon';
import {onValue, push, ref} from 'firebase/database';
import {db} from '../firebase';

@Component({
  selector: 'app-basket',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './basket.html',
  styleUrl: './basket.css',
})
export class Basket{
  constructor(private cdr: ChangeDetectorRef) {}
  basket: any[] = [];
  book: string = "";
  section: string = "";

  ngOnInit() {
    this.loadBasket();
  }

  async loadBasket() {
    const basketRef = ref(db, 'basket');

    onValue(basketRef, snapshot => {
      this.basket = Object.values(snapshot.val());
    })
  }

  async addToBasket() {
    if (this.book && this.section) {

      push(ref(db, `basket`), {
        title: this.book,
        section: this.section,
      })

      this.book = "";
      this.section = "";

      this.cdr.detectChanges();
      await this.loadBasket();
    }
  }

}
