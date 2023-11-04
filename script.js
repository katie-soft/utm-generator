const form = document.querySelector("#form");
const submitButton = form.querySelector("#submit-button");
const copyButton = document.querySelector("#copy-button");
const resultField = document.querySelector("#result");

function handleFormSubmit(event) {
  event.preventDefault();
  let result = "";

  const data = {};

  Array.from(form.elements).forEach((element) => {
    const { name, value } = element;
    data[name] = value.trim();
  })

  data['utm-type'] = form.querySelector("input[type=radio]:checked").value;

  if (data.link.at(-1) === '/') {
    data.link = data.link.slice(0, -1);
  }

  const regex = /\-/gm;
  data['article-url'] = data['article-url'].replace(regex, "_");

  result = `${data.link}/?internal_source=tsecrets-${data['article-url']}-${data['utm-type']}-${data.product}`;

  resultField.value = result; 
  }

function copy() {
  resultField.select();
  document.execCommand("copy");
}

submitButton.addEventListener('click', handleFormSubmit);
copyButton.addEventListener('click', copy);

const customSelect = form.querySelector(".custom-select");
customSelect.addEventListener('click', () => {
  customSelect.classList.toggle("custom-select_opened");
})
