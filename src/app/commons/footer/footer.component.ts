import { Component, OnInit } from '@angular/core';

/*Iconos*/
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faVoicemail } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
  faGlobe = faGlobe;
  faLocation = faLocation;
  faMessage = faMessage;
  faPhone = faPhone;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faHome = faHome;
  faVoicemail = faVoicemail;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  shouldShowFooter(): boolean {
    return !this.router.url.includes('/explorar');
  }

}
