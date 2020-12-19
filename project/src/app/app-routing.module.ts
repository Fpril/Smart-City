import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MainComponent } from './UI/pages/main/main.component';

const routes: Routes = [
  {
    path: 'rental',
    loadChildren: () => import('./UI/pages/rental/rental.module').then(m => m.RentalModule)
  },
  {
    path: 'routes',
    loadChildren: () => import('./UI/pages/routes/routes.module').then(m => m.RoutesModule)
  },
  {
    path: 'parking',
    loadChildren: () => import('./UI/pages/parking/parking.module').then(m => m.ParkingModule)
  },
  {
    path: '**',
    component: MainComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
