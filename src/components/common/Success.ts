import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { ISuccess, ISuccessActions } from "../../types";

export class Success extends Component<ISuccess> {
    private _close: HTMLElement;
    private _description: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._setupActions(actions);
    }

    private _setupActions(actions: ISuccessActions): void {
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        const message = `Списано ${value} синапсов`;
        this.setText(this._description, message);
    }
}
