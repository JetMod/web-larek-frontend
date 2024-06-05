import './scss/styles.scss';
import {EventEmitter} from "./components/base/events";
import {AppState, CardItem} from "./components/AppData";
import {Order} from "./components/Order";
import {Page} from "./components/Page";
import { Contacts } from './components/Contacts';
import {LarekAPI} from "./components/LarekAPI";
import {Card, CardBasket} from "./components/Card";
import {cloneTemplate, ensureElement, formatNumber} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {Success} from "./components/common/Success";
import {API_URL, CDN_URL} from "./utils/constants";
import {ICardItem, IContactsForm, IValidityOrderForm, Catalog, IOrderResult} from "./types";


const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// шаблоны
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {onClick: () => modal.close()});
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);


//получение списка карточек
api.getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error('Произошла ошибка с получением данных: ', err);
    });

//открытие корзины
events.on('basket:open', () => {
    basket.total = appData.getTotal();
    basket.selected = appData.order.items;
    modal.render({
        content: basket.render()
    });
    order.isDisable();
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

//вывод карточек
events.on<Catalog>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const cardCatalogItem = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('preview:changed', item)
        });
        return cardCatalogItem.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price !== null ? `${formatNumber(item.price)} синапсов` : 'Бесценно',
        });
    });
    page.counter = appData.getCountLots();
});

events.on('card:select', (item: ICardItem) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: ICardItem) => {
    if (item.price !== null) {
        const cardPreview = new Card('card', cloneTemplate(cardPreviewTemplate), {
            onClick: () => events.emit('card:buy', item)
    })
    return modal.render({
        content: cardPreview.render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: `${formatNumber(item.price)} синапсов`,
        })
    })
    } else {
        const cardPreviewNotBuy = new Card('card', cloneTemplate(cardPreviewTemplate), {
            onClick: () => { 
                cardPreviewNotBuy.blockedButton();
            }
    })
    return modal.render({
        content: cardPreviewNotBuy.render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: 'Бесценно',
        })
    });
    setTimeout(() => {
        modal.close()
    }, 10000);
}});

//товары в корзине
events.on('basket:view', () => {
    basket.items = appData.getBasketLots().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:delete', item)
        });
        return card.render({
            title: item.title,
            price: `${formatNumber(item.price)} синапсов`,
            index: index + 1,
        });
    });
    basket.total = appData.getTotal();
    basket.selected = appData.order.items;
});

events.on('catalog:view', () => {
    page.catalog = appData.getCatalogLots().map(item => {
        const cardCatalogItem = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return cardCatalogItem.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price !== null ? `${formatNumber(item.price)} синапсов` : 'Бесценно',
        });
    });
});

events.on('basket:open', () => {
    basket.total = appData.getTotal();
    basket.selected = appData.order.items;
    modal.render({
        content: basket.render()
    });
    order.isDisable();
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

//добавление карточки в корзину
events.on('card:buy', (item: CardItem) => {
    appData.toggleOrderedCard(item.id, true);
    page.counter = appData.getCountLots();
    modal.close() 
    events.emit('basket:view', item);
    events.emit('catalog:view', item);
})

//удаление карточки с корзины
events.on('card:delete', (item: CardItem) => {
    appData.toggleOrderedCard(item.id, false); 
    events.emit('basket:view', item);
    page.counter = appData.getCountLots();
    events.emit('catalog:view', item);
})

// оформление товаров
events.on('order:open', () => {
    appData.order.total = appData.getTotal();
    modal.render({
        content: order.render({
            payment: null,
            address: '',
            valid: false,
            errors: []
        })
    });
});

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

// оплата товаров
events.on('contacts:submit', () => {
    api.orderCard(appData.order)
        .then((result: IOrderResult) => {
            modal.render({
                content: success.render()
            });
            success.total = result.total;
            appData.clearBasket();
            page.counter = appData.getCountLots(); 
            events.emit('basket:view');
            events.emit('catalog:view');
        })
        .catch(err => {
            console.error('Не удалось оформить заказ: ', err);
        });
});

events.on('orderErrors:change', (errors: Partial<IValidityOrderForm>) => {
    const { address, payment } = errors;
    order.valid = !address && !payment;
    order.errors = Object.values({address, payment}).filter(i => !!i).join(', а также ');
});

events.on(/^order\..*:change/, (data: { field: keyof IValidityOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

events.on('contactsErrors:change', (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join(', а также ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
    appData.setContactsField(data.field, data.value);
});