import { Component, ChangeDetectorRef } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import supabase from '../supabase';
import {CommonModule} from "@angular/common";
import {MatIcon} from '@angular/material/icon';

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
  basket: any[] = [];
  book: string = "";
  writer: string = "";

   ngOnInit() {
    this.loadBasket();
  }

  async loadBasket() {
    const {data} = await supabase.from('basket').select('*').order('created_at', {ascending: false});
    this.basket = data ?? [];
  }

  async addToBasket() {
    if (this.book && this.writer) {

      const {error: insertError} = await supabase.from('basket')
        .insert({title: this.book, writer: this.writer});

      if (insertError) alert("Book is already on the List");

      this.book = "";
      this.writer = "";

      await this.loadBasket();
    }
  }

}
