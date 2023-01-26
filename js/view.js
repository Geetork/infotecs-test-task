'using sctrict';


(() => {
  /**
    * Словарь, включающий пары значений (ключ из data):(значение заголовка в таблице).
  */
  const columnHeaders = {
    'firstName': 'Name',
    'lastName': 'Surname',
    'about': 'About',
    'eyeColor': 'Eye color',
  };


  /**
    * Создает DOM элемент с указанным набором аттрибутов.
    * @param {String} name - название элемента
    * @param {Object} attributes - объект, состоящий из аттрибутов создаваемого элемента
    * @returns {Element} element - созданный элемент
    */
  function createElement(name, attributes) {
    const element = document.createElement(name);
    for (let attr in attributes) {
      element.setAttribute(attr, attributes[attr]);
    };
    return element;
  };


  /**
    * Создает объект документа DocumentFragment.
    * Рекурсия обеспечивает создание элементов, данные о которых вложены.
    * @param {Array} elementsInside - массив объектов, включающий данные о элементах html, которые необходимо создать.
    * @returns {Element} set - созданный набор элементов.
    */
  const createElemensInsideElements = (elementsInside) => {
    let set = document.createDocumentFragment();
    for (let i = 0; i < elementsInside.length; i++) {
      let element = createElement(elementsInside[i]['name'], elementsInside[i]['attributes']);
      if (elementsInside[i]['elementsInside'])
        element.appendChild(createElemensInsideElements(elementsInside[i]['elementsInside']));
      if (elementsInside[i]['innerText']) element.innerText = elementsInside[i]['innerText'];
      set.appendChild(element);
    };
    return set;
  };


  /**
    * Создает контейнер для размещения в нем таблицы.
    * @return {Element} container - элемент, в котором будут размещены все остальные элементы
    */
  const container = (() => {
    let container = createElement('div', { class: 'container' });
    document.body.append(container);

    return container;
  })();


  /**
    * Закрашивает ячейку с цветом глаз.
    * @param {Object} td - элемент, содержащий цвет глаз.
    */
  const colorCell = (td) => {
    let color = '';
    switch (td.innerText) {
      case 'blue': {color = '#9CBED8'; break;};
      case 'brown': {color = '#C89A82'; break;};
      case 'green': {color = '#BDDD92'; break;};
      case 'red': {color = '#E7968E'; break;};
    };
    td.style.color = color;
    td.style.backgroundColor = color;
  };


  /**
    * Создает пустую таблицу с заголовками ['Name', 'Surname', 'About', 'Eye color'].
    * IIFE-функция.
    * @param {Object} columnHeaders - словарь соответствия ключей из data и значений заголовков в таблице.
    * @returns {Element} table - элемент (таблица)
    */
  const table = ((columnHeaders) => {
    let div = createElement('div', { class: 'table_container' });
    let table = createElement('table', { class: 'table' });
    let tr = createElement('tr', { class: 'show_hide' });
    table.appendChild(tr);
    let i = 0;
    for (key in columnHeaders) {
      tr.appendChild(createElemensInsideElements([{
        name: 'td', attributes: { id: `firstRow${++i}` },
        elementsInside: [{ name: 'i', attributes: { class: 'icon-minus' }}],
      }]));
    };

    tr = createElement('tr', { class: 'thead' });
    table.appendChild(tr);
    for (key in columnHeaders) {
      tr.appendChild(createElemensInsideElements([{
        name: 'td', innerText: columnHeaders[key],
      }]));
    };

    tr = createElement('tr', { class: 'arrows_row' });
    table.appendChild(tr);
    for (key in columnHeaders) {
      tr.appendChild(createElemensInsideElements([{
        name: 'td', attributes: { class: 'arrows unsorted' },
        elementsInside: [{ name: 'i', attributes: { class: 'icon-up-dir' }},
          { name: 'i', attributes: { class: 'icon-down-dir' }}],
      }]));
    };

    div.appendChild(table);
    container.appendChild(div);

    return table;
  })( columnHeaders );


  /**
    * Создает форму для редактирования данных в таблице.
    * Форма изначально скрыта, в списке классов имеет класс hidden.
    * IIFE-функция.
    * @returns {Element} form - элемент (форма)
    */
  const form = (() => {
    let formElements = [{
      name: 'div',
      attributes: { class: 'form hidden' },
      elementsInside: [{
          name: 'div',
          attributes: { class: 'form_header' },
          elementsInside: [{ name: 'h2', innerText: 'Change Data' }, {
            name: 'button',
            attributes: { id: 'close_button', class: 'form_icon form_button_transition' },
            elementsInside: [{ name: 'i', attributes: { class: 'icon-cancel' }}]
          },]
        }, {
          name: 'input',
          attributes: { id: 'firstName', type: 'text', class: 'form_item form_input_text', placeholder: 'Name' },
        }, {
          name: 'input',
          attributes: { id: 'lastName', type: 'text', class: 'form_item form_input_text', placeholder: 'Surname' },
        }, {
          name: 'textarea',
          attributes: { id: 'about', type: 'text', class: 'form_item form_textarea', placeholder: 'Write description here...' },
        }, {
          name: 'select',
          attributes: { id: 'eyeColor', class: 'form_item form_select' },
          elementsInside: [{ name: 'option', attributes: { value: 'blue', label: 'blue' },
          },
          { name: 'option', attributes: { value: 'brown', label: 'brown' },
          },
          { name: 'option', attributes: { value: 'green', label: 'green' },
          },
          { name: 'option', attributes: { value: 'red', label: 'red' },
          }]
        }, {
          name: 'button',
          attributes: {
            id: 'change_button', class: 'form_button form_button_transition', type: 'submit'
          },
          innerText: 'Save'
        },
      ]
    }];

    let form = createElemensInsideElements(formElements);
    container.appendChild(form);

    return document.querySelector('.form');
  })();


  /**
    * Создает объект документа DocumentFragment.
    * Заполняет объект моковыми данными из массива data.
    * @param {Array} data - массив с моковыми данными, которые необходимо добавить в таблицу
    * @returns {Element} - фрагмент документа
    */
  const dataSet = (data) => {
    const set = document.createDocumentFragment();
    for (let i = 0; i < data.length; i++) {
      const rowData = [data[i]['name']['firstName'],
                       data[i]['name']['lastName'],
                       data[i]['about'],
                       data[i]['eyeColor'],
                       data[i]['id']];
      let tr = createElement('tr', { class: 'tbody', id: data[i]['id'] });
      for (let i = 0; i < rowData.length - 1; i++) {
        let td = createElement('td');
        td.innerText = rowData[i];
        if (i === 2) td.classList.add('truncate');
        if (i === 3) colorCell(td);
        tr.appendChild(td);
      };
      set.append(tr);
    };
    return set;
  };


  /**
    * Добавляет объект dataSet к таблице.
    * Заполняет таблицу моковыми данными из массива data.
    * @param {Array} data - массив с моковыми данными, которые необходимо добавить в таблицу
    */
  const fillTable = (data) => {
    table.appendChild(dataSet(data));
  };


  /**
    * Добавляет пагинацию.
    * Обеспечивает отображение в таблице на каждой странице по 10 строк.
    * @param {Array} data - массив с моковыми данными, которые необходимо добавить в таблицу
    */
  const createPagination = (data) => {
    let pageNumber = Math.floor(data.length / 10);

    let button_box = createElement('div', { class: 'button_box' })
    for (let i = 0; i < pageNumber; i++) {
      let button = createElement('button', { id: i + 1 });
      button.innerText = i + 1;
      button_box.appendChild(button);
    };

    document.querySelector('.table_container').appendChild(button_box);
  };


  /**
    * Показывает и заполняет форму данными.
    * @param {Number} trID - индекс записи в таблице.
    */
  const fillForm = (trID) => {
    let row = [...document.getElementById(trID).querySelectorAll('td')];
    let formFields = [...document.querySelectorAll('.form_item')];

    for (let i = 0; i < formFields.length; i++) {
      formFields[i].value = row[i].innerHTML;
    };
    document.querySelector('.form').id = trID;
    document.querySelector('.form').classList.remove('hidden');
  };


  /**
    * Извлекает данные из формы.
    * @returns {Object} - объект, состоящий из данных формы.
  */
  const getFormData = () => {
    let formFields = [...document.querySelectorAll('.form_item')];
    let data = { 'id': document.querySelector('.form').id };
    let name = {};
    for (let i = 0; i < formFields.length; i++) {
      if (formFields[i].id === 'firstName' || formFields[i].id === 'lastName')
        name[formFields[i].id] = formFields[i].value;
      else data[formFields[i].id] = formFields[i].value;
    };
    data['name'] = name;
    return data;
  };


  /**
    * Обновляет данные в строке таблицы.
  */
  const fillRow = () => {
    let newData = getFormData();
    let set = dataSet([newData]);
    let tr = createElement('tr');
    tr.appendChild(set);
    document.getElementById(newData.id).innerHTML = tr.innerHTML;
  };


  /**
    * Скрывает форму редактирования, добавляет класс hidde.
    */
  const hideForm = () => {
    form.classList.add('hidden');
  };


  /**
    * Скрывает/показывает колонку.
    * Меняет иконку минуса на плюс.
    * @param {Number} id - индекс колонки в таблице.
    */
  const showHideColumn = (id) => {
    let columnNumber = id.split('').pop();
    let icon = document.querySelector(`#${id} i`);
    if (icon.classList.value === 'icon-minus') {
      document.querySelector(`#${id} i`).classList.replace('icon-minus', 'icon-plus');
      document.querySelectorAll(`tr td:nth-child(${columnNumber})`).forEach((td) => {
        td.classList.add('hide');
        if (id === 'firstRow3') td.classList.remove('truncate');
      });
    } else {
      document.querySelector(`#${id} i`).classList.replace('icon-plus', 'icon-minus');
      document.querySelectorAll(`tr td:nth-child(${columnNumber})`).forEach((td) => {
        td.classList.remove('hide');
        if (id === 'firstRow3' && td.innerText !== 'About' && td.id !== 'firstRow3')
          td.classList.add('truncate');
      });
    };
  };


  /**
    * Делаем функции глобальными.
    * Функции присвоены в качестве методов объекта window.
  */
  window.viewScript = { createPagination,
                        hideForm,
                        fillTable,
                        fillForm,
                        fillRow,
                        getFormData,
                        showHideColumn };
})();
