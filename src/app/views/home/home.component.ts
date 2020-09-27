import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GetLocationResponse } from 'src/app/app.models';
import { FiveDaysForecastService } from '../../entities/state/five-days-forecast/five-days-forecast.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { FiveDaysForecastQuery } from '../../entities/state/five-days-forecast/five-days-forecast.query';
import { NetService } from 'src/app/services/net.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isBusy = false;
  constructor(private http: HttpClient,
    private utilitiesService: UtilitiesService,
    private fiveDaysForecastQuery: FiveDaysForecastQuery,
    private fiveDaysForecastService: FiveDaysForecastService,
    private netService : NetService
    ) { }

  ngOnInit(): void {
    this.setDefaultCity();
  }

  setDefaultCity() {
    this.isBusy = true;
    this.fiveDaysForecastQuery.selectFirst().subscribe((response) => {
      if (response) {
        this.isBusy = false;

        return;
      }
      navigator.geolocation.getCurrentPosition((geoloaction) => {


        this.netService.getCityByGeolocation(geoloaction.coords.latitude.toString() , geoloaction.coords.longitude.toString())
          .subscribe((res: GetLocationResponse) => {
            this.fiveDaysForecastService.get(res.Key, res.LocalizedName);
            this.isBusy = false;

          }, () => {
            this.utilitiesService.showError();
            this.isBusy = false;

          })


      }, () => {
        this.fiveDaysForecastService.get('215854', 'Tel Aviv');
        this.isBusy = false;

      })
    })

  }

}
