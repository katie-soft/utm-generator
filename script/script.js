/* Fetch data from API & create category select*/

let categorySelect;
const getCategoryList = async () => {
  try {
    const res = await fetch('https://secrets-old.tinkoff.ru/wp-json/custom/v2/categories');
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    return data;
  }
  catch (e) {
    console.error(e);
    return;
  }
}

getCategoryList().then(data => {
  if (data) {
    data.sort((a, b) => a.name.localeCompare(b.name)).forEach(category => {
      const newItem = {};
      newItem.name = category.name;
      newItem.value = category.slug;
      categorySelectData.options.push(newItem);
    })
  } else {
    categorySelectData.options = categories;
  }
  categorySelect = new CustomSelect(categorySelectData);
  categorySelect.create();
  categorySelect.addEventListener(categorySelectData.eventName, () => {
    validateForm();
    checkFormIsFilled()
  });
});

/* Handle form */

const form = document.querySelector('#form');
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

  const requiredElements = form.querySelectorAll('[required]');

  for (let i = 0; i < requiredElements.length; i++) {
    if (!requiredElements[i].value.length) {
      isFormValid = false;
      break;
    } else {
      isFormValid = true;
    }
  }

  changeButtonState(submitButton, isFormValid);
  return isFormValid;
}

function checkFormIsFilled() {
  const formElements = Array.from(form.elements);

  for (let i = 0; i < formElements.length; i++) {
    if (
      formElements[i].type === 'text' && formElements[i].value.length ||
      formElements[i].type === 'hidden' && formElements[i].value.length) {
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
      if (element.name) {
        data[element.name] = element.value.trim();
      }
    })

    data.link = trimFromSlash(data.link);

    if (trimFromSlash(data.slug).includes('/')) {
      data.slug = replaceHyphen(getSlug(trimFromSlash(data.slug)));
    } else {
      data.slug = replaceHyphen(trimFromSlash(data.slug));
    }

    data.category = replaceHyphen(data.category);

    data['utm-type'] = form.querySelector('input[type=radio]:checked').value;

    if (data.link.includes('www.tbank')) {
      data.product = replaceHyphen(getSlug(data.link));
    } else {
      data.product = replaceHyphen(getProductName(data.link));
    }    

    result = `${data.link}/?internal_source=tsecrets-${data.category}-${data.slug}-${data['utm-type']}-${data.product}`;

    resultField.value = result;
    resultBlock.classList.add('block_result_visible');
  }
}

Array.from(form.elements).forEach(element => {
  element.addEventListener('input', () => {
    validateForm();
    checkFormIsFilled();
  })
});

submitButton.addEventListener('click', handleFormSubmit);

form.addEventListener('reset', () => {
  changeButtonState(clearButton, false);
  changeButtonState(submitButton, false);
  categorySelect.reset();
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

/* Hint */

const hint = document.querySelector('#hint');
const hintHeader = hint.querySelector('.hint__header');
const hintButton = hint.querySelector('.hint__button');
const hintIcon = hintButton.querySelector('img');
const hintText = hint.querySelector('.hint__text');

hintHeader.addEventListener('click', toggleHint);

function toggleHint() {
  if (hint.classList.contains('hint_open')) {
    hintIcon.src='./img/question-icon.svg';
    hint.classList.remove('hint_open');
    return
  } else {
    hint.classList.add('hint_open');
    hintIcon.src='./img/close-icon.svg';
  }
}

/* Utils */

function trimFromSlash(string) {
  if (string.at(-1) === '/') {
    string = string.slice(0, -1);
  }
  if (string[0] === '/') {
    string = string.slice(1);
  }
  return string;
}

function getSlug(link) {
  return link.split('/').slice(-1).toString();
}

function getProductName(link) {
  let result = link.trim();
  if (result.includes('https://')) {
    result = result.slice(8);
  }
  return result.split('.')[0].toString();
}

function replaceHyphen(string) {
  const regex = /\-/gm;
  return string.replace(regex, '_');
}

