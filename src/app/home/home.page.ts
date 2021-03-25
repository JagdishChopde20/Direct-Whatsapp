import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  dark = false;
  accentColor = 'primary';

  constructor() {
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
}
