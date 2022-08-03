/**
 *
 *
 */

// on change everything on form, call get server data
const elFormServerFilters = document.getElementById('server-filters');
elFormServerFilters.addEventListener('change', function()
{
  getDataFromServer();
});


function fillCards(serversDatalist)
{
  // fill total row detected from server
  if(document.getElementById('total-row'))
  {
    document.getElementById('total-row').innerHTML = 'Total row <span class="font-light">' + serversDatalist.length + '</span>';
  }

  // if data is not exist show no result mode
  if(!serversDatalist)
  {
    noResultState();
    return;
  }
  // if api reseponse of filter array is empty, show no result mode
  if(serversDatalist.length === 0)
  {
    noResultState();
    return;
  }

  // clear current cards
  document.getElementById('servers-card-list').innerHTML = "";

  // do loop for each server item
  serversDatalist.forEach(createCardElement)
}


function createCardElement(datarow)
{
  let str;
  str = '<a href="#server-' + datarow.id +'" class="block bg-gray-100 rounded-lg p-2 lg:p-4 lg:pb-2 border-2 border-transparent hover:border-sky-300 focus:border-sky-400 active:border-sky-600 transition">';
  {
    str += '<div class="server-model font-light truncate">' + datarow.model + '</div>';
    {
      str += '<div class="server-ram flex">';
      str += '<span class="grow">Ram ' +  datarow.ram + ' GB</span>';
      str += '<span class="text-gray-600">' +  datarow.ramtype + '</span>';
    }
    str += '</div>';
    str += '<div class="server-hdd flex text-gray-800">';
    {
      str += '<span class="grow">Storage ' + datarow.storage + ' </span>';
      str += '<span class="text-gray-600">' + datarow.storagetxt + '</span>';
    }
    str += '</div>';
    str += '<div class="server-location flex text-gray-800">';
    {
      str += '<span class="grow">' + datarow.city + '</span>';
      str += '<span class="text-gray-600">' + datarow.location + '</span>';
    }
    str += '</div>';
    str += '<div class="server-price font-light text-xl leading-7 text-blue-600">';
    {
      str += '<span>' + datarow.currency + '</span> ';
      str += '<span>' + datarow.price.toString().replace('.00', '') + '</span>';
    }
    str += '</div>';
  }
  str += '</div>';

  // create temp element
  let temp = document.createElement('div');
  temp.innerHTML = str;
  // append element to page
  document.getElementById('servers-card-list').appendChild(temp);
}


function noResultState()
{
  // clear current cards
  document.getElementById('servers-card-list').innerHTML = "";
  // remove loading mode
  loadingDataState(false);

  let str;

  str = '<div class="max-w-md mx-auto text-center">';
  {
    str += '<img src="./img/empty-filter.jpg" alt="Empty state" class="w-full aspect-square">';
    str += '<h2 class="font-light text-xl leading-10 text-gray-600 mb-2">No results found</h2>';
    str += '<p class="text-gray-600 leading-relaxed">Try adjusting your search or filter to find what you are looking for.</p>';
    str += '<p class="text-gray-600 leading-relaxed">Not sure where to start? <a href="/" class="text-blue-800 hover:opacity-80 focus:opacity-60 transition">Reset filters</a></p>';
  }
  str += '</div>';

  // create temp element
  let temp = document.createElement('div');
  temp.className = 'col-span-3';
  temp.innerHTML = str;
  // append element to page
  document.getElementById('servers-card-list').appendChild(temp);
}


function loadingDataState(newStatus)
{
  var loadingEl = document.getElementById('loadingDataState');
  if(newStatus !== true)
  {
    if(loadingEl)
    {
      loadingEl.remove();
    }

    return;
  }

  // if loading exist before, remove it
  if(loadingEl)
  {
    loadingEl.remove();
  }

  let str;

  str = '<div class="flex mx-auto w-60 mt-16 items-center px-4 py-2 font-light leading-6 text-sm shadow rounded-md text-white bg-emerald-500 hover:bg-emerald-400 transition ease-in-out duration-150 cursor-wait">';
  {
    str += '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    str += '<span>Processing...</span>';
  }
  str += '</div>';

  // create temp element
  let temp = document.createElement('div');
  temp.className = 'absolute inset-0 bg-gray-100/70';
  temp.id = 'loadingDataState';
  temp.innerHTML = str;
  // append element to page
  document.getElementById('servers-card-container').appendChild(temp);
}


