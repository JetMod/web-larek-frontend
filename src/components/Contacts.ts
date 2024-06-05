import { Form } from './common/Form';
import { IContactsForm } from '../types';
import { IEvents } from './base/events';

export class Contacts extends Form<IContactsForm> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set email(value: string) {
    this.setFieldValue('email', value);
  }

  set phone(value: string) {
    this.setFieldValue('phone', value);
  }

  private setFieldValue(fieldName: 'email' | 'phone', value: string) {
    const field = this.container.elements.namedItem(fieldName) as HTMLInputElement;
    if (field) {
      field.value = value;
    }
  }
}