import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent, pathMatch: 'full' },
  { path: 'cart', component: CartComponent }
];

export const appRouting = [
  provideRouter(routes),
  importProvidersFrom()
];
