import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;

  constructor(private platform: Platform) {
    // Close the app on back button in android
    this.platform.backButton.subscribeWithPriority(-1, async () => {
      try {
        if (!this.routerOutlet.canGoBack()) {
          App.exitApp();
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
}
