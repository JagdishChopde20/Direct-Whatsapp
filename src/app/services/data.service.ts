import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    public http: HttpClient,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    private loadingCtrl: LoadingController,
  ) {}

   // Show Loading
   async loading(text: string) {
    return await this.loadingCtrl.create({
      message: text,
    });
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

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Transaction Complete.',
      duration: 3000,
    });
    toast.present();
  }

  async createOrderOnRazorpay(price: number) {
    //let url = 'http://localhost:2000/createOrderMilan';

    let firebasefunctions_url =
      'https://us-central1-directly-whatsapp.cloudfunctions.net/paymentApi/';

    let res = await this.http
      .post(firebasefunctions_url, { amount: price * 100 })
      .toPromise();

      console.log(res);
      console.log(res['id']);
      return res;
  }

  verifySignature(response) {
    return new Promise(resolve=>{
    let firebasefunctions_url = 'https://us-central1-directly-whatsapp.cloudfunctions.net/paymentApi/confirmPayment';

    this.http.post(firebasefunctions_url, response).subscribe((res) => {
      console.log('Signature Verified: ', res['status']);
      resolve(res['status']);
    });
  });
  }
}
