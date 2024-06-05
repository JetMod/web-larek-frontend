import { IEvents } from "./base/events";
import { Form } from "./common/Form";
import { IOrderForm, Pay } from "../types/index";

export class Order extends Form<IOrderForm> {
  protected _buttonCard: HTMLButtonElement;
  protected _buttonCash: HTMLButtonElement;
  protected _payment: Pay;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttonCard = container.querySelector('[name="card"]') as HTMLButtonElement;
    this._buttonCash = container.querySelector('[name="cash"]') as HTMLButtonElement;

    if (this._buttonCard) {
      this._buttonCard.addEventListener('click', () => {
        this.handlePaymentChange('card', 'online');
      });
    }

    if (this._buttonCash) {
      this._buttonCash.addEventListener('click', () => {
        this.handlePaymentChange('cash', 'offline');
      });
    }
  }

  private handlePaymentChange(type: 'card' | 'cash', value: Pay): void {
    const field = 'payment';
    this.events.emit(`${this.container.name}.${type}:change`, { field, value });
    this.payment = value;
    this.toggleActiveClass(type);
  }

  private toggleActiveClass(type: 'card' | 'cash'): void {
    if (type === 'card') {
      this._buttonCard.classList.add('button_alt-active');
      this._buttonCash.classList.remove('button_alt-active');
    } else {
      this._buttonCash.classList.add('button_alt-active');
      this._buttonCard.classList.remove('button_alt-active');
    }
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set payment(value: Pay) {
    this._payment = value;
  }

  isDisable(): void {
    this.toggleActiveClass('card');
    this.toggleActiveClass('cash');
    this.events.emit(`${this.container.name}.cash:change`, { field: 'payment', value: '' });
  }
}