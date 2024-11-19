import { Form } from "./common/Form";
import { OrderForm, PaymentMethod } from "../types";
import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Order extends Form<OrderForm> {
    private _paymentButtons: Record<PaymentMethod, HTMLButtonElement>;

    constructor(events: EventEmitter, container: HTMLFormElement) {
        super(events, container);

        this._paymentButtons = {
            card: ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container),
            cash: ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container),
        };

        this._initializePaymentButtons();
    }

    private _initializePaymentButtons(): void {
        Object.entries(this._paymentButtons).forEach(([method, button]) => {
            button.addEventListener('click', () => {
                this.payment = method as PaymentMethod;
                this.onInputChange('payment', method);
            });
        });
    }

    set payment(value: PaymentMethod) {
        Object.entries(this._paymentButtons).forEach(([method, button]) => {
            button.classList.toggle('button_alt-active', method === value);
        });
    }

    set address(value: string) {
        this._setInputValue('address', value);
    }

    private _setInputValue(fieldName: keyof OrderForm, value: string): void {
        const input = this.container.elements.namedItem(fieldName) as HTMLInputElement | null;
        if (input) {
            input.value = value;
        } else {
            console.warn(`Поле с именем "${fieldName}" не найдено в форме.`);
        }
    }
}
