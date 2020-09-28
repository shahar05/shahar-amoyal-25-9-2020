import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



const URL = "http://dataservice.accuweather.com"

const DEVELOP_URL = "../../assets/db/"
const DURING_DEVELOPMENT = false;


@Injectable({ providedIn: 'root' })
export class NetService {



  constructor(private http: HttpClient) { }

  getCitiesByName(searchText: string) {
    return !DURING_DEVELOPMENT ?
      this.http.get(`${URL}/locations/v1/cities/autocomplete?apikey=${environment.weatherApiToken}&q=${searchText}`) :
      this.getCitiesByNameMock();
  }
  getCurrentCondition(cityApiKey: string) {
    return !DURING_DEVELOPMENT ?
      this.http.get(`${URL}/currentconditions/v1/${cityApiKey}?apikey=${environment.weatherApiToken}`) :
      this.getCurrentConditionMock();
  }

  get5DayForecast(cityCode: string) {
    return !DURING_DEVELOPMENT ?
      this.http.get(`${URL}/forecasts/v1/daily/5day/${cityCode}?apikey=${environment.weatherApiToken}&details=true&metric=false`) :
      this.get5DayForecastMock();
  }
  getCityByGeolocation(lat: string, long: string) {
    return !DURING_DEVELOPMENT ?
      this.http.get(`${URL}/locations/v1/cities/geoposition/search?apikey=${environment.weatherApiToken}&q=${lat},${long}`) :
      this.getCityByGeolocationMock();

  }


 private getCitiesByNameMock() {
  return this.http.get( DEVELOP_URL + "autocpmloete.json" )
  }
  private getCurrentConditionMock() {
  
    return this.http.get( DEVELOP_URL + "currentcondition.json" )
  }
  private get5DayForecastMock( ){
    return this.http.get( DEVELOP_URL + "fiveday.json" )
  }

  private getCityByGeolocationMock() {
    return this.http.get( DEVELOP_URL + "geo.json" )
  }






}
