// get all the carousel items (each one contains an image)
const items = document.querySelectorAll(".carousel-item");

// select a random image to display in the carousel each time the page loads
if (items?.length) {
  const randomItem = Math.floor(Math.random() * items.length);
  items.forEach((item) => item.classList.remove("active"));
  items[randomItem].classList.add("active");
}
