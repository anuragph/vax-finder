
let myForm = document.getElementById('my-form');

myForm.addEventListener('submit', formSubmit);




// *** Function Declarations ***

// Form submission
function formSubmit(e) {
  e.preventDefault();
  
  let rawDate = myForm['date'].value;
  
  let pin = myForm['pin'].value;
  let date =  dateFormat(rawDate);

  if(pin != '') {
    getCenters(pin, date)
      .then(showCenters)
      .catch(err => console.log('rejected:', err.message));
  }
}

// Convert date(yyyy-mm-dd) to dd-mm-yyyy
function dateFormat(date) {
  let dateFormatted = date.toString().split('-').reverse().join('-');
  return dateFormatted;
}

// CoWIN API call
async function getCenters(pin, date) {

  const response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`);

  if(response.status !== 200) {
    throw new Error('Cannot reach resource');
  }

  const data = await response.json();
  return data;
}

// Push CoWIN API data to DOM
function showCenters(data) {
  let centerList = document.getElementById('center-list');
  centerList.innerHTML = '';
  
  if(data.sessions.length > 0) {
    for(center of data.sessions) {
      let node = document.createElement('LI');
      let textnode = document.createTextNode(center.name);
      node.appendChild(textnode);
      centerList.appendChild(node);
    }
  } else {
    centerList.innerHTML = 'No centers available';
  }
}