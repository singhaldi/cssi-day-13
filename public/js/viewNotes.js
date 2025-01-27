let googleUserId = "";
let nId = "";

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html';
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.orderByChild('title').on('value', (snapshot) => {
    //const data = snapshot.val();
    //renderDataAsHtml(data);
    //console.log(snapshot);
    writeDataAsHtml(snapshot);
  });
};

const writeDataAsHtml = (data) => {
    let cards = ``
    data.forEach((child) => {
        const noteKey = child.key;
        const noteData = child.val();
        console.log(noteData);
        cards += createCard(noteData, noteKey);

    });
    document.querySelector('#app').innerHTML = cards;
}

const renderDataAsHtml = (data) => {
  let cards = ``
  
  for (const noteItem in data) {
    const note = data[noteItem];
    // For each note create an HTML card
    cards += createCard(note, noteItem)
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

const createCard = (note, noteId) => {
    const colorOptions = ['#56C4E8', '#D0E068', '#CD9EC0', '#ED839D', '#FFE476'];
    const backgroundColor = colorOptions[Math.floor(Math.random() * colorOptions.length)]
  return `
    <div class="column is-one-quarter">
      <div class="card" style="background:${backgroundColor};">
        <header class="card-header">
          <p class="card-header-title">${note.title}</p>
        </header>
        <div class="card-content">
          <div class="content">${note.text}</div>
        </div>
        <footer class = "card-footer">
            <a href="#" class="card-footer-item" onclick="editNote('${noteId}')">
                Edit
            </a>
            <a href="#" class="card-footer-item" onclick="deleteNote('${noteId}')">
                Delete
            </a>
        </footer>
      </div>
    </div>
  `;
}

const deleteNote = (noteId) => {
    console.log("delete pressed")
    const deleteCheckModal = document.querySelector('#deleteCheckModal');
    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    nId = noteId;
    deleteCheckModal.classList.toggle('is-active');
}

const deleteCard = (noteId) => {
    console.log("in deletenode" + noteId);
    firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
    deleteCheckModal.classList.toggle('is-active');
}

const cancelDelete = () => {
    const deleteCheckModal = document.querySelector('#deleteCheckModal');
    deleteCheckModal.classList.toggle('is-active');
}

const editNote = (noteId) => {
    const editNoteModal = document.querySelector('#editNoteModal');
    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(noteId);
        const note = data[noteId];
        console.log(note);
        document.querySelector('#editTitleInput').value = note.title;
        document.querySelector('#editTextInput').value = note.text;
        document.querySelector("#editNoteId").value = noteId;

    });
    editNoteModal.classList.toggle('is-active');
}


const closeEditModal = () => {
    const editNoteModal = document.querySelector('#editNoteModal');
    editNoteModal.classList.toggle('is-active');
}

const saveEditedNote = () => {
    const noteTitle = document.querySelector("#editTitleInput").value;
    const noteText = document.querySelector("#editTextInput").value;
    const noteId = document.querySelector("#editNoteId").value;
    const noteEdits = {
        title: noteTitle,
        text: noteText
    }
    firebase.database().ref(`users/${googleUserId}/${noteId}`).update(noteEdits);
    closeEditModal();
}
