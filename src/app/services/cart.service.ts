import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>([]); // Notifica cambios en tiempo real

  constructor() {}

  getCart() {
    return this.cartSubject.asObservable(); // Devolvemos un observable
  }

  addToCart(product: any) {
    this.cartItems.push(product);
    this.cartSubject.next([...this.cartItems]); // Notificar cambio
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next([]); // Notificar carrito vacío
  }
}
