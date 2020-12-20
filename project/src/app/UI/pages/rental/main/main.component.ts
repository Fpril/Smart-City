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
  @ViewChild('message', {static: false}) message: ElementRef;
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
      phone: ['', [Validators.required]],
      days: ['', [Validators.required, Validators.min(1)]]
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
      this.message.nativeElement.innerHTML = '';
      const order = {
        name: this.orderForm.get('name').value,
        phone: this.orderForm.get('phone').value,
        days: this.orderForm.get('days').value,
        carId: this.currentId
      }
      this.http.createOrder(order).pipe(takeUntil(this.destroy)).subscribe(data => {
        if (data.message) {
          this.message.nativeElement.classList.remove('error');
          this.message.nativeElement.classList.add('success');
          this.message.nativeElement.innerHTML = 'Ваше замовлення оформлено, чекайте дзвінка!';
        } else {
          this.message.nativeElement.classList.remove('success');
          this.message.nativeElement.classList.add('error');
          this.message.nativeElement.innerHTML = 'Ви вже оформили замовлення!';
        }
      }, err => {
        console.log(err);
      });
      
    } else {
      this.message.nativeElement.classList.remove('success');
      this.message.nativeElement.classList.add('error');
      this.message.nativeElement.innerHTML = 'Заповніть усі поля!';
    }
  }
}
