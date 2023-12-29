class CustomSelect extends EventTarget {

  constructor(selectData) {
    super();

    this.data = selectData;

    this.selectWrapper = document.querySelector(this.data.wrapperSelector);
    this.hiddenInput = document.createElement('input');
    this.optionsList = document.createElement('ul');
    this.visibleSpan = document.createElement('span');
    this.filterField = document.createElement('input');
    this.filterValue = '';

    this.customEvent = new CustomEvent(this.data.eventName);
  }

  render() {
    this.selectWrapper.classList.add('select-wrapper');

    this.hiddenInput.type = 'hidden';
    this.hiddenInput.id = this.data.id;
    this.hiddenInput.name = this.data.name;

    if (this.data.isRequired) {
      this.hiddenInput.required = true;
    }

    this.optionsList.className = 'custom-select';
    this.optionsList.id = `${this.data.id}-list`;

    this.renderList();

    this.visibleSpan.id = `${this.data.id}-selected-value`;
    this.setPlaceholder();

    this.filterField.className = 'custom-select__filter input-text input-text_filter';
    this.setFilter();
  }

  renderList() {
    this.optionsList.innerHTML = '';
    const data = this.data.options.filter(option => option.name.toLowerCase().includes(this.filterValue.trim().toLowerCase()));
    if (!data.length) {
      const errorText = document.createElement('div');
      errorText.className = 'custom-select__error';
      errorText.innerText = 'Ничего не найдено';
      this.optionsList.append(errorText);
    } else {
      data.forEach(option => {
        const listItem = document.createElement('li');
        listItem.className = 'custom-select__option';
        listItem.dataset.value = option.value;
        listItem.textContent = option.name;
        this.optionsList.append(listItem);
      })
    }
  }

  setPlaceholder() {
    this.visibleSpan.innerText = this.data.placeholder || 'Select an option...';
    this.visibleSpan.style.color = this.data.placeholderColor;
  }

  setFilter() {
    this.filterField.addEventListener("input", () => {
      this.filterValue = this.filterField.value;
      this.renderList();
    })
  }

  clearFilter() {
    this.filterValue = '';
    this.filterField.value = '';
    this.renderList();
  }

  append() {
    this.selectWrapper.append(this.hiddenInput);
    this.selectWrapper.append(this.visibleSpan);
    this.selectWrapper.append(this.optionsList);
    this.selectWrapper.append(this.filterField);
  }

  toggleList() {
    this.selectWrapper.classList.toggle('select-wrapper_active');
    this.optionsList.classList.toggle('custom-select_active');
    this.filterField.classList.toggle('custom-select__filter_active');
    this.filterField.focus();
    this.clearFilter();
  }

  closeList() {
    if (this.selectWrapper.classList.contains('select-wrapper_active')) {
      this.selectWrapper.classList.remove('select-wrapper_active');
      this.optionsList.classList.remove('custom-select_active');
      this.filterField.classList.remove('custom-select__filter_active');
    }
  }

  setValue(newValue) {
    this.visibleSpan.innerText = newValue.innerText;
    this.visibleSpan.style.color = this.data.mainColor;
    this.hiddenInput.value = newValue.dataset.value;

    this.dispatchEvent(this.customEvent);
  }

  getValue() {
    return this.hiddenInput.value;
  }

  reset() {
    this.closeList();
    this.hiddenInput.value = '';
    this.setPlaceholder();
  }

  selectOption(event) {
    if (event.target.classList.contains('custom-select__option')) {
      this.setValue(event.target);
    }
  }

  handleEvents() {
    this.selectWrapper.addEventListener('click', (event) => {
      if (!event.target.classList.contains('custom-select__filter')) {
      this.toggleList();
      }
    });

    this.optionsList.addEventListener('click', (event) => this.selectOption(event));

    document.addEventListener('click', (event) => {
      if (!event.target.closest(this.data.wrapperSelector)) {
        this.closeList();
      }
    })
  }

  create() {
    this.render();
    this.append();
    this.handleEvents();
  }
}
