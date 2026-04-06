import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CategoriesComponentComponent } from './components/categories-component/categories-component.component';
import { ProductAdminComponent } from './components/product-admin/product-admin.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { HistoriqueComponent } from './components/historique/historique.component';
import { HeaderComponent } from './components/header/header.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ConnectionComponent } from './components/connection/connection.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'connection', pathMatch: 'full' },
    { path: 'sidebar', component: SidebarComponent },
    { path: 'categories', component: CategoriesComponentComponent },
    { path: 'Gestion-Produit', component: ProductAdminComponent },
    { path: 'Accueil', component: ProductCardComponent },
    { path: 'historique', component: HistoriqueComponent, canActivate: [adminGuard] },
    { path: 'header', component: HeaderComponent },
    { path: 'inscription', component: InscriptionComponent },
    { path: 'connection', component: ConnectionComponent },

]
