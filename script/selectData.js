const productSelectData = {
  wrapperSelector: '#select-wrapper',
  name: 'special-product',
  id: 'special-product',
  classNames: [''],
  placeholder: 'Например, Компас',
  placeholderColor: '#CCCCCC',
  mainColor: '#3D3D3D',
  eventName: 'setCustomSelectValue',
  options: [
    {
      name: 'Компас',
      value: 'compass'
    },
    {
      name: 'Компас 1',
      value: 'compass1'
    },
    {
      name: 'Компас 2',
      value: 'compass2'
    },
  ]
}

const categorySelectData = {
  wrapperSelector: '#select-wrapper-category',
  name: 'category',
  id: 'category',
  classNames: [''],
  placeholder: 'Например, Личный опыт',
  placeholderColor: '#CCCCCC',
  mainColor: '#3D3D3D',
  eventName: 'setCustomSelectValue',
  options: [],
  isRequired: true,
}
