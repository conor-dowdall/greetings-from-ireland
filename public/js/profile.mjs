const playButtons = document.querySelectorAll("button[data-play]");
playButtons.forEach((playButton) => {
  const audio = document.querySelector(
    `audio[data-audio-name="${playButton.dataset.audioName}"]`
  );
  playButton.addEventListener("click", () => audio.play());
});

const puchaseButtons = document.querySelectorAll("button[data-purchase]");
puchaseButtons.forEach((buyButton) => {
  buyButton.addEventListener("click", (e) => {
    console.log("Purchase " + e.target.dataset.audioName);
  });
});

// the following code is adapted from:
// https://codepen.io/kevinpowell/pen/GRzxybd/c5c073666a8225c2c8f2fadd4d7c049b

const filterList = document.querySelector(".filter");
const filterButtons = filterList.querySelectorAll(".filter-btn");
const greetings = document.querySelectorAll(".greeting");

let greetingsIndex = 0;

greetings.forEach((greeting) => {
  greeting.style.viewTransitionName = `greeting-${++greetingsIndex}`;
});

filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let filter = e.target.getAttribute("data-filter");

    if (!document.startViewTransition) {
      updateActiveButton(e.target);
      filterGreetings(filter);
    } else {
      document.startViewTransition(() => {
        updateActiveButton(e.target);
        filterGreetings(filter);
      });
    }
  });
});

function updateActiveButton(newButton) {
  filterList.querySelector(".active").classList.remove("active");
  newButton.classList.add("active");
}

function filterGreetings(filter) {
  greetings.forEach((greeting) => {
    // get each greetings category
    let category = greeting.getAttribute("data-category");

    // check if that category matches with the filter
    if (filter === "all" || filter === category) {
      greeting.removeAttribute("hidden");
    } else {
      greeting.setAttribute("hidden", "");
    }
  });
}
