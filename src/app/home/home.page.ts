import { Component, OnInit } from '@angular/core';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { AlertController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
declare var Razorpay: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  dark = false;
  accentColor = 'primary';

  constructor(
    public http: HttpClient,
    public toastCtrl: ToastController,
    public alertController: AlertController
  ) {
    //private webIntent: WebIntent,
    try {
      // const prefersColor = window.matchMedia('(prefers-color-scheme: dark)');
      // this.dark = prefersColor.matches;
      // this.updateDarkMode();
      // prefersColor.addEventListener('change', (mediaQuery) => {
      //   this.dark = mediaQuery.matches;
      //   this.updateDarkMode();
      // });
      document.body.classList.toggle('dark', this.dark);
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    try {
      const darkTheme = await Storage.get({ key: 'darkTheme' });
      if (darkTheme?.value) {
        this.dark = (darkTheme.value as unknown) as boolean;

        // Set dark mode
        if (darkTheme?.value == 'true') {
          this.dark = true;
          document.body.classList.add('dark');
        } else {
          this.dark = false;
          document.body.classList.remove('dark');
        }
      }
      const accentColor = await Storage.get({ key: 'accentColor' });
      if (accentColor?.value) {
        this.accentColor = accentColor.value;
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateDarkMode() {
    try {
      document.body.classList.toggle('dark', this.dark);

      // Update in local storage
      Storage.set({
        key: 'darkTheme',
        value: (this.dark as unknown) as string,
      });
    } catch (error) {
      console.log(error);
    }
  }

  changeAccentColor(accentColor) {
    try {
      this.accentColor = accentColor;
      Storage.set({ key: 'accentColor', value: this.accentColor });
    } catch (error) {
      console.log(error);
    }
  }

  // Msg on WhatsApp
  msgOnWhatsApp(fieldValue) {
    try {
      window.open('https://wa.me/' + fieldValue, '_blank');
    } catch (error) {
      console.log(error);
    }
  }

  // Msg on WhatsApp
  callNumber(fieldValue) {
    try {
      window.open('tel:' + fieldValue, '_system');
    } catch (error) {
      console.log(error);
    }
  }

  // Razorpay Code:
  payWithRazorpay(amount, notes) {
    try {
      let name, price, theme;

      name = 'Direct Whatsapp';
      price = amount * 100;
      theme = '#8F46EE';

      //let url = 'http://localhost:2000/createOrderMilan';

      let firebasefunctions_url =
        'https://us-central1-directly-whatsapp.cloudfunctions.net/paymentApi/';

      this.http
        .post(firebasefunctions_url, { amount: price })
        .subscribe((res) => {
          console.log(res);
          console.log(res['id']);
          var options = {
            //key: 'rzp_test_i1CjVUmtGPDAk2',
            key: 'rzp_live_ZPSwzvOlwjcbZC',
            name: name,
            description: 'Donate to Jagdish Chopde.',
            amount: price,
            currency: 'INR',
            image: '/assets/icon/favicon.png',
            order_id: res['id'],
            callback_url: 'https://directly-whatsapp.firebaseapp.com/home',
            redirect: true,
            // handler: (response) => {
            //   console.log(response);
            //   this.presentToast();
            //   this.verifySignature(response);
            // },
            // prefill: {
            //   name: 'Jagdish Chopde',
            //   // email: 'jagdish.chopde@example.com',
            //   // contact: '9999999999',
            // },
            notes: {
              Description: notes,
            },
            theme: {
              color: theme,
            },
          };

          this.initPay(options);
        });
    } catch (error) {
      console.log(error);
    }
  }

  initPay(options) {
    var rzp1 = new Razorpay(options);
    rzp1.open();
  }

  verifySignature(response) {
    let firebasefunctions_url =
      'https://us-central1-directly-whatsapp.cloudfunctions.net/paymentApi/confirmPayment';

    this.http.post(firebasefunctions_url, response).subscribe((res) => {
      console.log('PAYMENT RESPONSE', res['status']);
      this.presentAlert('PAYMENT RESPONSE', res['status']);
    });
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Payment Succesful!',
      duration: 3000,
    });
    toast.present();
  }

  async presentAlert(title, msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      //subHeader: 'Status:',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Start Payment',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          id: 'amount-id',
          //value: '5',
          placeholder: 'Enter Amount',
          attributes: {
            maxlength: 5,
            inputmode: 'decimal',
          },
          min: 1,
          max: 10000,
        },
        // multiline input.
        {
          name: 'notes',
          id: 'notes',
          type: 'textarea',
          placeholder: 'Enter description',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data.amount, data.notes);
            if (!data.amount) {
              this.presentAlert(
                'Validation Error',
                'Please enter valid amount.'
              );
            } else {
              this.payWithRazorpay(data.amount, data.notes);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // payViaUPI() {
  //   try {
  //     let guid = Math.floor(Math.random() * 16).toString(16).toUpperCase();
  //     console.log(guid);

  //     const options = {
  //       action: this.webIntent.ACTION_VIEW,
  //       url: 'upi://pay?pa=pychopde2011@okicici&pn=Pandurang Chopde&tid=' + guid + '&am=12&cu=INR&tn=App Payment&url=https://milan-powar.web.app/home',
  //     }

  //     this.webIntent.startActivity(options).then(
  //       onSuccess => {
  //         console.log('Success', onSuccess);
  //         this.presentAlert('Success', onSuccess);
  //     }, onError => {
  //       console.log('Error', onError);
  //       this.presentAlert('Error Fail', onError);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     this.presentAlert('Error', error);
  //   }
  // }

  // payWithUPI() {
  //   const tid = this.getRandomString();
  //   const orderId = this.getRandomString();
  //   const totalPrice = 1.00;
  //   const UPI_ID = 'sandeepchopde03@oksbi';
  //   const UPI_NAME = 'Sandeep Chopde';
  //   const UPI_TXN_NOTE = 'TEST TXN';
  //   // tslint:disable-next-line: max-line-length
  //   let uri = `upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&tid=${tid}&am=${totalPrice}&cu=INR&tn=${UPI_TXN_NOTE}&tr=${orderId}`;
  //   uri = uri.replace(' ', '+');
  //   (window as any).plugins.intentShim.startActivityForResult(
  //     {
  //       action: this.webIntent.ACTION_VIEW,
  //       url: uri,
  //       requestCode: 1
  //     }, intent => {
  //       if (intent.extras.requestCode === 1 &&
  //           intent.extras.resultCode === (window as any).plugins.intentShim.RESULT_OK &&
  //           intent.extras.Status &&
  //           (((intent.extras.Status as string).toLowerCase()) === ('success'))) {
  //         this.paymentSuccess(orderId, 'UPI');
  //       } else {
  //         this.presentAlert('Error Fail', 'payment failed');
  //         alert('payment failed');
  //       }
  //     }, err => {
  //       alert('error ' + err);
  //     });
  // }

  // getRandomString() {
  //   const len = 10;
  //   const arr = '1234567890asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM';
  //   let ans = '';
  //   for (let i = len; i > 0; i--) {
  //       ans += arr[Math.floor(Math.random() * arr.length)];
  //   }
  //   return ans;
  // }

  // paymentSuccess(orderId: string, paymentMethod: string) {
  //   this.presentAlert('Success', `Payment successful Order Id ${orderId} payment method ${paymentMethod}`);
  //   alert(`Payment successful Order Id ${orderId} payment method ${paymentMethod}`);
  // }
}
