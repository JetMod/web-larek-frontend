import { Form } from './common/Form';
import { OrderForm } from '../types/index';
import { EventEmitter } from './base/events';

export class Contacts extends Form<OrderForm> {
    constructor(events: EventEmitter, container: HTMLFormElement) {
        super(events, container);
    }

    set email(value: string) {
        this._setInputValue('email', value);
    }

    set phone(value: string) {
        this._setInputValue('phone', value);
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
