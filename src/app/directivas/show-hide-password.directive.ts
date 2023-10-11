import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[show-hide-password]'
})
export class ShowHidePasswordDirective {

  private _shown = false;
  public eyeIcon = this.renderer.createElement('span');

  constructor(private el: ElementRef, private renderer: Renderer2) {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');

    this.renderer.addClass(this.eyeIcon, 'fa');
    this.renderer.addClass(this.eyeIcon, 'fa-eye');

    //span.innerHTML = 'Mostrar';
    span.addEventListener('click', () => {
      this.toggle(span);
      if (this._shown)
        this.renderer.removeClass(this.eyeIcon, 'fa-eye');
      else
        this.renderer.removeClass(this.eyeIcon, 'fa-eye-slash');
    });
    span.appendChild(this.eyeIcon);
    parent.appendChild(span);
  }

  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      //span.innerHTML = 'Ocultar';
      
      this.renderer.removeClass(this.eyeIcon, 'fa-eye-slash');
      this.renderer.addClass(this.eyeIcon, 'fa-eye-slash'); 
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      //span.innerHTML = 'Mostrar';
      
      this.renderer.removeClass(this.eyeIcon, 'fa-eye');
      this.renderer.addClass(this.eyeIcon, 'fa-eye');
    }
  }
}