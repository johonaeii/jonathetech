const header = document.querySelector("[data-site-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const primaryNav = document.querySelector("[data-primary-nav]");
const focusLinks = document.querySelectorAll("[data-focus-business]");
const businessField = document.querySelector("#business-name");
const form = document.querySelector("[data-inspection-form]");
const status = document.querySelector("[data-form-status]");
const screenshotImages = document.querySelectorAll("[data-screenshot-url]");

const config = window.jonaSiteConfig || {};

document.querySelectorAll("[data-price='inspection']").forEach((price) => {
  if (config.inspectionPrice) {
    price.textContent = price.textContent.includes("Digital Trust Inspection")
      ? `${config.inspectionPrice} Digital Trust Inspection`
      : config.inspectionPrice;
  }
});

const buildScreenshotUrl = (siteUrl) => {
  const encodedUrl = encodeURIComponent(siteUrl);
  const cacheKey = Date.now();

  return `https://s.wordpress.com/mshots/v1/${encodedUrl}?w=1400&cache=${cacheKey}`;
};

screenshotImages.forEach((image) => {
  const siteUrl = image.dataset.screenshotUrl;
  const thumbnail = image.closest(".project-thumb");

  if (!siteUrl || !(image instanceof HTMLImageElement)) {
    return;
  }

  image.addEventListener("load", () => {
    thumbnail?.classList.add("has-screenshot");
  });

  image.addEventListener("error", () => {
    thumbnail?.classList.remove("has-screenshot");
    image.removeAttribute("src");
  });

  image.src = buildScreenshotUrl(siteUrl);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("is-open") || false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    header?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

focusLinks.forEach((link) => {
  link.addEventListener("click", () => {
    window.setTimeout(() => {
      businessField?.focus();
    }, 450);
  });
});

form?.addEventListener("submit", (event) => {
  const isLocalPreview = ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
  const formData = new FormData(form);
  const businessName = String(formData.get("business-name") || "").trim();

  if (!businessName) {
    event.preventDefault();
    status.textContent = "Add the business name and I can start there.";
    businessField?.focus();
    return;
  }

  if (isLocalPreview) {
    event.preventDefault();
    status.textContent = `Preview only: ${businessName} is ready to send once the Netlify form is live.`;
  }
});
