document.querySelectorAll("[data-buy]").forEach((buyButton) => {
  buyButton.addEventListener("click", (e) => {
    console.log("Click " + e.target.dataset.name);
  });
});

// adapted from:
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
    let category = e.target.getAttribute("data-filter");

    if (!document.startViewTransition) {
      updateActiveButton(e.target);
      filterGreetings(category);
    } else {
      document.startViewTransition(() => {
        updateActiveButton(e.target);
        filterGreetings(category);
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
    let eventCategory = greeting.getAttribute("data-category");

    // check if that category matches with the filter
    if (filter === "all" || filter === eventCategory) {
      greeting.removeAttribute("hidden");
    } else {
      greeting.setAttribute("hidden", "");
    }
  });
}
