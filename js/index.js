'use strict';

(() => {
  /**
    * Добавление параметра page для получения содержимого конкретной страницы.
    */
  const params = new URLSearchParams(window.location.search);
  const pageNumber = params.get('page') || 1;
  /**
    * Получение данных страницы.
    */
  let paginatedPages = data.slice((pageNumber - 1) * 10, ((pageNumber - 1) * 10) + 10);

  /**
    * Заполняет страницу данными.
    */
  window.viewScript.fillTable(paginatedPages);
  window.viewScript.createPagination(data);


  /**
    * Сравнивает две ячейки одного столбца между собой.
    * @param {Element} trA - строка, ячейка которой применяется в сравнении.
    * @param {Element} trB - строка, ячейка которой применяется в сравнении.
    * @param {Number} index - строка, ячейка которой применяется в сравнении.
    * @param {String} direction - направление сортировки asend/descend.
    * @returns {Number} - результат сравнения ячеек строк одного столбца.
    */
  const compareRows = (trA, trB, index, direction) => {
    const tdA = trA.querySelectorAll('td')[index].innerHTML;
    const tdB = trB.querySelectorAll('td')[index].innerHTML;
    switch (true) {
      case tdA > tdB: {
        if (direction === 'ascend') return 1
          else return -1;
      };
      case tdA < tdB: {
        if (direction === 'ascend') return -1
          else return 1;
      };
      case tdA === tdB: return 0;
    };
  };


  /**
    * Меняет отображение стрелок взависимости от направления сортировки.
    * @param {String} direction - направление сортировки asend/descend.
    * @param {Element} td - ячейка, в которой меняется отображение стрелок.
    * @returns {String} - строка, состоящая из классов ячейки.
    */
  const changeArrows = (direction, td) => {
    switch (direction) {
      case 'ascend': {
        document.querySelectorAll('.arrows_row td').forEach((td) => {
          td.classList.remove('ascend', 'descend');
          td.classList.add('unsorted');
        });
        td.classList.add('ascend');
        td.classList.remove('unsorted');
        return td.classList.value
      };
      case 'descend': {
        td.classList.add('descend');
        td.classList.remove('unsorted', 'ascend');
        return td.classList.value
      };
    };
  };


  /**
    * Сортирует таблицу по значениям в конкретном столбце.
    * @param {Element} header - элемент заголовка, по которому происходит сортировка.
    * @param {Number} index - индекс элемента, по которому происходит сортировка.
    */
  const sortColumn = (header, index) => {
    const tableBody = document.querySelector('table');
    const rows = document.querySelectorAll('.tbody');
    const newRows = [...rows];
    const classList = header.classList;

    if (classList.contains('unsorted') || classList.contains('descend')) {
      header.classList.value = changeArrows('ascend', header);
      newRows.sort((trA, trB) => compareRows(trA, trB, index, 'ascend'));
    } else {
      header.classList.value = changeArrows('descend', header);
      newRows.sort((trA, trB) => compareRows(trA, trB, index, 'descend'));
    };

    rows.forEach((row) => {
      tableBody.removeChild(row);
    });
    newRows.forEach((newRow) => {
      tableBody.appendChild(newRow);
    });
  };


  /**
    * Привязывает click событие к каждому заголовку.
    * При нажадии на заголовок происходит сортировка таблицы.
    */
  document.querySelectorAll('.arrows_row td').forEach((header, index) => {
    header.addEventListener('click', function() {
      sortColumn(header, index);
    });
  });


  /**
    * Привязывает click событие к каждой записи в таблице.
    * При нажадии на запись появляется форма для изменения данных.
    */
  document.querySelectorAll('.tbody').forEach((row) => {
      row.addEventListener('click', function() {
          let hidden = row.getElementsByClassName('hide');
          if (hidden.length === 0)
            window.viewScript.fillForm(row.id);
      });
  });


  /**
    * Привязывает click событие к кнопке закрытия формы.
    * При нажадии на кнопку форма скрывается.
    */
  document.getElementById('close_button')
    .addEventListener('click', function() {
      window.viewScript.hideForm();
    });


  /**
    * Привязывает click событие к кнопке chnage формы.
    * При нажадии на кнопку происходит изменение данных в таблице и закрытие формы.
    */
  document.getElementById('change_button')
    .addEventListener('click', function() {
      window.viewScript.hideForm();
      window.viewScript.fillRow(window.viewScript.getFormData());
      alert('The changes have been saved!');
    });


  /**
    * Привязывает click событие к кнопкам для выбора страницы.
    * При нажадии на кнопку выводятся данные таблицы, соответствующие определенной странице.
    * Для того чтобы не привязывать обработчик события к каждой кнопке, используется делегирование.
    */
  document.querySelector('.button_box')
    .addEventListener('click', (event) => {
      if (event.target.id) {
        location.href = `${location.pathname}?page=${event.target.id}`;
      };
    });


  /**
    * Привязывает click событие к кнопкам для показа/сокрытия колонки.
    * Для того чтобы не привязывать обработчик события к каждой кнопке, используется делегирование.
    */
  document.querySelector('.show_hide')
    .addEventListener('click', (event) => {
      if (event.target.id) {
        window.viewScript.showHideColumn(event.target.id);
      };
    });
})();
