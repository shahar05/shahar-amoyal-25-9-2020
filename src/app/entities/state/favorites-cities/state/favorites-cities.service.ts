import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { FavoritesCitiesStore } from './favorites-cities.store';
import { createFavoritesCity, CurrentWeather, FavoritesCity } from './favorites-city.model';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { LocalStorageKey } from 'src/app/app.enums';
import { FavoritesCitiesQuery } from './favorites-cities.query';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { NetService } from 'src/app/services/net.service';

@Injectable({ providedIn: 'root' })
export class FavoritesCitiesService {

  constructor(private favoritesCitiesStore: FavoritesCitiesStore,
    
    private utilitiesService: UtilitiesService,
    private favoritesCitiesQuery: FavoritesCitiesQuery,
    private localstorageService: LocalstorageService,
    private netService: NetService
  ) {
  }

 private getFromLocalStorage(): FavoritesCity[] {
    return this.localstorageService.getItem(LocalStorageKey.FavoritesCities)
  }
  private saveToLocalStorage(cities: FavoritesCity[]) {
    this.localstorageService.saveItem(LocalStorageKey.FavoritesCities, JSON.stringify(cities));
  }

  get() {
    const cities: FavoritesCity[] = this.localstorageService.getItem(LocalStorageKey.FavoritesCities);
    if (cities) {
      this.favoritesCitiesStore.set(cities);
    }
  }

  add(favoritesCity: Partial<FavoritesCity>) {
    const cityToAdd: FavoritesCity = createFavoritesCity(favoritesCity);
    const cities: FavoritesCity[] = this.getFromLocalStorage();
    this.utilitiesService.showAdd("Added to Favorite Cities")
    this.favoritesCitiesQuery.selectEntity((item: FavoritesCity) => item.apiKey === cityToAdd.apiKey).subscribe((isItemExist) => {
      if (!isItemExist) {
        this.favoritesCitiesStore.add(cityToAdd);
        if (!cities.find(c => c.apiKey === cityToAdd.apiKey)) {
          cities.push(cityToAdd)
          this.saveToLocalStorage(cities)
        }
      }
    });
  }

  remove(id: ID) {
    this.utilitiesService.showAdd("Removed from Favorite Cities")
    this.favoritesCitiesStore.remove(id);
    let cities = this.getFromLocalStorage()
    let index = cities.findIndex(c => c.apiKey === id)
    cities.splice(index , 1)
    this.saveToLocalStorage(cities)
  }


  update(id, favoritesCity: Partial<FavoritesCity>) {
    this.favoritesCitiesStore.update(id, favoritesCity);
    let cities = this.getFromLocalStorage()
    let index = cities.findIndex(c => c.apiKey === id)
    const cityToUpdate: FavoritesCity = createFavoritesCity(favoritesCity);
    cities[index] = cityToUpdate
    this.saveToLocalStorage(cities)
  }

  setForecast(favoritesCity: Partial<FavoritesCity>) {
    const newFavoritesCity = { ...favoritesCity };

    this.netService.getCurrentCondition(favoritesCity.apiKey)
      .subscribe((res: CurrentWeather[]) => {
        if (res && res.length > 0) {
          newFavoritesCity.currentWeather = res[0];
          this.update(newFavoritesCity.id, newFavoritesCity);
        }
      }
        , () => {
          this.utilitiesService.showError();
        })
  }

}
