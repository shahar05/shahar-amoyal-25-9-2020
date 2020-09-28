import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FavoritesCitiesQuery } from 'src/app/entities/state/favorites-cities/state/favorites-cities.query';
import { FavoritesCitiesService } from 'src/app/entities/state/favorites-cities/state/favorites-cities.service';
import { FavoritesCity } from 'src/app/entities/state/favorites-cities/state/favorites-city.model';
import { FiveDaysForecast } from 'src/app/entities/state/five-days-forecast/five-days-forecast.model';
import { FiveDaysForecastQuery } from 'src/app/entities/state/five-days-forecast/five-days-forecast.query';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'five-days-forecast',
  templateUrl: './five-days-forecast.component.html',
  styleUrls: ['./five-days-forecast.component.scss']
})
export class FiveDaysForecastComponent implements OnInit {

  fiveDaysForecast: FiveDaysForecast;
  root = document.documentElement;
  favoritesCities: FavoritesCity[];
  isFavorite = false
  constructor(
    private favoritesCitiesQuery: FavoritesCitiesQuery,
    private fiveDaysForecastQuery: FiveDaysForecastQuery, private favoritesCitiesService: FavoritesCitiesService) { }


  ngOnInit(): void {
    this.fiveDaysForecastQuery.selectFirst().subscribe((forecast: FiveDaysForecast) => {
      if (forecast) {
        this.fiveDaysForecast = forecast;

        this.favoritesCitiesService.get();

        this.favoritesCitiesQuery.selectAll().subscribe((favCities: FavoritesCity[]) => {
          

          if (favCities.find(f => f.apiKey === this.fiveDaysForecast.cityKey)) {
            this.isFavorite = true
            this.root.style.setProperty('--favoriteColor', '#b32034')
          } else {
            this.isFavorite = false
            this.root.style.setProperty('--favoriteColor', '#dfe3ee');

          }
        });

      }
    });

  }

  addToFavorites() {

    if (!this.isFavorite) {
   
      this.favoritesCitiesService.add({
        apiKey: this.fiveDaysForecast.cityKey,
        name: this.fiveDaysForecast.cityName,
        currentWeather: null
      });
    } else {
    
      this.favoritesCitiesService.remove(this.fiveDaysForecast.cityKey)
    }
 
  }

}


