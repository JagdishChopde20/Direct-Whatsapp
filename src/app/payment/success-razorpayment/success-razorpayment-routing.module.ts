import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessRazorpaymentPage } from './success-razorpayment.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessRazorpaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessRazorpaymentPageRoutingModule {}
