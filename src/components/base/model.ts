import { IEvents } from './events';

/**
 * Проверяет, является ли переданный объект экземпляром класса `Model`.
 *
 * @param obj - Объект для проверки.
 * @returns `true`, если объект является экземпляром `Model`, иначе `false`.
 */
export const isModel = <T>(obj: unknown): obj is Model<T> => {
    return obj instanceof Model;
};

/**
 * абстрактный базовый класс для моделей.
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected readonly events: IEvents) {
        Object.assign(this, data);
    }

    /**
     * Сообщает всем подписчикам, что модель изменилась.
     *
     * @param event - Название события, которое нужно отправить.
     * @param payload - Дополнительные данные, которые нужно отправить вместе с событием (необязательно).
     */
    emitChanges(event: string, payload: object = {}): void {
        // Можно модифицировать состав данных, отправляемых в событие
        this.events.emit(event, payload);
    }
}