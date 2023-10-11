import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';

interface CustomEventTargetWithFiles extends EventTarget {
  files: FileList;
}

interface CustomEventWithFiles extends Event {
  target: CustomEventTargetWithFiles;
}

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @HostBinding('class.fileover') fileOver: boolean;
  @Output() fileDropped = new EventEmitter<any>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }


  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    // Create a custom event object
    const customEvent: CustomEventWithFiles = new Event('drop', {bubbles: true, cancelable: true}) as CustomEventWithFiles;

    // Set the target property to match the DragEvent's target
    Object.defineProperty(customEvent, 'target', {
      value: Object.assign(Object.create(EventTarget.prototype), {
        files: evt.dataTransfer.files
      }),
      writable: false
    });

    Object.defineProperty(customEvent, 'srcElement', {
      value: evt.target,
      writable: false
    });

    // console.log("EVENTO CUSTOM: ",customEvent)

    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(customEvent);
    }
  }
}
