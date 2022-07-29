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
  // clear current cards
  document.getElementById('servers-card-list').innerHTML = "";

  // do loop for each server item
  serversDatalist.forEach(createCardElement)
}


function createCardElement(datarow)
{
  let str;
  str = '<div class="bg-gray-100 rounded-lg p-2 lg:p-4 lg:pb-2 border-2 border-transparent hover:border-sky-300 transition">';
  {
    str += '<div class="server-model font-light truncate">' + datarow.model + '</div>';
    {
      str += '<div class="server-ram flex">';
      str += '<span class="grow">' +  datarow.ramCapacity + ' GB</span>';
      str += '<span class="text-gray-500">GDDR' +  datarow.ramGen + '</span>';
    }
    str += '</div>';
    str += '<div class="server-hdd flex text-gray-800">';
    {
      str += '<span class="grow">' + datarow.hddCount + 'x' + datarow.hddEachCapacity + '</span>';
      str += '<span class="text-gray-500">' + datarow.hddType + '</span>';
    }
    str += '</div>';
    str += '<div class="server-location flex text-gray-800">';
    {
      str += '<span class="grow">' + datarow.locationCity + '</span>';
      str += '<span class="text-gray-500">' + datarow.locationZone + '</span>';
    }
    str += '</div>';
    str += '<div class="server-price font-light text-xl text-blue-400">';
    {
      str += '<span>' + datarow.priceCurrency + '</span>';
      str += '<span>' + datarow.priceAmount + '</span>';
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

  console.log(queryString);

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
  // controlFormDisabled(true);

  activeAjaxDelayTime = setTimeout(() => {
    activeAjax = new XMLHttpRequest();
    activeAjax.open("GET", "http://localhost/api/pricing?"+ createApiQueryString(), true);
    activeAjax.onreadystatechange = function () {
      if (activeAjax.readyState != 4 || activeAjax.status != 200) {
        //error - show something
        return;
      };
      // data is here
      let jsonResult = JSON.parse(activeAjax.responseText);

      fillCards(jsonResult);

      // enable form elements
      // controlFormDisabled(false);
    };
    activeAjax.send();
  }, 200);
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

// fill initial data
getDataFromServer();
