/* Handle form */

const form = document.querySelector("#form");
const submitButton = form.querySelector("#submit-button");
const requiredElements = form.querySelectorAll("[required]");

function changeButtonState(button, isFormValid) {
  if (isFormValid) {
    button.classList = "button";
    button.addEventListener('click', handleFormSubmit);
  } else {
    button.classList = "button button_inactive";
    button.removeEventListener('click', handleFormSubmit);
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
  
  changeButtonState(submitButton, isFormValid);
}

requiredElements.forEach(element => {
  element.addEventListener('input', validateForm);
})

function handleFormSubmit(event) {
  event.preventDefault();
  let result = "";

  const data = {};

  Array.from(form.elements).forEach((element) => {
    const { name, value } = element;
    data[name] = value.trim();
  })

  if (data.link.at(-1) === '/') {
    data.link = data.link.slice(0, -1);
  }

  const regex = /\-/gm;
  data['article-url'] = data['article-url'].replace(regex, "_");

  data['utm-type'] = form.querySelector("input[type=radio]:checked").value;

  data.product = data.link.split("/").slice(-1);

  result = `${data.link}/?internal_source=tsecrets-${data['article-url']}-${data['utm-type']}-${data.product}`;

  resultField.value = result; 
  }

/* Copy result */

const copyButton = document.querySelector("#copy-button");
const resultField = document.querySelector("#result");

function copy() {
  resultField.select();
  document.execCommand("copy");
}

copyButton.addEventListener('click', copy);

/* Custom select */

const customSelect = form.querySelector(".custom-select");
customSelect.addEventListener('click', () => {
  customSelect.classList.toggle("custom-select_opened");
})
