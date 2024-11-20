import { View } from "./base/component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { IPage } from "../types";

export class Page extends View<IPage> {
    private _counter: HTMLElement;
    private _catalog: HTMLElement;
    private _basket: HTMLElement;
    private _wrapper: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._initializeBasket();
    }

    private _initializeBasket(): void {
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this._wrapper.classList.toggle('page__wrapper_locked', value);
    }
}
