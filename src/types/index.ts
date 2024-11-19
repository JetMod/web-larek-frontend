export interface IProduct {
    id: string;
    title: string;
    price: number | null;
    description: string;
    category: string;
    image: string;
}

export interface IBasket {
    items: string[];
    total: number;
}

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

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export type PaymentMethod = 'cash' | 'card'

export interface IOrder {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type OrderForm = Omit<IOrder, 'total' | 'items'>;

export type OrderField = {
    field: keyof OrderForm;
    value: string
}

export interface IOrderResult {
    id: string;
    total: number;
}