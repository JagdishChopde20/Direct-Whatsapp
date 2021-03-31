import { Component, OnInit } from '@angular/core';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { AlertController, Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  dark = false;
  accentColor = 'primary';
  isOnAndroid: boolean;

  constructor(
    private platform: Platform,
    public alertController: AlertController,
    private router: Router,
    private dataService: DataService
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

      if (this.platform.is('android') && !this.platform.is("mobileweb")) {
        this.isOnAndroid = true;
      } else {
        this.isOnAndroid = false;
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
          handler: async (data) => {
            console.log('Confirm Ok', data.amount, data.notes);
            if (!data.amount) {
              this.dataService.presentAlert(
                'Validation Error',
                'Please enter valid amount.'
              );
            } else {
              let loading = await this.dataService.loading('Loading...');
              try {
                loading.present();

                let res = await this.dataService.createOrderOnRazorpay(
                  data.amount
                );
                if (res && res['id']) {
                  if (this.isOnAndroid) {
                    window.open(
                      `https://directly-whatsapp.web.app/start-razorpayment?device=android&order_id=${res['id']}&amount=${data.amount}&notes=${data.notes}`,
                      '_blank'
                    );
                  } else {
                    this.router.navigate(['start-razorpayment'], {
                      queryParams: {
                        order_id: res['id'],
                        amount: data.amount,
                        notes: data.notes,
                      },
                    });
                  }
                } else {
                  this.dataService.presentAlert(
                    'Razorpay Error',
                    'Unable to create your order. Please try again.'
                  );
                }
              } catch (error) {
                console.log(error);
              } finally {
                loading.dismiss();
              }
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
