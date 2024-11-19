import './scss/styles.scss';
import { EventEmitter } from './src/components/base/events';
import { AppData } from './src/components/AppData';
import { LarekAPI } from './src/components/LarekApi';
import { Page } from './src/components/Page';
import { Card } from './src/components/Card';
import { Order } from './src/components/Order';
import { Contacts } from './src/components/Contacts';
import { API_URL, CDN_URL } from './src/utils/constants';
import { cloneTemplate, ensureElement } from './src/utils/utils';
import { Modal } from './src/components/common/Modal';
import { Basket } from './src/components/common/Basket';
import { Success } from './src/components/common/Success';
import { OrderField, IProduct, OrderForm } from './src/types';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppData(events);

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(events);
const modal = new Modal(events, modalTemplate);
const contactsForm = new Contacts(events, cloneTemplate(contactsTemplate));
const page = new Page(events, document.body);
const orderForm = new Order(events, cloneTemplate(orderTemplate));

function handleError(error: any) {
    console.error('Произошла ошибка:', error);
}

events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
        .then(result => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close(),
            });
            appData.clearBasket();
            modal.render({
                content: success.render(result),
            });
        })
        .catch(handleError);
});

events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('items:change', (items: IProduct[]) => {
    page.catalog = items.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render(item);
    });
});

events.on('preview:change', (item: IProduct) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (appData.inBasket(item)) {
                appData.removeFromBasket(item);
                card.button = 'В корзину';
            } else {
                appData.addToBasket(item);
                card.button = 'Удалить из корзины';
            }
        },
    });
    card.button = appData.inBasket(item) ? 'Удалить из корзины' : 'В корзину';
    modal.render({
        content: card.render(item),
    });
});

events.on('basket:change', () => {
    page.counter = appData.basket.items.length;

    basket.items = appData.basket.items.map(id => {
        const item = appData.items.find(item => item.id === id);
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.removeFromBasket(item),
        });
        return card.render(item);
    });
    basket.total = appData.basket.total;
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render(),
    });
});

events.on(/^order\..*:change$/, (data: OrderField) => {
    appData.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change$/, (data: OrderField) => {
    appData.setOrderField(data.field, data.value);
});

events.on('formErrors:change', (errors: Partial<OrderForm>) => {
    const { payment, address, email, phone } = errors;
    orderForm.valid = !payment && !address;
    contactsForm.valid = !email && !phone;
});

api.getProductList()
    .then(appData.setItems.bind(appData))
    .catch(handleError);