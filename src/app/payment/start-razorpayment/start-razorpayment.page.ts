import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

declare var Razorpay: any;

@Component({
  selector: 'app-start-razorpayment',
  templateUrl: './start-razorpayment.page.html',
  styleUrls: ['./start-razorpayment.page.scss'],
})
export class StartRazorpaymentPage implements OnInit, OnDestroy {
  queryParamsSub: Subscription;
  amount: number;
  notes: string;
  order_id: string;
  payment_id: string;
  checkout_logo: string = 'https://dashboard-activation.s3.amazonaws.com/org_100000razorpay/checkout_logo/phpnHMpJe';
  signatureVerified: boolean = false;
  isPaymentSuccess = false;
  isRequestFromAndroid = false;
  transactionDateTime: Date;

  constructor(
    public dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.queryParamsSub = this.activatedRoute.queryParams.subscribe(
      (params) => {
        console.log(params);
        if (params.order_id) {
          this.order_id = params.order_id;
        }
        if (params.amount) {
          this.amount = params.amount;
        }
        if (params.notes) {
          this.notes = params.notes;
        }
        if (params.device && params.device == 'android') {
          this.isRequestFromAndroid = true;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }

  setUISuccess(response) {
    this.isPaymentSuccess = true;
    this.payment_id = response['razorpay_payment_id'];
    this.checkout_logo = response['checkout_logo'];
    this.transactionDateTime = new Date();
    this.cdRef.detectChanges();
  }

  goBackToApp() {
    try {
      if (this.isRequestFromAndroid) {
        window.open('my.direct.whatsapp://other/parameters/here', '_blank');
      } else {
        this.navCtrl.navigateRoot('/home');
      }
    } catch (error) {
      console.log(error);
      this.dataService.presentAlert('Error', error);
    }
  }

  startPayment() {
    this.payWithRazorpay(this.amount, this.notes);
  }

  // Razorpay Code:
  payWithRazorpay(amount, notes) {
    try {
      let name, price, theme;

      name = 'Direct Whatsapp';
      price = amount * 100;
      theme = '#8F46EE';

      var options = {
        // key: 'rzp_test_i1CjVUmtGPDAk2',
        key: 'rzp_live_ZPSwzvOlwjcbZC',
        name: name,
        description: 'Donate to Jagdish Chopde.',
        amount: price,
        currency: 'INR',
        image: '/assets/icon/favicon.png',
        order_id: this.order_id,
        handler: async (response) => {
          this.setUISuccess(response);
          console.log(response);
          this.dataService.presentToast();
          this.signatureVerified = (await this.dataService.verifySignature(
            response
          )) as boolean;
          this.cdRef.detectChanges();
        },
        // prefill: {
        //   name: 'Jagdish Chopde',
        //   email: 'jagdish.chopde@example.com',
        //   contact: '9999999999',
        // },
        notes: {
          Description: notes,
        },
        theme: {
          color: theme,
        },
      };

      this.initPay(options);
    } catch (error) {
      console.log(error);
    }
  }

  initPay(options) {
    var rzp1 = new Razorpay(options);
    rzp1.open();
  }
}
