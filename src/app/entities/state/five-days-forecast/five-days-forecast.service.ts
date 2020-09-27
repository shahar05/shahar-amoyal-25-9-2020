import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { FiveDaysForecastStore } from './five-days-forecast.store';
import { FiveDaysForecast, FiveDaysForecastData } from './five-days-forecast.model';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { NetService } from 'src/app/services/net.service';



@Injectable({ providedIn: 'root' })
export class FiveDaysForecastService {

  constructor(
    private fiveDaysForecastStore: FiveDaysForecastStore,
    private utilitiesService: UtilitiesService,
    private netService: NetService
  ) { }

  get(cityCode: string, cityName: string) {
    this.netService.get5DayForecast(cityCode)
      .subscribe((entities: FiveDaysForecastData) => {
        this.removeAll();
        this.fiveDaysForecastStore.set([{ cityKey: cityCode, cityName: cityName, data: entities }]);
      }, () => {
        this.utilitiesService.showError();
      });

  }

  private removeAll() {
    this.fiveDaysForecastStore.reset();
  }

}