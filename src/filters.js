function fillFilters(data) {}

function toggleRegroup(e) {
  if (e.checked) {
    document.querySelectorAll(".multiple").forEach((img) => {
      if (!img.parentElement.classList.contains("hidden")) {
        img.click();
      }
    });
  } else {
    document.querySelectorAll(".multiple").forEach((img) => {
      img.parentElement.classList.remove("hidden");
    });
    document.querySelectorAll(".single.child").forEach((img) => {
      img.remove();
    });
  }
}

function toggleState(e, annotationType) {
    if (e.classList.contains("low-opacity")) {
        e.classList.remove("low-opacity");

        document.querySelectorAll(`.single[src="./images/${symbolsImages[annotationType]}"]`).forEach((img) => {
            img.parentElement.classList.remove("hidden-annotation");
            const totalCell = img.parentElement.parentElement.parentElement.querySelector(".total-cell");
            totalCell.innerText = parseInt(totalCell.innerText) + 1;
        });
        document.querySelectorAll(`.multiple[src="./images/${symbolsImages[annotationType]}"]`).forEach((img) => {
            img.parentElement.classList.remove("hidden-annotation");
            const totalCell = img.parentElement.parentElement.parentElement.querySelector(".total-cell");
            const imgBadge = img.parentElement.querySelector(".badge");
            totalCell.innerText = parseInt(totalCell.innerText) + parseInt(imgBadge.innerText);
        });
    } else {
        e.classList.add("low-opacity");
        document.querySelectorAll(`.single[src="./images/${symbolsImages[annotationType]}"]`).forEach((img) => {
            img.parentElement.classList.add("hidden-annotation");
            const totalCell = img.parentElement.parentElement.parentElement.querySelector(".total-cell");
            totalCell.innerText = parseInt(totalCell.innerText) - 1;
        });
        document.querySelectorAll(`.multiple[src="./images/${symbolsImages[annotationType]}"]`).forEach((img) => {
            img.parentElement.classList.add("hidden-annotation");
            const totalCell = img.parentElement.parentElement.parentElement.querySelector(".total-cell");
            const imgBadge = img.parentElement.querySelector(".badge");
            totalCell.innerText = parseInt(totalCell.innerText) - parseInt(imgBadge.innerText);
        });
    }
}
