import { Injectable } from '@angular/core';
import { guid, ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { CityStore } from './city.store';
import { City } from './city.model';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { NetService } from 'src/app/services/net.service';

@Injectable({ providedIn: 'root' })
export class CityService {

  constructor(private cityStore: CityStore,
    private utilitiesService:UtilitiesService,
    private http: HttpClient,
    private netService : NetService
    ) {
  }

  get(searchText: string) {

    this.netService.getCitiesByName(searchText)
    .subscribe((entities: City[]) => {
    if(!entities){
      return [];
    }
      entities = entities.map(e=>{return {id:guid() , ...e}} )
      this.cityStore.set(entities);

    }, () => {
      this.utilitiesService.showError();
    });


  }




}
