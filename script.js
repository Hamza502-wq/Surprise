const SONG_URL = "https://www.youtube.com/watch?v=2Vv-BfVoq4g";

function spawnHearts(originX, originY) {
  for (let index = 0; index < 18; index += 1) {
    const heart = document.createElement("span");
    heart.className = "celebration-heart";
    heart.style.setProperty("--x", `${originX + (Math.random() * 80 - 40)}px`);
    heart.style.setProperty("--y", `${originY + (Math.random() * 30 - 10)}px`);
    heart.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);
    heart.style.animationDelay = `${index * 0.03}s`;
    document.body.appendChild(heart);

    window.setTimeout(() => {
      heart.remove();
    }, 1400);
  }
}

function wireCelebrateLinks() {
  const links = document.querySelectorAll(".celebrate-link");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const rect = link.getBoundingClientRect();
      spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);

      window.setTimeout(() => {
        window.location.href = link.getAttribute("href");
      }, 650);
    });
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function wireRunawayButton() {
  const zone = document.querySelector("[data-runaway-zone]");
  const button = document.querySelector("[data-runaway]");

  if (!zone || !button) {
    return;
  }

  const moveButton = () => {
    const zoneRect = zone.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const padding = 10;
    const maxX = Math.max(padding, zoneRect.width - buttonRect.width - padding);
    const maxY = Math.max(padding, zoneRect.height - buttonRect.height - padding);
    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;

    button.classList.remove("is-moving");
    button.style.left = `${nextX + buttonRect.width / 2}px`;
    button.style.top = `${nextY}px`;

    window.requestAnimationFrame(() => {
      button.classList.add("is-moving");
    });
  };

  const dodgeIfNeeded = (event) => {
    const zoneRect = zone.getBoundingClientRect();
    const pointerX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const pointerY = "touches" in event ? event.touches[0].clientY : event.clientY;
    const buttonRect = button.getBoundingClientRect();
    const distanceX = Math.abs(pointerX - (buttonRect.left + buttonRect.width / 2));
    const distanceY = Math.abs(pointerY - (buttonRect.top + buttonRect.height / 2));

    if (
      pointerX >= zoneRect.left &&
      pointerX <= zoneRect.right &&
      pointerY >= zoneRect.top &&
      pointerY <= zoneRect.bottom &&
      distanceX < 120 &&
      distanceY < 75
    ) {
      moveButton();
    }
  };

  button.addEventListener("mouseenter", moveButton);
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    moveButton();
  });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    moveButton();
  });
  button.addEventListener("focus", moveButton);
  zone.addEventListener("mousemove", dodgeIfNeeded);
  zone.addEventListener("touchstart", dodgeIfNeeded, { passive: true });

  if ("ResizeObserver" in window) {
    const zoneResizeObserver = new ResizeObserver(() => {
      const zoneRect = zone.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const safeLeft = clamp(buttonRect.left - zoneRect.left, 0, zoneRect.width - buttonRect.width);
      const safeTop = clamp(buttonRect.top - zoneRect.top, 0, zoneRect.height - buttonRect.height);
      button.style.left = `${safeLeft + buttonRect.width / 2}px`;
      button.style.top = `${safeTop}px`;
    });

    zoneResizeObserver.observe(zone);
  }
}

function wireSongPage() {
  const songLink = document.querySelector("#song-link");
  const songStatus = document.querySelector("#song-status");

  if (!songLink || !songStatus) {
    return;
  }

  songLink.href = SONG_URL;

  window.setTimeout(() => {
    songStatus.textContent = "Redirecting you to the song now. If it does not open, press the button.";
    window.location.href = SONG_URL;
  }, 1800);
}

wireCelebrateLinks();
wireRunawayButton();
wireSongPage();
