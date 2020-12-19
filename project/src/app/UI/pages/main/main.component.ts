import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('imgBx', {static: false}) imgBx: ElementRef;
  @ViewChild('contentBx', {static: false}) contentBx: ElementRef;
  slides: Array<any>;
  slidesText: Array<any>;
  content: Array<any>;
  index: number = 0;
  textIndex: number = 0;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private http: HttpService) {
  }

  ngOnInit(): void {
    this.http.getContent().pipe(takeUntil(this.destroy)).subscribe(data => {
      this.content = data.slider;
    }), err => {
      console.log(err);
    };
  }

  ngAfterViewInit(): void {
    this.initSlider();
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  initSlider(): void {
    this.slides = [...this.imgBx.nativeElement.querySelectorAll('img')];
  }

  nextSlide(): void {
    this.slidesText = [...this.contentBx.nativeElement.querySelectorAll('div')];
    this.slides[this.index].classList.remove('active');
    this.slidesText[this.textIndex].classList.remove('active');
    this.index = (this.index + 1) % this.slides.length;
    this.textIndex = (this.textIndex + 1) % this.slidesText.length;
    this.slides[this.index].classList.add('active');
    this.slidesText[this.textIndex].classList.add('active');
  }

  prevSlide(): void {
    this.slides[this.index].classList.remove('active');
    this.slidesText[this.textIndex].classList.remove('active');
    this.index = (this.index - 1 + this.slides.length) % this.slides.length;
    this.textIndex = (this.textIndex - 1 + this.slidesText.length) % this.slidesText.length;
    this.slides[this.index].classList.add('active');
    this.slidesText[this.textIndex].classList.add('active');
  }

}
