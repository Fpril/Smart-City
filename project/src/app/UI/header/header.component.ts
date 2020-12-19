import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('nav', {static: false}) nav: ElementRef;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  menu: Array<any>;
  isActive: boolean = true;
  private isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);

  constructor(private http: HttpService,
              private router: Router) { 
    this.router.events.pipe(takeUntil(this.destroy)).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.toggleActiveClass();
      }
    });
  }

  ngOnInit(): void {
    this.connectServer();
    this.initDevice();
    this.initMenu();
  }

  private initDevice(): void {
    let body = document.body;
    if (this.isMobile) {
      body.classList.add('touch');
    } else {
      body.classList.add('mouse');
    }
  }

  private initMenu(): void {
    this.http.getMenu().pipe(takeUntil(this.destroy)).subscribe(data => {
      this.menu = data.menu;
    }, err => {
      console.log(err);
    });
  }

  toggleActiveClass(): void {
    this.isActive = !this.isActive;
  }

  toggleSubMenu(arrow): void {
    const subMenu = arrow.nextElementSibling;
    subMenu.classList.toggle('open');
    arrow.classList.toggle('active');
  }

  toggleMenu (name): void {
    if (name != "Головна сторінка") {
      this.nav.nativeElement.classList.add('white');
    } else {
      this.nav.nativeElement.classList.remove('white');
    }
  }

  connectServer (): void {
    this.http.herokuWakeUp().pipe(takeUntil(this.destroy)).subscribe(data => {
      console.log(data.message);
    }, err => {
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
