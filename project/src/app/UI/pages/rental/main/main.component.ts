import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('wrapper', {static: false}) wrapper: ElementRef;
  @ViewChild('popup', {static: false}) popup: ElementRef;
  @ViewChild('error', {static: false}) error: ElementRef;
  currentId: string;
  orderForm: FormGroup;

  constructor(private http: HttpService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initCars();
    this.initForm();
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

  private initForm (): void {
    this.orderForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
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

  toggle (id): void {
    this.wrapper.nativeElement.classList.toggle('blur');
    this.popup.nativeElement.classList.toggle('active');
    if (this.popup.nativeElement.classList.contains('active')) {
      this.currentId = id;
    } else {
      this.currentId = '';
    }
  }

  makeAnOrder (): void {
    if (this.orderForm.valid) {
      console.log(1)
    } else {
      this.error.nativeElement.innerHtml = `Заповніть усі поля!`;
    }
  }
}
