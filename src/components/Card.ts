import { Component } from "./base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { ICardActions } from "../../types";

const cardCategories = new Map([
    ['софт-скил', 'soft'],
    ['хард-скил', 'hard'],
    ['другое', 'other'],
    ['дополнительное', 'additional'],
    ['кнопка', 'button'],
]);

export class Card extends Component<IProduct> {
    private _title: HTMLElement;
    private _image?: HTMLImageElement;
    private _price: HTMLElement;
    private _description?: HTMLElement;
    private _category?: HTMLElement;
    private _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._description = container.querySelector('.card__description');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
        this._setupActions(actions);
    }

    private _setupActions(actions?: ICardActions): void {
        if (actions?.onClick) {
            const target = this._button || this.container;
            target.addEventListener('click', actions.onClick);
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const classPostfix = cardCategories.get(value);
            if (classPostfix) {
                this._category.className = `card__category card__category_${classPostfix}`;
            }
        }
    }

    get category(): string {
        return this._category?.textContent || '';
    }

    set price(value: string) {
        const displayValue = value || 'Бесценно';
        this.setText(this._price, displayValue);

        if (this._button) {
            this._button.disabled = !value;
        }
    }

    get price(): string {
        return this._price.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set button(value: string) {
        this.setText(this._button, value);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }
}
