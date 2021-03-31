import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessRazorpaymentPageRoutingModule } from './success-razorpayment-routing.module';

import { SuccessRazorpaymentPage } from './success-razorpayment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessRazorpaymentPageRoutingModule
  ],
  declarations: [SuccessRazorpaymentPage]
})
export class SuccessRazorpaymentPageModule {}
