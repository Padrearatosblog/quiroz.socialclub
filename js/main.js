const revealElements = document.querySelectorAll(".reveal");
const galleryItems = document.querySelectorAll(".gallery__item");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox__image");
const lightboxClose = document.querySelector(".lightbox__close");
const lightboxPrev = document.querySelector(".lightbox__nav--prev");
const lightboxNext = document.querySelector(".lightbox__nav--next");
const lightboxCounter = document.querySelector(".lightbox__counter");
let activeImageIndex = 0;

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -48px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

function setLightboxImage(index) {
  const item = galleryItems[index];
  const image = item.querySelector("img");

  activeImageIndex = index;
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = image.alt;
  lightboxCounter.textContent = `${index + 1} / ${galleryItems.length}`;
}

function openLightbox(index) {
  setLightboxImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCounter.textContent = "";
}

function showPreviousImage() {
  const previousIndex = activeImageIndex === 0 ? galleryItems.length - 1 : activeImageIndex - 1;
  setLightboxImage(previousIndex);
}

function showNextImage() {
  const nextIndex = activeImageIndex === galleryItems.length - 1 ? 0 : activeImageIndex + 1;
  setLightboxImage(nextIndex);
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    openLightbox(index);
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPreviousImage);
lightboxNext.addEventListener("click", showNextImage);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showPreviousImage();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }
});