function serializeToObj (data)
{
  let obj = {};
  for (let [key, value] of data) {
    if (obj[key] !== undefined) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}


function createApiQueryString()
{
  // Get all field data from the form
  let formData = new FormData(elFormServerFilters);

  // Convert to a query string
  let queryString = new URLSearchParams(formData).toString();

  // console.log(queryString);

  // Convert to an object
  // let formObj = serializeToObj(formData);
  // console.log(formObj);

  // console.log(JSON.stringify(formObj));
  return queryString;
}

// only one ajax at one time
var activeAjax;
// cancel old changes util submit new ones
var activeAjaxDelayTime;
function getDataFromServer()
{
  // if we have active ajax, cancel it
  if(activeAjax !== undefined)
  {
    activeAjax.abort();
  }

  // clear old timer request
  clearTimeout( activeAjaxDelayTime );

  // disable form elements
  loadingDataState(true);

  activeAjaxDelayTime = setTimeout(() => {
    activeAjax = new XMLHttpRequest();
    activeAjax.open("GET", "/api/pricing?"+ createApiQueryString(), true);
    activeAjax.onreadystatechange = function () {
      if (activeAjax.readyState != 4 || activeAjax.status != 200) {
        //error - show something
        return;
      };
      // data is here
      try{
        //convert json
        let jsonResult = JSON.parse(activeAjax.responseText);
        // fill cards based on json data
        fillCards(jsonResult);
      }catch(e){
        console.error('Error on json response from API!');
      }

      // enable form elements
      loadingDataState(false);
    };
    activeAjax.send();
  }, 200);
}


// only one ajax at one time
var activeFilterAjax;
function getFiltersFromServer()
{
  // if we have active ajax, cancel it
  if(activeFilterAjax !== undefined)
  {
    activeFilterAjax.abort();
  }

  // disable form elements
  // loadingFilterState(true);
  var currentUrlParams = window.location.search.substr(1);

  activeFilterAjax = new XMLHttpRequest();
  activeFilterAjax.open("GET", "/api/filters?"+ currentUrlParams, true);
  activeFilterAjax.onreadystatechange = function () {
    if (activeFilterAjax.readyState != 4 || activeFilterAjax.status != 200) {
      //error - show something
      return;
    };
    // data is here

    try{
      //convert json
      let jsonResult = JSON.parse(activeFilterAjax.responseText);
      // fill cards based on json data
      fillFiltersOpt(jsonResult);
    }catch(e){
      console.error('Error on filters json response from API!');
    }

    // enable form elements
    // loadingFilterState(false);
  };
  activeFilterAjax.send();
}


function createFilterDropdown(myFilters)
{
  let el;
  el = '<label class="block">';
  {
    el += '<h2 class="font-light">' + myFilters.title +'</h2>';
    el += '<select class="form-select block w-full cursor-pointer mt-1" id="' + myFilters.name + '" name="' + myFilters.name + '">';
    {
      Object.keys(myFilters.data).forEach(function(key) {
        let keyVal = myFilters.data[key];
        // set value if not exist
        if(keyVal.value === undefined){
          keyVal.value = keyVal.title;
        }

        // el += '<option value="' + val + '">' + val + ' (' + myFilters.data[val] + ')</option>';
        el += '<option value="' + keyVal.value + '">' + keyVal.title + '</option>';
      });
    }
    el += '</select>';
  }
  el += '</label>';

  return el;
}


function createFilterRadio(myFilters)
{
  let el;
  el = '<h2 class="font-light mb-1">' + myFilters.title +'</h2>';

  Object.keys(myFilters.data).forEach(function(key) {
    let keyVal = myFilters.data[key];
    // set value if not exist
    if(keyVal.value === undefined){
      keyVal.value = keyVal.title;
    }

    el += '<label class="flex items-center cursor-pointer" title="' + keyVal.count + '">';
    {
      el += '<input type="radio" class="form-radio" name="' + myFilters.name + '" value="' + keyVal.value + '"';
      if(keyVal.checked){
        el += ' checked';
      }
      el += '>';
      el += '<span class="ml-2">' + keyVal.title + '</span>';
      // el += '<span class="ml-2">' + keyVal.title + ' (' + keyVal.count + ')</span>';
    }
    el += '</label>';
  });

  return el;
}


function createFilterCheckbox(myFilters)
{
  let el;
  el = '<h2 class="font-light mb-1">' + myFilters.title +'</h2>';

  Object.keys(myFilters.data).forEach(function(key) {
    let keyVal = myFilters.data[key];
    // set value if not exist
    if(keyVal.value === undefined){
      keyVal.value = keyVal.title;
    }

    el += '<label class="flex items-center cursor-pointer" title="' + keyVal.count + '">';
    {
      el += '<input type="checkbox" class="form-checkbox" name="' + myFilters.name + '[]" value="' + keyVal.value + '"';
      if(keyVal.checked){
        el += ' checked';
      }
      el += '>';
      el += '<span class="ml-2" >' + keyVal.title + '</span>';
      // el += '<span class="ml-2">' + keyVal.title + ' (' + keyVal.count + ')</span>';
    }
    el += '</label>';
  });

  return el;
}


function createFilterRange(myFilters)
{
  let el;
  el = '<label class="block">'
  {
    el = '<h2 class="font-light mb-1">' + myFilters.title +'</h2>';
    el += '<div class="my-2 pt-10 pb-10 px-2">';
    {
      el += '<div id="' + myFilters.name + '" class="range-slider"></div>';
    }
    el += '</div>';

    el += '<input type="hidden" name="' + myFilters.name + '-min" value="" id="' + myFilters.name + '-min" class="block p-1 mt-2 w-full" />';
    el += '<input type="hidden" name="' + myFilters.name + '-max" value="" id="' + myFilters.name + '-max" class="block p-1 mt-2 w-full" />';
  }
  el += '</label>';
  return el;
}


function filterRangeApplyVal(myFilters)
{
  let myRangeSlider = document.getElementById(myFilters.name);
  // myRangeSlider.noUiSlider.set(['4GB']);

  // destroy current range if exist
  if(myRangeSlider && myRangeSlider.noUiSlider){
    myRangeSlider.noUiSlider.destroy();
  }

  // create new range with filter data
  createMyRangeSlider( myFilters.name, myFilters.range);
}


function fillFiltersOpt(filtersDatalist)
{
  // if data is not exist do nothing
  if(!filtersDatalist)
  {
    return;
  }

  // if api reseponse of filter array is empty, do nothing
  if(filtersDatalist.length === 0)
  {
    return;
  }

  // for each filter
  filtersDatalist.forEach(element => {
    $elStr = '';

    // if require data is not exist, don't create element
    if(element.title && element.name && element.data && element.data.length) {
      switch(element.type) {
        case 'dropdown':
          $elStr = createFilterDropdown(element);
          break;

        case 'radio':
          $elStr = createFilterRadio(element);
          break;

        case 'checkbox':
          $elStr = createFilterCheckbox(element);
          break;

          case 'range':
            $elStr = createFilterRange(element);
            break;

        default:
          // do nothing
          break;
      }

      if($elStr)
      {
        // create temp element
        let temp = document.createElement('div');
        temp.className = 'block my-1 lg:my-2';
        temp.innerHTML = $elStr;
        // append element to page
        document.getElementById('server-filters').appendChild(temp);
      }

      if(element.type === 'range')
      {
        // apply range options
        filterRangeApplyVal(element);
      }
    }
  });

  // add total row line
    let totalRowEl = document.createElement('div');
    totalRowEl.className = 'block mt-4 text-sky-700';
    totalRowEl.id = 'total-row';
    // totalRowEl.innerHTML = 'Total row';
    // append element to page
    document.getElementById('server-filters').appendChild(totalRowEl);
}


function controlFormDisabled(newStatus)
{
  if(newStatus === undefined) {
    newStatus = false;
  }

  let elements = elFormServerFilters.elements;
  for (var i = 0, len = elements.length; i < len; ++i) {
    elements[i].disabled = newStatus;
  }

  // enable and disable range slider
  let rangeSliders = document.querySelectorAll('.range-slider');
  if(newStatus === true)
  {
    rangeSliders[0].setAttribute('disabled', true);
    rangeSliders[1].setAttribute('disabled', true);
  }
  else{
    rangeSliders[0].removeAttribute('disabled');
    rangeSliders[1].removeAttribute('disabled');
  }
}

// fill initial filters
getFiltersFromServer();

// fill initial data
getDataFromServer();
