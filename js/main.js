const images = Array.from(document.querySelectorAll('[data-modal="true"]'));
const modalContainer = document.querySelector(".modal-container");
const modalImagesParent = document.querySelector(".modal-images-container");

class Modal {
  constructor(modal) {
    this.modal = modal;
    this.attachEventListener();
  }
  openModal() {
    modalImagesParent.style.transition = "none";
    this.modal.removeAttribute("hidden");
    this.modal.classList.add("active");
  }
  closeModal() {
    this.modal.setAttribute("hidden", "true");
    this.modal.classList.remove("active");
  }
  attachEventListener() {
    this.modal.addEventListener("click", (e) => {
      e.target === e.currentTarget ||
      e.target.classList.contains("close__modal")
        ? this.closeModal()
        : null;
    });
  }
}

const modal = new Modal(modalContainer);

//update images & update indicators.
function addImagesAndIndicators(galleryImagesArr) {
  //add images to the array.
  modalImagesParent.innerHTML = galleryImagesArr
    .map((img) => {
      return `<img class="modal-image" src="${img.src}" alt="${img.alt}">`;
    })
    .join("");

  //add indicators to the gallery.
  document.querySelector(".modal-indicators-container").innerHTML =
    galleryImagesArr
      .map((item, index) => {
        return `<button class="modal-indicator" data-index="${index}"></button>`;
      })
      .join("");

  return [
    [...document.querySelectorAll(".modal-image")],
    [...document.querySelectorAll(".modal-indicator")],
  ];
}

//function to update the gallery.
function updateGallery(galleryImages) {
  [modalImages, indicators] = addImagesAndIndicators(galleryImages);
  currentIndex = 0;
  lastIndex = modalImages.length - 1;
  moveTheGallery();
}

//add active class to corresponding idicator.
function addActiveClassToCorrespondingIndicators() {
  indicators.forEach((i) => {
    i.classList.remove("active");
  });
  indicators.forEach((i) =>
    i.dataset.index == currentIndex
      ? i.classList.add("active")
      : i.classList.remove("active")
  );
}
//moving the gallery.
function moveTheGallery() {
  modalImagesParent.style.transform = `translateX(${currentIndex * -100}%)`;
  addActiveClassToCorrespondingIndicators();
}
//add click events to arrows.
function getNextAndPreviusSlide() {
  let arrows = Array.from(document.querySelectorAll(".arrow-btn"));
  arrows.forEach((arrow) => {
    arrow.addEventListener("click", (e) => {
      if (arrow.id === "right") {
        currentIndex++;
        if (currentIndex > lastIndex) {
          currentIndex = 0;
        }
      } else {
        currentIndex--;
        if (currentIndex <= -1) {
          currentIndex = lastIndex;
        }
      }
      modalImagesParent.style.transition = `transform ${transitionSpeed}ms cubic-bezier(0.82, 0.02, 0.39, 1.01)`;
      moveTheGallery();
    });
  });
}
//on clicking an indicator show the corresponding slide.
function addActiveClassToIndicatorsOnClick() {
  document
    .querySelector(".modal-indicators-container")
    .addEventListener("click", (e) => {
      if (e.currentTarget === e.target) {
        return;
      }
      modalImagesParent.style.transition = `transform ${transitionSpeed}ms cubic-bezier(0.82, 0.02, 0.39, 1.01)`;
      currentIndex = Number(e.target.dataset.index);
      moveTheGallery();
    });
}

//opening modal.
function openGalleryModal() {
  images.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateGallery(
        galleries.find((gallery) => gallery.name === btn.dataset.gallery).images
      );
      modal.openModal();
    });
  });
}

//close the modal on pressing escape key.
window.addEventListener("keyup", (e) => {
  if (e.key === "Escape" && modalContainer.classList.contains("active")) {
    modal.closeModal();
  }
});

initGallery("../data/galleries.json", { speed: 400 });

//initiate gallery modal from Modal class created.
async function initGallery(endpoint, options) {
  await fetch(endpoint)
    .then((Response) => {
      if (!Response.ok) {
        throw Error("No Response Recieved!");
      }
      return Response.json();
    })
    .then((data) => {
      galleries = data;
      transitionSpeed = options?.speed || 200;
      openGalleryModal();
      addActiveClassToIndicatorsOnClick();
      getNextAndPreviusSlide();
      addActiveClassToCorrespondingIndicators();
    })
    .catch((err) => {
      return err;
    });
}
