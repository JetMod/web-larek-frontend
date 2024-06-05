export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IModalData {
    content: HTMLElement;
}

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    category: string;
    title: string;
    image: string;
    description: string;
    price: number | string;
    button: HTMLButtonElement;
}

export interface ICardBasket {
    title: string;
    price: number | string;
    button: HTMLButtonElement;
    index: number;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export type Pay = 'online' | 'offline';

export interface IOrderForm {
    address: string;
    buttonCard: HTMLButtonElement;
    buttonCash: HTMLButtonElement;
    payment: Pay;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IWebLarekAPI {
    getCardList: () => Promise<ICardItem[]>;
    getCardItem: (id: string) => Promise<ICardItem>;
    orderCard: (order: IOrder) => Promise<IOrderResult>;
}

export interface ICardItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IOrderResult {
    id: string;
    total: string;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
    catalog: ICardItem[];
    basket: string[];
    order: IOrder | null;
    formErrors: FormErrors;
}

export interface IValidityOrderForm {
    address: string;
    payment: Pay;
}

export type Catalog = {
    catalog: ICardItem[]
};