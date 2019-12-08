const dbCollection = firebase.firestore().collection('contact')

let currentRefid = ''

const formAddContact = document.getElementById('formAddContact')
const formConfirm = document.getElementById('formConfirm')
const ContactsList = document.getElementById('ContactsList')

const inputName = document.getElementById('name')
const inputEmail = document.getElementById('email')
const inputPhone = document.getElementById('phone')

const addBtn = document.getElementById('ContactFormSubmit')
const ContactFormHeader = document.getElementById('ContactFormHeader')

const contactList = document.getElementById('TableContacts')
const errorPanel = document.getElementById('inputNotifications')

const NavNew = document.getElementById('NavNew')
NavNew.addEventListener('click', AddNew)

const NavIndex = document.getElementById('NavIndex')
NavIndex.addEventListener('click', ShowContactList)


document.getElementById('btnEdit').addEventListener('click', editContact)

document.getElementById('btnDelete').addEventListener('click', deleteContact)

document.getElementById('btnConfirm').addEventListener('click', ShowContactList)

//document.getElementById('navIndex').addEventListener('clickAddNew',displayList)

const ENTER_KEY_CODE = 13

addBtn.addEventListener('click', addContact)

contactList.addEventListener('click', handleContactClick)

//console.log(formAddContact.style.display )

formAddContact.style.display = "none"
formConfirm.style.display = "none"


function ShowContactList(){
  ContactsList.style.display = "block"
  formAddContact.style.display = "none"
  formConfirm.style.display = "none"
  NavNew.classList.remove ('active')
  NavIndex.classList.add ('active')
}

function ShowNewContactForm(){
  ContactsList.style.display = "none"
  formAddContact.style.display = "block"
  formConfirm.style.display = "none"
  NavNew.classList.add ('active')
  NavIndex.classList.remove ('active')
}

function ShowConfirmContactForm(){
  ContactsList.style.display = "none"
  formAddContact.style.display = "none"
  formConfirm.style.display = "block"
  NavNew.classList.remove ('active')
  NavIndex.classList.remove ('active')
  }
  


dbCollection.orderBy('timestamp').onSnapshot(docs => {
  //   dbCollection.
 // dbCollection.orderBy('timest').limit(1)  //.orderBy("timestamp")
  contactList.innerHTML =
   // "<tr>   <th>#</th>    <th>Name</th>    <th>Email</th>    <th>Phone</thd>    <th> </thd>  </tr>"
   "<tr>    <th>Name</th>    <th>Email</th>    <th>Phone</thd>    <th> </thd>  </tr>"
  docs.forEach(doc => createItemFromData(doc))
})

function createItemFromData(doc) {
  const refid = doc.id
  const data = doc.data()

  const contactItem = contactList.insertRow(-1);

  contactItem.setAttribute('data-refid', refid)
  contactItem.setAttribute('class', 'acontact')

  //const cell0 = contactItem.insertCell(0);
  const cell0 = contactItem.insertCell(0);
  const cell1 = contactItem.insertCell(1);
  const cell2 = contactItem.insertCell(2);
  const cell3 = contactItem.insertCell(3);
  //cell0.innerHTML = '#';
  cell0.innerHTML = data.name;
  cell1.innerHTML = data.email;
  cell2.innerHTML = data.phone;

  //cell4.innerHTML = '<i class="fa fa-trash"></i>' ;
  let divbuttons = document.createElement('DIV')
  divbuttons.className = 'contact-actions'

  let span = document.createElement('SPAN')
  span.className = 'details'
  span.innerHTML = ('<i class="fa fa-search"></i>')
  divbuttons.appendChild(span)

  span = document.createElement('SPAN')
  span.className = 'edit'
  span.innerHTML = ('<i class="fa fa-pencil"></i>')
  divbuttons.appendChild(span)

  span = document.createElement('SPAN')
  span.className = 'delete'
  span.innerHTML = ('<i class="fa fa-trash"></i>')
  span.setAttribute('data-refid', refid)
  divbuttons.appendChild(span)

  cell3.appendChild(divbuttons);

}


function handleContactClick(event) {
  let target = event.target
  // console.log('element: ' + target.nodeName)
  // console.log(target)
  //console.log ('refid: '+target.parentElement.dataset.refid)

  if (target.nodeName == 'I') {
    target = target.parentElement;
  }
  const tableRow = target.closest('tr')
  currentRefid = (tableRow.dataset.refid)
  refid = currentRefid
  if (target.className === 'delete') {
    //console.log ('delete: '+target.parentElement.parentElement.dataset.refid)


    let r = confirm("Are you sure you want to delete the contact?");
    if (r == true) {
      removeItem(refid)
    }
  }
  else if (target.className === 'details') {
    ConfirmContact(refid)
  }
  else if (target.className === 'edit') {
    editContact(refid)
  }
}



