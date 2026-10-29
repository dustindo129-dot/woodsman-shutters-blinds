// ===== WoodsMan Shutters & Blinds — interactions =====
(function () {
  "use strict";

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    // Close menu when a link is tapped
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header shadow on scroll
  const header = document.getElementById("header");
  const onScroll = function () {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Gallery lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const openLightbox = function (src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = function () {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  document.querySelectorAll(".gallery-item:not(.gallery-video)").forEach(function (item) {
    item.addEventListener("click", function () {
      openLightbox(item.getAttribute("data-full"));
    });
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  // Gallery category filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        galleryItems.forEach(function (item) {
          const match = filter === "all" || item.getAttribute("data-cat") === filter;
          item.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  // Contact form -> Resend-backed API (/api/contact)
  const form = document.getElementById("quoteForm");
  const note = document.getElementById("formNote");
  const submitBtn = document.getElementById("submitBtn");

  const showNote = function (type, text) {
    if (!note) return;
    note.hidden = false;
    note.textContent = text;
    note.classList.remove("form-note--success", "form-note--error");
    note.classList.add(type === "error" ? "form-note--error" : "form-note--success");
  };

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        service: form.service.value,
        message: form.message.value.trim(),
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(function () { return {}; });
        if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");

        showNote("success", "Thanks! Your request was sent — we'll get back to you shortly. Prefer to talk now? Call 945-241-1155.");
        form.reset();
      } catch (err) {
        showNote("error", err.message || "We couldn't send your message. Please call 945-241-1155.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Request";
        }
      }
    });
  }

  // Scroll reveal animations
  const revealEls = document.querySelectorAll(
    ".section-head, .product-card, .feature-text, .feature-media, .review-card, .gallery-item, .trust-item, .contact-form, .contact-info"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Current year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
