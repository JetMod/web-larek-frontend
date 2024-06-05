/**
 * базовый компонент
 */
abstract class Component<T> {
    // защищенный контейнер для элемента
    protected readonly container: HTMLElement;
  
    // конструктор принимает контейнер, в который будет рендериться компонент
    protected constructor(container: HTMLElement) {
      this.container = container;
    }
  
    // утилиты для работы с DOM в дочерних компонентах
  
    // переключить класс на элементе
    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
      element.classList.toggle(className, force);
    }
  
    // установить текстовое содержимое элемента
    protected setText(element: HTMLElement, value: unknown): void {
      if (element) {
        element.textContent = String(value);
      }
    }
  
    // установить изображение с текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
      if (element) {
        element.src = src;
        if (alt) {
          element.alt = alt;
        }
      }
    }
  
    // изменить статус блокировки элемента
    protected setDisabled(element: HTMLElement, state: boolean): void {
      if (element) {
        if (state) {
          element.setAttribute('disabled', 'disabled');
        } else {
          element.removeAttribute('disabled');
        }
      }
    }
  
    // скрыть элемент
    protected setHidden(element: HTMLElement): void {
      element.style.display = 'none';
    }
  
    // показать элемент
    protected setVisible(element: HTMLElement): void {
      element.style.removeProperty('display');
    }
  
    // вернуть корневой DOM-элемент
    public render(data?: Partial<T>): HTMLElement {
      Object.assign(this, data ?? {});
      return this.container;
    }
  }
  
  export { Component };