function AddNew() {
  // console.log('addnew: ' )

  ShowNewContactForm()
  ContactFormHeader.innerHTML = 'New Contact'
  inputName.value = ''
  inputEmail.value = ''
  inputPhone.value = ''
  //addContact()
}


function addContact() {
  if (validateform() > '') { return }

  else {

    if (ContactFormHeader.innerHTML === 'Edit Contact') {
      updateContact(currentRefid)
      // return;
    }
    else {
      saveContact()
      inputName.value = ''
      inputEmail.value = ''
      inputPhone.value = ''

    }
  }
}

function validateform() {
  const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rePhone = /^\(?([2-9]{1}[0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  //console.log('emailtest:'+ re.test(String(inputEmail.value).toLowerCase()))
  let errors = ''

  //check name input
  if (inputName.value.trim() === '') {
    inputName.classList.add('is-invalid')
    errors = '<li>Name cannot be empty</li>';
  }
  else {
    inputName.classList.remove('is-invalid')
    inputName.classList.add('is-valid')
  }

  //check email  input
  if (inputEmail.value.trim() === '') {
    inputEmail.classList.add('is-invalid')
    errors = errors + '<li>Email cannot be empty</li>';
  }
  else if (reEmail.test(String(inputEmail.value.trim()).toLowerCase()) === false) {
    inputEmail.classList.add('is-invalid')
    errors = errors + '<li>Email is not valid</li>';
  }
  else {
    inputEmail.classList.remove('is-invalid')
    inputEmail.classList.add('is-valid')
  }
  //check phone input
  if (inputPhone.value.trim() === '') {
    inputPhone.classList.add('is-invalid')
    errors = errors + '<li>Phone cannot be empty</li>';
  }
  else if (rePhone.test(String(inputPhone.value.trim()).toLowerCase()) === false) {
    inputPhone.classList.add('is-invalid')
    errors = errors + '<li>Phone # is not valid (must be a 10 digit number that does not begin with 1 or 0)</li>';
  }
  else {
    inputPhone.classList.remove('is-invalid')
    inputPhone.classList.add('is-valid')
  }

  // console.log (errors)
  if (errors != '') {
    errorPanel.classList.add('alert')
    errorPanel.classList.add('alert-warning')
  }
  else {
    errorPanel.classList.remove('alert')
    errorPanel.classList.remove('alert-warning')
  }
  errorPanel.innerHTML = errors
  return errors;


}


function ConfirmContact(refid) {
  ShowConfirmContactForm()
  //console.log ('confirmcontact:'+refid)
  //const refid = listItem.dataset.refid
  
  //console.log('confirmcontact refid'+refid)
  const docRef = dbCollection.doc(refid)
  currentRefid = refid
  //ContactFormHeader.innerHTML = 'Edit Contact'
  // console.log('before docRef.get()')
 
  docRef.get()
    .then(doc => {
      document.getElementById('confirmName').innerHTML = doc.data().name
      document.getElementById('confirmEmail').innerHTML = doc.data().email
      document.getElementById('confirmPhone').innerHTML = doc.data().phone
    })

}




function saveContact() {
  let refid = ''
  dbCollection
    .add({
      name: inputName.value.trim(),
      email: inputEmail.value.trim(),
      phone: inputPhone.value.trim(),
      timestamp: Date.now(),
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
      refid = docRef.id 
     // console.log('before confirmcontact'+ refid)
      ConfirmContact(refid)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })




}


function editContact(refid) {
  
  //const data = listItem.data()

  //console.log('refod='+refid)
  //const refid = listItem.dataset.refid
  //if ( refid == '')
  { refid = currentRefid }
  const docRef = dbCollection.doc(refid)

  //currentRefid = refid
  ContactFormHeader.innerHTML = 'Edit Contact'
  ShowNewContactForm()

  //https://softauthor.com/firestore-querying-filtering-data-for-web/#get-a-document-from-firestore

  docRef.get()
    .then(doc => {
      inputName.value = doc.data().name
      inputEmail.value = doc.data().email
      inputPhone.value = doc.data().phone
    })

}

function updateContact(refid) {
  //console.log(currentRefid)
  //const refid = listItem.dataset.refid
  const docRef = dbCollection.doc(refid)


  docRef.update({
    name: inputName.value.trim(),
    email: inputEmail.value.trim(),
    phone: inputPhone.value.trim(),
    //timestamp: Date.now(),
  })
    .then(function (docRef) {
      console.log('Document ID Updated: ', refid)

    })
    .catch(function (error) {
      console.error('Error updateing document: ', error)
    })
  ConfirmContact(refid)
}

function deleteContact (){

  let r = confirm("Are you sure you want to delete the contact?");
  if (r == true) {
    removeItem(currentRefid)
  } else {
    
  }


  
  ShowContactList()
}

function removeItem(refid) {
  // const refid = listItem.dataset.refid
  const docRef = dbCollection.doc(refid)
  //console.log ('Delete!')
  docRef.delete()
}


