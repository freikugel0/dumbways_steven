const formLetter = document.getElementById("form-letter");
const letterCardContainer = document.getElementById("letter-card-container");

const container2 = document.getElementById("container-2");
container2.style.display = "none";

function renderCard(id, name, email, phoneNumber, subject, message, emoji) {
  const emojis = {
    "emoji-1": "💖",
    "emoji-2": "🌟",
    "emoji-3": "🎉",
    "emoji-4": "🔥",
    "emoji-5": "👏",
  };

  return `
    <div class="card" id="${id}">
      <div style="display: flex; align-items: center; gap: 20px">
        <h1 style="font-size: 5em">${emojis[emoji]}</h1>
        <div>
          <h3>${name}</h3>
          <p>${email}</p>
          <p>${phoneNumber}</p>
        </div>
        </div>
        <div class="card-content">
          <h4>${subject}</h5>
          <p class="truncate">${message}</p>
        </div>
        <div style="display: grid; grid-template-columns: auto auto; gap: 10px">
          <button onclick="deleteLetter(${id})" class="btn-outline-delete">Delete</button>
          <button onclick="detailLetter(${id})" class="btn-filled">Detail</button>
        </div>
      </div>
    </div>
  `;
}

const initLocalStorage = {
  letters: [],
};

const getCurrentLetters = () => {
  // get previous letters with fallback for initial
  const prev =
    JSON.parse(localStorage.getItem("saved-letters")) || initLocalStorage;
  return prev.letters || [];
};

function addLetter() {
  const currentLetters = getCurrentLetters();

  const formData = new FormData(formLetter);
  const letterData = {
    id: currentLetters.length == 0 ? 0 : currentLetters.length,
    name: formData.get("anon") ? "Anon" : formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    emoji: formData.get("emoji"),
  };

  const save = {
    letters: [...currentLetters, letterData],
  };

  localStorage.setItem("saved-letters", JSON.stringify(save));
}

function deleteLetter(id) {
  const currentLetters = getCurrentLetters();

  const save = {
    letters: currentLetters.filter((letter) => letter.id != id),
  };

  localStorage.setItem("saved-letters", JSON.stringify(save));
  rerenderLetterContainer();
}

function detailLetter(id) {
  // clean modal content
  document.getElementById("modal-content").innerHTML = `
    <button
      id="modal-close-btn"
      class="btn-icon modal-close-btn"
      onclick="closeModal()"
    >
      <img src="./icons/square-x.svg" />
    </button>
  `;

  const currentLetters = getCurrentLetters();
  const letter = currentLetters.find((letter) => letter.id === id);

  const modal = document.getElementById("modal");
  modal.classList.add("modal-show");

  const modalContentElems = `
    <div>
      <h3>From:</h3>
      <p>${letter.name}</p>
      <p>${letter.email}</p>
      <p>${letter.phone}</p>
    </div>
    <div>
      <h3>Subject:</h3>
      <p>${letter.subject}</p>
    </div>
    <div style="display: flex; gap: 5px; flex-direction: column; overflow: hidden;">
      <h3>Message:</h3>
      <p style="flex: 1; overflow: auto;">${letter.message}</p>
    </div>
  `;

  document.getElementById("modal-content").innerHTML += modalContentElems;
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("modal-show");
}

function rerenderLetterContainer() {
  const currentLetters = getCurrentLetters();

  // flush innerHTML container
  letterCardContainer.innerHTML = "";

  // day 5: using for loop to render
  // for (let i = 0; i < currentLetters.length; i++) {
  //   letterCardContainer.innerHTML += renderCard(
  //     currentLetters[i].id,
  //     currentLetters[i].name,
  //     currentLetters[i].email,
  //     currentLetters[i].phone,
  //     currentLetters[i].subject,
  //     currentLetters[i].message,
  //     currentLetters[i].emoji
  //   );
  // }

  // day 6: using hof to render
  const cards = currentLetters.map((letter) => {
    return renderCard(
      letter.id,
      letter.name,
      letter.email,
      letter.phone,
      letter.subject,
      letter.message,
      letter.emoji
    );
  });
  letterCardContainer.innerHTML = cards.join("");

  if (letterCardContainer.innerHTML != "") {
    container2.style.display = "flex";
  } else {
    container2.style.display = "none";
  }

  // truncating text helper (cause css can't handle multiline clipping)
  const truncates = document.querySelectorAll(".truncate");
  truncates.forEach((t) => {
    const raw = t.innerText;
    t.innerText = raw ? `${raw.slice(0, 200)}...` : "";
  });
}

formLetter.addEventListener("submit", (e) => {
  e.preventDefault();

  addLetter();
  rerenderLetterContainer();
});

rerenderLetterContainer();
