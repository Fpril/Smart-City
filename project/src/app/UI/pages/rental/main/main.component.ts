import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import VanillaTilt from 'vanilla-tilt';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {

  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  cars: Array<any>;
  @ViewChildren('allCards') allCards: QueryList<any>;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.initCars();
  }

  ngAfterViewInit(): void {
    this.allCards.changes.pipe(takeUntil(this.destroy)).subscribe(t => {
      this.initCards();
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  private initCars (): void {
    this.http.getCars().pipe(takeUntil(this.destroy)).subscribe(data => {
      this.cars = data.cars;
    }, err => {
      console.log(err);
    });
  }

  private initCards (): void {
    const cards = document.querySelectorAll('.card');
    VanillaTilt.init(Array.prototype.slice.call(cards), {
      max: 25,
      speed: 400,
      glare: true,
      "max-glare": 1
    });
  }
}
