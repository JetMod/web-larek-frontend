import { Api, ApiListResponse } from './base/Api';
import { IOrder, IOrderResult, IProduct } from "../types";

export interface ILarekAPI {
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
    getProductList: () => Promise<IProduct[]>;
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // получаем информацию о продукте по id
    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image,
        }));
    }

    // отправляем заказ на сервер
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: IOrderResult) => data);
    }

    // получаем список продуктов
    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }
}
