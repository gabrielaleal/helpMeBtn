import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

export interface Location {
  lat: Number,
  long: Number
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private url = 'https://helpmeback.herokuapp.com'
  constructor(private geolocation: Geolocation, private http: HttpClient, public alertController: AlertController) {}

  private location: Location = {'lat':0, 'long':0};
  ionViewDidEnter(){
    console.log(this.location)
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log(data.coords)
      this.location.lat = data.coords.latitude;
      this.location.long = data.coords.longitude;
    });
  }

  sendGeoloc() {
    let data = {
      x: this.location.lat,
      y: this.location.long
    }
    return this.http.post(this.url + '/create_alarm', data).subscribe(res=>{
      console.log(`res: ${JSON.stringify(res)}`);
      let msg = res.message
      if(msg.includes("New alarm created")) {
        this.presentAlert();
      } else if(msg.includes("error")) {
        this.errorAlert();
      }
    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Sua localização foi enviada',
      message: 'Aguarde pela ajuda ou ligue para um dos telefones úteis.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorAlert() {
    const alert = await this.alertController.create({
      header: 'Localização inválida',
      message: 'Ligue o GPS ou verifique se seu dispositivo está conectado a Internet.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
