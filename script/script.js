/* Handle form */

const form = document.querySelector('#form');
const requiredElements = form.querySelectorAll('[required]');
const submitButton = form.querySelector('#submit-button');
const clearButton = form.querySelector('#clear-button');

function changeButtonState(button, isFormValid) {
  if (isFormValid) {
    button.classList = 'button';
  } else {
    button.classList = 'button button_inactive';
  }
}

function validateForm() {
  changeButtonState(submitButton, false);

  let isFormValid = false;

  requiredElements.forEach(element => {
    if (element.value.length === 0) {
      isFormValid = false;
      return isFormValid;
    } else {
      isFormValid = true;
    }
  })

  if (form.querySelector('#product-type').checked) {
    isFormValid = isFormValid && !!form.querySelector('#special-product').value.length;
  }
 
  changeButtonState(submitButton, isFormValid);
  return isFormValid;
}

function checkFormIsFilled() {
  const formElements = Array.from(form.elements);
  for (let i = 0; i < formElements.length; i++) {
    if (
      formElements[i].type === 'text' && formElements[i].value.length || 
      formElements[i].id === 'product-type' && formElements[i].checked) {
      changeButtonState(clearButton, true);
      break;
    }
    changeButtonState(clearButton, false);
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (validateForm()) {
    let result = '';
    const data = {};

    Array.from(form.elements).forEach((element) => {
      const { name, type } = element;
      const value = type === 'checkbox' ? element.checked : element.value.trim();
      data[name] = value;
    })

    data.link = trimFromSlash(data.link);

    data['article-url'] = trimFromSlash(data['article-url']);
    if (data['article-url'].includes('/')) {
      data['article-url'] = getSlug(data['article-url'])[0];
    }

    const regex = /\-/gm;
    data['article-url'] = data['article-url'].replace(regex, '_');

    data['utm-type'] = form.querySelector('input[type=radio]:checked').value;

    if (data['product-type']) {
      data.product = data['special-product'];
    } else {
      data.product = getSlug(data.link);
    }

    console.log(data.product);

    result = `${data.link}/?internal_source=tsecrets-${data['article-url']}-${data['utm-type']}-${data.product}`;

    resultField.value = result;
    resultBlock.classList.add('block_result_visible');
    }
}

Array.from(form.elements).forEach(element => {
  element.addEventListener('input', () => {
    validateForm()
    checkFormIsFilled()
  } )
});

submitButton.addEventListener('click', handleFormSubmit);
form.addEventListener('reset', () => {
  changeButtonState(clearButton, false);
  if (resultBlock.classList.contains('block_result_visible')) {
  resultBlock.classList.remove('block_result_visible');
  }
});

/* Copy result */

const copyButton = document.querySelector('#copy-button');
const resultField = document.querySelector('#result');
const resultBlock = document.querySelector('.block_result');

function copy() {
  resultField.select();
  document.execCommand('copy');
}

copyButton.addEventListener('click', copy);

/* Custom select */

const select = new CustomSelect(productSelectData);
select.create();
select.addEventListener(productSelectData.eventName, validateForm);

/* Utils */

function trimFromSlash(string) {
  if (string.at(-1) === '/') {
    return string.slice(0, -1);
  }
  return string;
}

function getSlug(link) {
  return link.split('/').slice(-1);
}
