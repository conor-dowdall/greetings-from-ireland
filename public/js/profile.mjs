// add event listeners to any play buttons to allow its corresponding
// audio element to play
const playButtons = document.querySelectorAll("button[data-play]");
playButtons.forEach((playButton) => {
  const audio = document.querySelector(
    `audio[data-audio-name="${playButton.dataset.audioName}"]`
  );
  playButton.addEventListener("click", () => audio.play());
});

// the following code is adapted from:
// https://codepen.io/kevinpowell/pen/GRzxybd/c5c073666a8225c2c8f2fadd4d7c049b

const filterList = document.querySelector(".filter");
const filterButtons = filterList.querySelectorAll(".filter-btn");
const greetings = document.querySelectorAll(".greeting");

let greetingsIndex = 0;

// this is for fancy view transitions, if they're supported
greetings.forEach((greeting) => {
  greeting.style.viewTransitionName = `greeting-${++greetingsIndex}`;
});

// update the greetings list when a filter is clicked
filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let filter = e.target.getAttribute("data-filter");

    // add the active class to the newly selected button
    // and apply the new filter to the greetings list
    if (!document.startViewTransition) {
      updateActiveButton(e.target);
      filterGreetings(filter);
    } else {
      // do the fancy view transition, if it is supported
      document.startViewTransition(() => {
        updateActiveButton(e.target);
        filterGreetings(filter);
      });
    }
  });
});

// add the active class to the newly selected button
function updateActiveButton(newButton) {
  filterList.querySelector(".active").classList.remove("active");
  newButton.classList.add("active");
}

// apply a new filter to the greetings list
function filterGreetings(filter) {
  greetings.forEach((greeting) => {
    // get each greetings category
    let category = greeting.getAttribute("data-category");

    // check if that category matches with the filter
    // and hide or unhide that greeting
    if (filter === "all" || filter === category)
      greeting.removeAttribute("hidden");
    else greeting.setAttribute("hidden", "");
  });
}
