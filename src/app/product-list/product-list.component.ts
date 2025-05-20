import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  error: string = '';
  searchTerm: string = '';
  selectedCategory: string = '';
  page: number = 1;
  pageSize: number = 12;
  loading: boolean = true;
  cartItemCount: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.updateCartCount();

    // Suscribirse a cambios en el carrito
    this.cartService.getCart().subscribe(items => {
      this.cartItemCount = items.length;
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
        this.error = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los productos. Por favor, intenta de nuevo.';
        this.loading = false;
        console.error('Error cargando productos:', err);
      },
    });
  }

  extractCategories() {
    // Extraer categorías únicas
    const categoriesSet = new Set(this.products.map(product => product.category));
    this.categories = Array.from(categoriesSet);
  }

  filterProducts() {
    let results = this.products;

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim() !== '') {
      results = results.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (this.selectedCategory !== '') {
      results = results.filter(product => product.category === this.selectedCategory);
    }

    this.filteredProducts = results;
    this.page = 1; // Reset a la primera página cuando se filtran resultados
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.filteredProducts = this.products;
    this.page = 1;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.updateCartCount();

    // Mostrar notificación elegante
    this.snackBar.open(`${product.title.substring(0, 20)}... añadido al carrito`, 'Ver Carrito', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    }).onAction().subscribe(() => {
      this.navigateToCart();
    });
  }

  updateCartCount() {
    this.cartService.getCart().subscribe(items => {
      this.cartItemCount = items.length;
    });
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  showProductDetails(product: any) {
    // Esta función se implementaría si tienes una vista de detalles
    // this.router.navigate(['/product', product.id]);

    // Alternativa: mostrar detalles en un modal
    this.snackBar.open('Vista de detalles en desarrollo', 'OK', {
      duration: 2000
    });
  }

  getStars(rating: number): number[] {
    const stars: number[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Añadir estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }

    // Añadir media estrella si es necesario
    if (hasHalfStar) {
      stars.push(0.5);
    }

    // Añadir estrellas vacías
    while (stars.length < 5) {
      stars.push(0);
    }

    return stars;
  }
}
