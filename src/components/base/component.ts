/**
 * Базовый компонент
 */
abstract class Component<T> {
    // Защищенный контейнер для элемента
    protected readonly container: HTMLElement;
  
    // Конструктор принимает контейнер, в который будет рендериться компонент
    protected constructor(container: HTMLElement) {
      this.container = container;
    }
  
    // Утилиты для работы с DOM в дочерних компонентах
  
    // Переключить класс на элементе
    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
      element.classList.toggle(className, force);
    }
  
    // Установить текстовое содержимое элемента
    protected setText(element: HTMLElement, value: unknown): void {
      if (element) {
        element.textContent = String(value);
      }
    }
  
    // Установить изображение с текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
      if (element) {
        element.src = src;
        if (alt) {
          element.alt = alt;
        }
      }
    }
  
    // Изменить статус блокировки элемента
    protected setDisabled(element: HTMLElement, state: boolean): void {
      if (element) {
        if (state) {
          element.setAttribute('disabled', 'disabled');
        } else {
          element.removeAttribute('disabled');
        }
      }
    }
  
    // Скрыть элемент
    protected setHidden(element: HTMLElement): void {
      element.style.display = 'none';
    }
  
    // Показать элемент
    protected setVisible(element: HTMLElement): void {
      element.style.removeProperty('display');
    }
  
    // Вернуть корневой DOM-элемент
    public render(data?: Partial<T>): HTMLElement {
      Object.assign(this, data ?? {});
      return this.container;
    }
  }
  
  export { Component };