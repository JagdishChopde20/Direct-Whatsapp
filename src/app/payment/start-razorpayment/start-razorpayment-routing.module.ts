import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartRazorpaymentPage } from './start-razorpayment.page';

const routes: Routes = [
  {
    path: '',
    component: StartRazorpaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartRazorpaymentPageRoutingModule {}
