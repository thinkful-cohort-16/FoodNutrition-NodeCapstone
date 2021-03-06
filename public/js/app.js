/* global jQuery, handle, $, api */
'use strict';

const ITEMS_URL = '/v1/items';

const renderPage = function (store) {
  if (store.demo) {
    $('.view').css('background-color', 'gray');
    $('#' + store.view).css('background-color', 'white');
  } else {
    $('.view').hide();
    $('#' + store.view).show();
  }
};


// ===== RENDER FUNCTIONS =====
const renderResults = function (store) {
  const listItems = store.list.map((item) => {
    return `<tr id="${item.id}">
                <td>
                <a href="${item.id}" class="detail">${item.name}</a>
                </td> 
                <td>${item.totalCals}</td>
              </tr>`;
  });
  $('#result').empty().append(renderResultsTable()).find('thead').append(listItems);
};

const renderResultsTable = function() {
  const columns = 
    `<thead>
      <tr>
        <th>Item Name</th>
        <th>Total Calories <input type='button' id='sortCals' value='Sort'></th>
        </div>
    </thead>`;
  $('#result').append(columns);
};

const editTable = function(store) {
  const item = store.item;
  const table = `
 <form>
  <table class='tableDetailView' id='${item.id}'>
  <thead>
    <tr>
      <th><label for="name"> <input name='name' type='text' pattern="^(?![0-9]*$)[a-zA-Z0-9!#$%^&*()+=,.?_'’ ]+$" 
      title="All number entries not allowed." value='${item.name}'</label>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td id='servingSize'>
      <label for="servingsize">Serving Size</label></td>
      <td><input name='servingsize' type='number' step="0.01" min="0.05" value='${item.servingSize}'</td>
    </tr>
    <tr>
      <td id='fat'><label for="fat">Fat(g):</label></td> 
      <td><input name='fat' type='number' step="0.01" min="0" value='${item.fat}'</td>
    </tr>
     <tr>
      <td id='carbs'><label for="carbs">Carbs(g):</label></td>
      <td><input name='carbs' type='number' step="0.01" min="0" value='${item.carbs}'</td> 
      </tr>
      <tr>
        <td id='protein'><label for="protein">Protein(g):</label></td> 
        <td><input name='protein' type='number' step="0.01" min="0" value='${item.protein}'</td>
      </tr>
      <tr>
        <td id='cals'><label for="cals">
        Total Calories:</label></td>
        <td> ${item.totalCals}</td> 
      </tr>
    </tbody>
  </table>
    <button type="submit" name="edit-button">Submit Edit</button>
 </form>`;
  $('.nutritionEdit').empty().append(table);
};

const renderCreate = function (store) {  
  const el = $('#create');
  const item = store.item;
  const createTable = `            
    <div class='container'>
      <div>
        <label for="name">Name</label>
        <input name="name" placeholder="e.g. Granny Smith Apple" required="" type="text" 
        pattern="^(?![0-9]*$)[a-zA-Z0-9!#$%^&*()+=,.?_'’ ]+$" title="All number entries not allowed.">
      </div>
      <div>
        <label class="serv-size" for="servingSize">Serving Size</label>
        <input name="servingSize" step="0.01" min="0.05" type="text" required>
      </div>
      <div>
        <label for="fat">Fat (g)</label>
        <input name="fat" type='number' step="0.01" min="0" required>
      </div>
      <div>
        <label for="carbs">Carbs (g)</label>
        <input name="carbs" type='number' step="0.01" min="0" required>
      </div>
      <div>
        <label for="protein">Protein (g)</label>
        <input name="protein" type='number' step="0.01" min="0" required>
      </div>
    <button type="submit">Submit</button>
  </div> 
    `;
  $('#create').empty().append(createTable);
};

const renderDetail = function (store) {
  const item = store.item;

  const detailTable = 
    `<table class='tableDetailView'>
        <thead>
          <tr>
            <th><label for="name">${item.name}</label></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id='servingSize'><label for="servingsize">
            Serving Size</label></td>
            <td>${item.servingSize}</td>
          </tr>
          <tr>
            <td id='fat'><label for="fat">Fat(g):</label></td> 
            <td>${item.fat}</td>
          </tr>
           <tr>
            <td id='carbs'><label for="carbs">Carbs(g):</label></td>
            <td>${item.carbs}</td> 
            </tr>
            <tr>
              <td id='protein'><label for="protein">Protein(g):</label></td> 
              <td>${item.protein}</td>
            </tr>
            <tr>
              <td id='cals'><label for="cals">
              Total Calories:</label></td>
              <td> ${item.totalCals}</td> 
            </tr>
          </tbody>
    </table>`;
  $('.nutritionTable').empty().append(detailTable);
};

