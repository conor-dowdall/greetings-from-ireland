const items = document.querySelectorAll(".carousel-item");

if (items?.length) {
  const randomItem = Math.floor(Math.random() * items.length);
  items.forEach((item) => item.classList.remove("active"));
  items[randomItem].classList.add("active");
}
