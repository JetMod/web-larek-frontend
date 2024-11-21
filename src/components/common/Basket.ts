
import { View } from "../base/Component";
import { createElement, cloneTemplate, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { IBasketView } from "../../types";

export class Basket extends View<IBasketView> {
    static template = ensureElement<HTMLTemplateElement>('#basket');

    private _list: HTMLElement;
    private _total: HTMLElement | null;
    private _button: HTMLButtonElement | null;

    constructor(protected events: EventEmitter) {
        const container = cloneTemplate(Basket.template);
        super(events, cloneTemplate(Basket.template));

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        this._initializeButton();
        this.items = [];
    }

    private _initializeButton(): void {
        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this._updateList(items);
            this._toggleButtonState(false);
        } else {
            this._displayEmptyMessage();
            this._toggleButtonState(true);
        }
    }

    set total(price: number) {
        this.setText(this._total, price);
    }

    private _updateList(items: HTMLElement[]): void {
        this._list.replaceChildren(...items);
    }

    private _displayEmptyMessage(): void {
        const emptyMessage = createElement<HTMLParagraphElement>('p', {
            textContent: 'Корзина пуста',
        });
        this._list.replaceChildren(emptyMessage);
    }

    private _toggleButtonState(disabled: boolean): void {
        if (this._button) {
            this._button.disabled = disabled;
        }
    }
}
