import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewStateService } from '../../entities/state/view-state.service';
import { ViewState } from '../../entities/state/view-state.model';
import { ViewStateQuery } from '../../entities/state/view-state.query';
import { Theme } from 'src/app/app.enums';
import { DegreeType } from '../../app.enums';
import { HostListener } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLightThemeActive: boolean;
  isCelsiusActive: boolean;
  viewState: ViewState;
  display = true;
  constructor(private viewStateService: ViewStateService,
    private viewStateQuery: ViewStateQuery,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  this.display =  window.innerWidth > 600;
    this.viewStateQuery.selectAll().subscribe((res: ViewState[]) => {
      if (res && res.length > 0) {
        this.viewState = res[0];
        this.isLightThemeActive = res[0].theme === Theme.Light;
        this.isCelsiusActive = res[0].degreeType === DegreeType.Celsius;
      }
    })
  }

  toggleTheme() {
    this.isLightThemeActive = !this.isLightThemeActive;
    this.updateViewState();
  }

  toggleDegreeType() {
    this.isCelsiusActive = !this.isCelsiusActive;
    this.updateViewState();

  }

  updateViewState() {
    const id = this.viewState.id;
    this.viewState = {
      id: id,
      degreeType: this.isCelsiusActive ? DegreeType.Celsius : DegreeType.Fahrenheit,
      theme: this.isLightThemeActive ? Theme.Light : Theme.Dark
    };
    this.viewStateService.update(id, this.viewState);
  }

  @HostListener('window:resize', ['$event'])
onResize(event) {
    this.display =  window.innerWidth > 600
}
}
