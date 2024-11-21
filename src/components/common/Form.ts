import { View } from "../base/Component";
import { EventEmitter } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IFormState } from "../../types";

export class Form<T> extends View<IFormState> {
    private _submit: HTMLButtonElement;
    private _errors: HTMLElement;

    constructor(protected events: EventEmitter, protected container: HTMLFormElement) {
        super(events, container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this._setupEventListeners();
    }

    private _setupEventListeners(): void {
        this.container.addEventListener('input', this._handleInputChange.bind(this));
        this.container.addEventListener('submit', this._handleFormSubmit.bind(this));
    }

    private _handleInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const field = target.name as keyof T;
        const value = target.value;
        this.onInputChange(field, value);
    }

    private _handleFormSubmit(event: Event): void {
        event.preventDefault();
        this.events.emit(`${this.container.name}:submit`);
    }

    protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState): HTMLElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}
