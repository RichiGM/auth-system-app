import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements AfterViewInit {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly closed = output<void>();

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly openerElement = document.activeElement as HTMLElement | null;

  protected readonly titleId = computed(
    () => 'modal-title-' + this.title().replace(/\s+/g, '-').toLowerCase(),
  );

  ngAfterViewInit(): void {
    const firstInput = this.panel()?.nativeElement.querySelector<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"])',
    );
    firstInput?.focus();
  }

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.openerElement?.focus();
    this.closed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
