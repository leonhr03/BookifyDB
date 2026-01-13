import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Admin } from './admin/admin';
import {Basket} from './basket/basket';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin', component: Admin },
  {path: "basket", component: Basket}
];
