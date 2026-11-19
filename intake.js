// Multi-step intake form. Without JavaScript, all steps show as one long form.
(() => {
  const form = document.querySelector("[data-intake-form]");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll(".intake-step"));
  const backButton = form.querySelector("[data-intake-back]");
  const nextButton = form.querySelector("[data-intake-next]");
  const submitButton = form.querySelector("[data-intake-submit]");
  const status = form.querySelector("[data-intake-status]");
  const stepLabel = form.querySelector("[data-intake-step-label]");
  const stepName = form.querySelector("[data-intake-step-name]");
  const bar = form.querySelector("[data-intake-bar]");
  let current = 0;

  form.classList.add("is-stepped");

  const showStep = (index) => {
    current = index;
    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    backButton.hidden = index === 0;
    nextButton.hidden = index === steps.length - 1;
    submitButton.hidden = index !== steps.length - 1;
    stepLabel.textContent = `Step ${index + 1} of ${steps.length}`;
    stepName.textContent = steps[index].dataset.stepName || "";
    bar.style.width = `${((index + 1) / steps.length) * 100}%`;
    status.textContent = "";
  };

  // Check required fields in one step and point to the first missing one.
  const stepIsValid = (step) => {
    const fields = Array.from(step.querySelectorAll("input, select, textarea"));
    for (const field of fields) {
      if (!field.checkValidity()) {
        const label = field.closest("fieldset.form-group")?.querySelector("legend")
          || form.querySelector(`label[for="${field.id}"]`);
        const name = label ? label.textContent.replace(/\(.*?\)/g, "").trim() : "This field";
        status.textContent = field.type === "url"
          ? "Check the website link. It should start with https://"
          : `Please answer: ${name}`;
        field.focus();
        return false;
      }
    }
    return true;
  };

  const scrollToForm = () => {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  nextButton.addEventListener("click", () => {
    if (!stepIsValid(steps[current])) return;
    showStep(current + 1);
    scrollToForm();
  });

  backButton.addEventListener("click", () => {
    showStep(current - 1);
    scrollToForm();
  });

  form.addEventListener("submit", (event) => {
    for (let i = 0; i < steps.length; i += 1) {
      if (!stepIsValid(steps[i])) {
        event.preventDefault();
        showStep(i);
        stepIsValid(steps[i]);
        return;
      }
    }

    const isLocalPreview = ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
    if (isLocalPreview) {
      event.preventDefault();
      status.textContent = "Preview only: this will send once the site is live on Netlify.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  });

  showStep(0);
})();
