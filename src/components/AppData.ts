import { IBasket, IOrder, IProduct, OrderForm, PaymentMethod } from "../types";
import { IEvents } from "./base/events";

export class AppData {
    items: IProduct[] = [];
    basket: IBasket = {
        items: [],
        total: 0,
    };
    preview: IProduct | null = null;
    order: IOrder = {
        payment: 'card',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: [],
    };
    formErrors: Partial<Record<keyof OrderForm, string>> = {};

    constructor(private readonly events: IEvents) { }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('items:change', this.items);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit('preview:change', this.preview);
    }

    inBasket(item: IProduct): boolean {
        return this.basket.items.includes(item.id);
    }

    addToBasket(item: IProduct): void {
        if (!this.inBasket(item)) {
            this.basket.items.push(item.id);
            this.basket.total += item.price;
            this._emitBasketChange();
        }
    }

    removeFromBasket(item: IProduct): void {
        const itemIndex = this.basket.items.indexOf(item.id);
        if (itemIndex !== -1) {
            this.basket.items.splice(itemIndex, 1);
            this.basket.total -= item.price;
            this._emitBasketChange();
        }
    }

    clearBasket(): void {
        this.basket.items = [];
        this.basket.total = 0;
        this._emitBasketChange();
    }

    private _emitBasketChange(): void {
        this.events.emit('basket:change', this.basket);
    }

    setPaymentMethod(value: PaymentMethod): void {
        this.order.payment = value;
    }

    setOrderField(field: keyof OrderForm, value: string): void {
        if (field === 'payment') {
            this.setPaymentMethod(value as PaymentMethod);
        } else {
            this.order[field] = value;
        }
        if (this.order.payment && this.validateOrder()) {
            this._updateOrderFromBasket();
        }
    }

    private _updateOrderFromBasket(): void {
        this.order.total = this.basket.total;
        this.order.items = this.basket.items;
    }

    validateOrder(): boolean {
        const errors: Partial<Record<keyof OrderForm, string>> = {};

        if (!this.order.email) errors.email = 'Необходимо указать email';
        if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
        if (!this.order.address) errors.address = 'Необходимо указать адрес';

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}