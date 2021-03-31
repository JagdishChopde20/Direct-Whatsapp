import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'start-razorpayment',
    loadChildren: () => import('./payment/start-razorpayment/start-razorpayment.module').then( m => m.StartRazorpaymentPageModule)
  },
  {
    path: 'success-razorpayment',
    loadChildren: () => import('./payment/success-razorpayment/success-razorpayment.module').then( m => m.SuccessRazorpaymentPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
