class CustomSelect extends EventTarget {

  constructor(selectData) {
    super();

    this.data = selectData;

    this.selectWrapper = document.querySelector(this.data.wrapperSelector);
    this.hiddenInput = document.createElement('input');
    this.optionsList = document.createElement('ul');
    this.visibleSpan = document.createElement('span');

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

    this.data.options.forEach(option => {
      const listItem = document.createElement('li');
      listItem.className = 'custom-select__option';
      listItem.dataset.value = option.value;
      listItem.textContent = option.name;
      this.optionsList.append(listItem);
    })

    this.visibleSpan.id = `${this.data.id}-selected-value`;
    this.setPlaceholder();
  }

  setPlaceholder() {
    this.visibleSpan.innerText = this.data.placeholder || 'Select an option...';
    this.visibleSpan.style.color = this.data.placeholderColor;
  }

  append() {
    this.selectWrapper.append(this.hiddenInput);
    this.selectWrapper.append(this.visibleSpan);
    this.selectWrapper.append(this.optionsList);
  }

  toggleList() {
    this.selectWrapper.classList.toggle('select-wrapper_active');
    this.optionsList.classList.toggle('custom-select_active');
  }

  closeList() {
    if (this.selectWrapper.classList.contains('select-wrapper_active')) {
      this.selectWrapper.classList.remove('select-wrapper_active');
      this.optionsList.classList.remove('custom-select_active');
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
    this.selectWrapper.addEventListener('click', () => this.toggleList());

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
