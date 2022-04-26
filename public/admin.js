// async function main()
const main = async () => {

   let response = await fetch('http://localhost:3001/listBooks');
   let books = await response.json();
   books.forEach(renderTitles);
}

function renderTitles(book) {
   let bookList = document.querySelector('ul');
   bookList.innerHTML += `
       <li id="item${book.id}">${book.title}&nbsp;
       <input type="number" min="0" max="1000"></input>
       <button type="button" onclick="updateQuantity(${book.id})">Save</button>
       <button style="display:block" type="button" onclick="deleteBook(${book.id})">Delete</button>
      </li>
   `;
}

main()

const updateQuantity = async (id) => {
   let bookQuantityInputElem = document.querySelector(`#item${id} input`);
   let bookQuantity = bookQuantityInputElem.value
   if (!isNumber(bookQuantity)) {
      alert('please enter a number');
      bookQuantityInputElem.value = '';
      return;
   }

   let patchResponse = await fetch('http://localhost:3001/updateBook', {
      method : 'PATCH',
      headers : {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         "id" : id,
         "quantity" : bookQuantity
      })
   });
   let updatedBook = await patchResponse.json();
   console.log(updatedBook);
}

const deleteBook = async (id) => {
   let deleteResponse = await fetch(`http://localhost:3001/removeBook/${id}`, {
      method : 'DELETE'
   });
   let deleteResponseText = await deleteResponse.text();
   console.log(deleteResponseText);
   let listItem = document.querySelector(`#item${id}`)
   listItem.remove();

   await checkIfAllBooksDeleted();
}

const isNumber = (value) => {
   return !isNaN(Number.parseInt(value))
}

const checkIfAllBooksDeleted = async () => {
   let response = await fetch('http://localhost:3001/listBooks');
   let books = await response.json();
   console.log(books.length);

   if (books.length !== 0)
      return

   let root = document.querySelector(`#root`)
   let addButton = document.createElement('button')
   addButton.textContent = "Recreate book list"
   addButton.onclick = reloadBooks;
   root.appendChild(addButton);
}

const reloadBooks = async() => {
   let response = await fetch('http://localhost:3001/resetBooks',);
   location.reload();
}

const addBook = async (book) => {
   let addResponse = await fetch('http://localhost:3001/addBook', {
      method : 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers : {
         'Content-Type': 'application/json'
      },
      body : JSON.stringify({
         "id" : book.id,
         "title" : book.title,
         "year" : book.year,
         "description" : book.description,
         "quantity" : book.quantity,
         "imageURL" : book.imageURL
      })
   });
   let addedBook = await addResponse.json();
   console.log(addedBook);

};