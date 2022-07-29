

function fillCards(serversDatalist)
{
  // clear current cards
  document.getElementById('servers-card-list').innerHTML = "";

  // do loop for each server item
  serversDatalist.forEach(createCardElement)
}

function createCardElement(datarow)
{
  console.log(datarow);
  // var string;
  string = '<div class="bg-gray-100 rounded-lg p-2 lg:p-4 border-2 border-transparent hover:border-sky-300 transition">';
  {
    string += '<div class="server-model font-light">' + datarow.model + '</div>';
    {
      string += '<div class="server-ram flex">';
      string += '<span class="grow">16G</span>';
      string += '<span class="text-gray-500">GDDR3</span>';
    }
    string += '</div>';
    string += '<div class="server-hdd flex text-gray-800">';
    {
      string += '<span class="grow">2x2TB</span>';
      string += '<span class="text-gray-500">SATA2</span>';
    }
    string += '</div>';
    string += '<div class="server-location flex text-gray-800">';
    {
      string += '<span class="grow">Amsterdam</span>';
      string += '<span class="text-gray-500">AMS-01</span>';
    }
    string += '</div>';
    string += '<div class="server-price font-light text-xl text-blue-400">';
    {
      string += '<span>$</span>';
      string += '<span>49.99</span>';
    }
    string += '</div>';
  }
  string += '</div>';


  var temp = document.createElement('div');
  temp.innerHTML = string;

  document.getElementById('servers-card-list').appendChild(temp);

  return string;
}


function createApiQueryString()
{
  var queryString = 'hdd=sas';

  return queryString;
}


function getDataFromServer()
{
  var r = new XMLHttpRequest();
  r.open("GET", "http://localhost/api/pricing?"+ createApiQueryString(), true);
  r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) {
      //error - show something
      return;
    };
    // data is here
    var jsonResult = JSON.parse(r.responseText);

    fillCards(jsonResult);
  };
  r.send();
}


// fill initial data
getDataFromServer();
