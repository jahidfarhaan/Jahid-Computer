
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu
  const menuButton = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", () => {
      const opened = siteNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(opened));
    });
  }

  // Highlight the current page in the navigation.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Close mobile menu after selecting a page.
  document.querySelectorAll(".site-nav a").forEach(link => {
    link.addEventListener("click", () => {
      if (siteNav) siteNav.classList.remove("open");
      if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    });
  });

  // Image placeholders automatically disappear when a real image exists.
  // The fallback remains visible only for missing local image files.
  document.querySelectorAll(".image-placeholder img").forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.parentElement.classList.add("image-ready");
    }
  });

  // Only common, deliverable .com email domains are accepted by the demo forms.
  // This prevents obvious fake domains from being treated as valid input.
  const allowedEmailDomains = new Set([
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "protonmail.com",
    "zoho.com",
    "rediffmail.com"
  ]);

  function validName(value) {
    return /^[A-Za-z][A-Za-z .'-]{2,49}$/.test(value.trim());
  }

  function validPhone(value) {
    return /^[6-9]\d{9}$/.test(value.trim().replace(/\s+/g, ""));
  }

  function validEmail(value) {
    const email = value.trim().toLowerCase();
    const match = email.match(/^[a-z0-9._%+-]+@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/);
    if (!match) return false;

    const domain = match[1];
    const labels = domain.split(".");
    if (labels.some(label => !/^[a-z0-9-]+$/.test(label) || label.startsWith("-") || label.endsWith("-"))) {
      return false;
    }

    // The institute project accepts the common .com providers above.
    return domain.endsWith(".com") && allowedEmailDomains.has(domain);
  }

  function addError(input, message) {
    input.classList.add("field-error");
    let help = input.parentElement.querySelector(".field-help");
    if (!help) {
      help = document.createElement("div");
      help.className = "field-help";
      input.parentElement.appendChild(help);
    }
    help.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("field-error");
    const help = input.parentElement.querySelector(".field-help");
    if (help) help.remove();
  }

  function validateField(input, type, customMessage) {
    clearError(input);
    const value = input.value.trim();

    if (!value) {
      addError(input, customMessage || "This field is required.");
      return false;
    }

    if (type === "name" && !validName(value)) {
      addError(input, "Enter a valid full name.");
      return false;
    }

    if (type === "phone" && !validPhone(value)) {
      addError(input, "Enter a valid 10-digit Indian mobile number.");
      return false;
    }

    if (type === "email" && !validEmail(value)) {
      addError(input, "Use a valid .com email address from a recognised provider.");
      return false;
    }

    return true;
  }

  function setupForm(formId, statusId) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    form.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("input", () => clearError(field));
      field.addEventListener("change", () => clearError(field));
    });

    form.addEventListener("submit", event => {
      event.preventDefault();

      const name = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      const email = form.querySelector('[name="email"]');

      let good = true;
      good = validateField(name, "name", "Please enter your full name.") && good;
      good = validateField(phone, "phone", "Please enter your mobile number.") && good;
      good = validateField(email, "email", "Please enter your email address.") && good;

      form.querySelectorAll("select[required]").forEach(select => {
        clearError(select);
        if (!select.value) {
          addError(select, "Please select an option.");
          good = false;
        }
      });

      form.querySelectorAll("textarea[required]").forEach(area => {
        clearError(area);
        if (area.value.trim().length < 10) {
          addError(area, "Please enter at least 10 characters.");
          good = false;
        }
      });

      if (!good) {
        status.className = "form-status error";
        status.textContent = "Please correct the highlighted fields and try again.";
        return;
      }

      status.className = "form-status success";
      status.textContent = "Thank you. Your enquiry has been prepared successfully.";
      form.reset();
    });
  }

  setupForm("admission-form", "ad-status");
  setupForm("contact-form", "contact-status");

  // Pre-select a course when a visitor clicks an enquiry link.
  const params = new URLSearchParams(window.location.search);
  const selectedCourse = params.get("course");
  const courseField = document.getElementById("ad-course");
  if (selectedCourse && courseField) {
    const option = [...courseField.options].find(opt => opt.textContent.trim() === selectedCourse.trim());
    if (option) courseField.value = option.value;
  }
});
