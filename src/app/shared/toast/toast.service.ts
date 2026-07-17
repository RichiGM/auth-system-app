import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  text: string;
  tone: 'ok' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly current = signal<ToastMessage | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  show(text: string, tone: ToastMessage['tone'] = 'ok', ms = 4500): void {
    clearTimeout(this.timer);
    this.current.set({ text, tone });
    this.timer = setTimeout(() => this.current.set(null), ms);
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.current.set(null);
  }
}