// ===== HANDLERS =====
const handleSort = function(event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const items = store.list;

  if (store.sortingToggle === true) {
    let query = {
      sort: 'asc'
    };
    api.search(query)
      .then(response => {
        store.list = response;
        renderResults(store);
        // store.view = 'search';        
        store.sortingToggle = false;
        renderPage(store);
      });
  } else {
    let query = {
      sort:'desc'
    };
    api.search(query)
      .then(response => {
        store.list = response;
        renderResults(store);
        store.view = 'search';
        store.sortingToggle = true;
        renderPage(store);
      }).catch(err => {
        console.error(err);
      });
  }
};


const handleSearch = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  var query;
  store.sortingToggle = null;

  api.search(query)
    .then(response => {
      store.list = response;
      renderResults(store);
      store.view = 'search';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleCreate = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const document = {
    name: el.find('[name=name]').val(), //name is name of input
    servingSize: el.find('[name=servingSize]').val(),
    fat: el.find('[name=fat]').val(),
    carbs: el.find('[name=carbs]').val(),
    protein: el.find('[name=protein]').val()    
  };
  api.create(document)
    .then(response => {
      store.item = response;
      store.list = null; //invalidate cached list results
      renderDetail(store);
      store.view = 'detail';
      renderPage(store);
    })
    .catch(err => {
      console.error(err);
    });
};

const handleUpdate = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const document = {
    id: store.item.id,
    name: el.find('input[name=name]').val(),
    servingSize: el.find('input[name=servingsize]').val(),
    fat: el.find('input[name=fat]').val(),
    carbs: el.find('input[name=carbs]').val(),
    protein: el.find('input[name=protein]').val()
  };
  api.update(document, store.token)
    .then(response => {
      store.item = response;
      store.list = null; 
      renderDetail(store);
      store.view = 'detail';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleDetails = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const id = el.closest('tr').attr('id');
  api.details(id)
    .then(response => {
      store.item = response;
      renderDetail(store);
      store.view = 'detail';
      renderPage(store);
    }).catch(err => {
      store.error = err;
    });
};

const handleRemove = function (event) {
  event.preventDefault();
  const store = event.data;
  const id = store.item.id;
  api.remove(id, store.token)
    .then(() => {
      store.list = null; //invalidate cached list results
      return handleSearch(event);
    }).catch(err => {
      console.error(err);
    });
};

const handleViewAbout = function(event) {
  event.preventDefault();
  console.log(event.data);
  const store = event.data;
  store.view = 'about';
  renderPage(store);
};

const handleViewCreate = function (event) {
  event.preventDefault();
  const store = event.data;
  renderCreate(store);
  store.view = 'create';
  renderPage(store);
};

const handleViewList = function (event) {
  event.preventDefault();
  const store = event.data;
  if (!store.list) {
    handleSearch(event);
    return;
  }
  store.view = 'search';
  renderPage(store);
};

const handleViewEdit = function (event) {
  event.preventDefault();
  const store = event.data;
  editTable(store);
  store.view = 'edit';
  renderPage(store);
};


//on document ready bind events
jQuery(function ($) {

  const STORE = {
    demo: false,        // display in demo mode true | false
    view: 'list',       // current view: list | details | create | edit 
    query: {},          // search query values
    list: null,         // search result - array of objects (documents)
    item: null,         // currently selected document
    sortingToggle: false
  };

  $('#create').on('submit', STORE, handleCreate);
  $('#search').on('submit', STORE, handleSearch);
  $('#edit').on('submit', STORE, handleUpdate);
  $('#result').first('input').on('click', '#sortCals', STORE, handleSort);

  $('#result').on('click', '.detail', STORE, handleDetails);
  $('#detail').on('click', '.remove', STORE, handleRemove);
  $('#detail').on('click', '.edit', STORE, handleViewEdit);

  $(document).on('click', '.viewCreate', STORE, handleViewCreate);
  $(document).on('click', '.viewAbout', STORE, handleViewAbout);
  $(document).on('click', '.viewList', STORE, handleViewList);
  //$(document).on('submit', '#edit-button',  STORE, handleUpdate);
  // start app by triggering a search
  $('#search').trigger('submit');

});
