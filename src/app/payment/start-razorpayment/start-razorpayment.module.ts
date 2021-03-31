import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartRazorpaymentPageRoutingModule } from './start-razorpayment-routing.module';

import { StartRazorpaymentPage } from './start-razorpayment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartRazorpaymentPageRoutingModule
  ],
  declarations: [StartRazorpaymentPage]
})
export class StartRazorpaymentPageModule {}
