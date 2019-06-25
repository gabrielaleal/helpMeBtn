import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private url = 'https://helpmeback.herokuapp.com'
  private location
  constructor(private geolocation: Geolocation, private http: HttpClient) {}

  ionViewDidEnter(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.location.lat = data.coords.latitude;
      this.location.long = data.coords.longitude;
    });
  }

  sendGeoloc() {
    let data = {
      x: this.location.lat,
      y: this.location.long
    }
    return this.http.post(this.url + '/create_alarm', data)
  }
}
