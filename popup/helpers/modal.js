const modal = document.querySelector("#myModal");
const closeModalBtn = modal.querySelector(".modal-close");
const modalTitle = modal.querySelector(".modal-title");
const modalBody = modal.querySelector(".modal-body");

function initModal() {
  // When the user clicks on <span> (x), close the modal
  closeModalBtn.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

export function openModal(title, body) {
  modalTitle.innerHTML = title;
  modalBody.innerHTML = body;
  modal.style.display = "block";
}

(() => {
  initModal();
})();
