/**
 * ==========================================================================
 * ESQUADRIAS DE ALUMÍNIO - JAVASCRIPT PRINCIPAL (VANILLA JS)
 * Modular, acessível, interativo e alinhado ao layout da imagem de referência
 * ==========================================================================
 */

const CONFIG = {
  empresa: "Esquadrias de Alumínio",
  whatsapp: "5511999999999",
  telefoneFormatado: "(11) 99999-9999",
  email: "contato@esquadriasdealuminio.com.br",
  cidade: "São Paulo - SP"
};

/**
 * Utilitário para gerar URLs padronizadas do WhatsApp
 */
function getWhatsAppUrl(message) {
  const cleanNumber = CONFIG.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileDrawer();
  initFaqAccordion();
  initOfferButton();
  initQuoteModal();
  initQuoteForm();
  initLightboxGallery();
  initFloatingWhatsApp();
  initSmoothScroll();
});

/**
 * Gaveta do Menu Mobile
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileDrawer");
  const closeBtn = document.getElementById("closeMobileDrawerBtn");
  const drawerLinks = document.querySelectorAll(".mobile-link");

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });

  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("active")) {
      closeDrawer();
    }
  });

  const whatsappDrawerBtn = document.getElementById("whatsappQuickDrawer");
  if (whatsappDrawerBtn) {
    whatsappDrawerBtn.addEventListener("click", () => {
      closeDrawer();
      window.open(getWhatsAppUrl("Olá! Gostaria de um orçamento de esquadrias de alumínio."), "_blank", "noopener,noreferrer");
    });
  }

  const openQuoteMobileBtn = document.getElementById("openQuoteModalMobile");
  if (openQuoteMobileBtn) {
    openQuoteMobileBtn.addEventListener("click", () => {
      closeDrawer();
    });
  }
}

/**
 * Acordeão Interativo de Perguntas Frequentes (FAQ)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-row-item");

  faqItems.forEach((row) => {
    const trigger = row.querySelector(".faq-trigger-btn");
    const body = row.querySelector(".faq-collapse-body");
    const icon = row.querySelector(".faq-toggle-icon");

    if (!trigger || !body) return;

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      // Fecha outros itens para foco limpo
      faqItems.forEach((otherRow) => {
        if (otherRow !== row) {
          const otherTrigger = otherRow.querySelector(".faq-trigger-btn");
          const otherBody = otherRow.querySelector(".faq-collapse-body");
          const otherIcon = otherRow.querySelector(".faq-toggle-icon");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          if (otherBody) otherBody.hidden = true;
          if (otherIcon) otherIcon.textContent = "+";
        }
      });

      if (isExpanded) {
        trigger.setAttribute("aria-expanded", "false");
        body.hidden = true;
        if (icon) icon.textContent = "+";
      } else {
        trigger.setAttribute("aria-expanded", "true");
        body.hidden = false;
        if (icon) icon.textContent = "−";
      }
    });
  });
}

/**
 * Botão da Oferta Especial (Tenho interesse)
 */
function initOfferButton() {
  const offerBtn = document.getElementById("btnInteresseOferta");
  if (!offerBtn) return;

  offerBtn.addEventListener("click", () => {
    const msg = "Olá! Vi a oferta especial da Janela de Alumínio 1,20 x 1,00 m por R$ 549,90 no site e tenho interesse em fechar o pedido!";
    window.open(getWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
  });
}

/**
 * Modal de Solicitação de Orçamento
 */
function initQuoteModal() {
  const modal = document.getElementById("quoteModal");
  const closeBtn = document.getElementById("closeQuoteModalBtn");
  const selectProduto = document.getElementById("modalSelectProduto");
  const okSuccessBtn = document.getElementById("btnOkModalSuccess");

  if (!modal) return;

  function openModal(defaultProduct) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Reseta estado de sucesso e erros anteriores
    const form = document.getElementById("quoteFormModal");
    const successMsg = document.getElementById("modalSuccessMessage");
    if (form) form.style.display = "flex";
    if (successMsg) successMsg.hidden = true;

    modal.querySelectorAll(".form-group.has-error").forEach((grp) => {
      grp.classList.remove("has-error");
    });

    // Seleciona produto se especificado
    if (selectProduto && defaultProduct) {
      const target = defaultProduct.toLowerCase().trim();
      let foundIndex = -1;

      // 1. Busca correspondência exata
      for (let i = 0; i < selectProduto.options.length; i++) {
        if (selectProduto.options[i].value.toLowerCase() === target) {
          foundIndex = i;
          break;
        }
      }

      // 2. Busca bidirecional de substring
      if (foundIndex === -1) {
        for (let i = 0; i < selectProduto.options.length; i++) {
          const optVal = selectProduto.options[i].value.toLowerCase();
          if (target.includes(optVal) || optVal.includes(target)) {
            foundIndex = i;
            break;
          }
        }
      }

      // 3. Casos especiais (ofertas e sob medida / institucional)
      if (foundIndex === -1) {
        if (target.includes("oferta") || target.includes("549") || target.includes("1,20")) {
          for (let i = 0; i < selectProduto.options.length; i++) {
            if (selectProduto.options[i].value.toLowerCase().includes("oferta")) {
              foundIndex = i;
              break;
            }
          }
        } else if (target.includes("perfil") || target.includes("fechamento") || target.includes("acabamento") || target.includes("material") || target.includes("sobre")) {
          for (let i = 0; i < selectProduto.options.length; i++) {
            if (selectProduto.options[i].value.toLowerCase().includes("sob medida") || selectProduto.options[i].value.toLowerCase().includes("outros")) {
              foundIndex = i;
              break;
            }
          }
        }
      }

      if (foundIndex !== -1) {
        selectProduto.selectedIndex = foundIndex;
      }
    }

    setTimeout(() => {
      const firstInput = document.getElementById("modalInputNome");
      if (firstInput) firstInput.focus();
    }, 150);
  }

  // Permite acionar abertura com produto pré-selecionado a partir do lightbox ou outros componentes
  window.openQuoteModal = openModal;

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Gatilhos de abertura gerais (viewAllLink foi removido pois seu propósito é rolagem para produtos)
  const triggers = [
    document.getElementById("openQuoteModalHeader"),
    document.getElementById("openQuoteModalMobile"),
    document.getElementById("heroBtnSolicitarOrcamento"),
    document.getElementById("btnFinalCta")
  ];

  triggers.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  // Botão "Saiba mais" no card Sobre Nós
  const btnSobreNos = document.getElementById("btnSobreNos");
  if (btnSobreNos) {
    btnSobreNos.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("Outros / Projeto Completo");
    });
  }

  // Botões de orçamento nos cards de produto
  document.querySelectorAll(".btn-product-quote").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const prod = btn.getAttribute("data-produto") || "";
      openModal(prod);
    });
  });

  // Fechamentos
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (okSuccessBtn) okSuccessBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

/**
 * Validação do Formulário e Envio Direto via WhatsApp
 */
function initQuoteForm() {
  const form = document.getElementById("quoteFormModal");
  const nameInput = document.getElementById("modalInputNome");
  const phoneInput = document.getElementById("modalInputTelefone");
  const cityInput = document.getElementById("modalInputCidade");
  const whatsappSubmitBtn = document.getElementById("btnSubmitViaWhatsApp");
  const successBox = document.getElementById("modalSuccessMessage");

  if (!form) return;

  // Limpa mensagem de erro em tempo real ao digitar
  [nameInput, phoneInput, cityInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        input.closest(".form-group")?.classList.remove("has-error");
      });
    }
  });

  // Máscara dinâmica de telefone
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
      }
      e.target.value = v;
    });
  }

  function validate() {
    let isValid = true;
    let firstErrorField = null;

    if (nameInput && nameInput.value.trim().length < 3) {
      nameInput.closest(".form-group").classList.add("has-error");
      if (!firstErrorField) firstErrorField = nameInput;
      isValid = false;
    } else if (nameInput) {
      nameInput.closest(".form-group").classList.remove("has-error");
    }

    if (phoneInput && phoneInput.value.replace(/\D/g, "").length < 10) {
      phoneInput.closest(".form-group").classList.add("has-error");
      if (!firstErrorField) firstErrorField = phoneInput;
      isValid = false;
    } else if (phoneInput) {
      phoneInput.closest(".form-group").classList.remove("has-error");
    }

    if (cityInput && cityInput.value.trim().length < 2) {
      cityInput.closest(".form-group").classList.add("has-error");
      if (!firstErrorField) firstErrorField = cityInput;
      isValid = false;
    } else if (cityInput) {
      cityInput.closest(".form-group").classList.remove("has-error");
    }

    if (firstErrorField) {
      firstErrorField.focus();
    }

    return isValid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simula envio bem-sucedido
    form.style.display = "none";
    if (successBox) {
      successBox.hidden = false;
      const titleEl = successBox.querySelector("h4");
      const descEl = successBox.querySelector("p");
      if (titleEl) titleEl.textContent = "Solicitação Recebida com Sucesso!";
      if (descEl) descEl.textContent = "Nossa equipe técnica já está preparando sua proposta personalizada. Em breve entraremos em contato via WhatsApp ou telefone.";
    }
    form.reset();
  });

  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener("click", () => {
      if (!validate()) return;

      const nome = nameInput?.value.trim() || "";
      const tel = phoneInput?.value.trim() || "";
      const cidade = cityInput?.value.trim() || "";
      const produto = document.getElementById("modalSelectProduto")?.value || "Esquadrias";
      const msg = document.getElementById("modalInputMensagem")?.value.trim() || "";

      let texto = `*SOLICITAÇÃO DE ORÇAMENTO DE ESQUADRIAS*\n`;
      texto += `• *Nome:* ${nome}\n`;
      texto += `• *Telefone:* ${tel}\n`;
      texto += `• *Cidade:* ${cidade}\n`;
      texto += `• *Produto:* ${produto}\n`;
      if (msg) texto += `• *Detalhes:* ${msg}\n`;

      window.open(getWhatsAppUrl(texto), "_blank", "noopener,noreferrer");

      // Atualiza estado de sucesso no modal
      form.style.display = "none";
      if (successBox) {
        successBox.hidden = false;
        const titleEl = successBox.querySelector("h4");
        const descEl = successBox.querySelector("p");
        if (titleEl) titleEl.textContent = "Mensagem Encaminhada para o WhatsApp!";
        if (descEl) descEl.textContent = "A janela do WhatsApp foi aberta com todos os detalhes do seu pedido. Nossa equipe responderá em instantes.";
      }
      form.reset();
    });
  }
}

/**
 * WhatsApp Flutuante
 */
function initFloatingWhatsApp() {
  const btn = document.getElementById("floatingWhatsapp");
  if (!btn) return;

  const defaultMsg = "Olá! Estive navegando no site e gostaria de solicitar um orçamento para esquadrias de alumínio.";
  btn.setAttribute("href", getWhatsAppUrl(defaultMsg));
}

/**
 * Rolagem Suave para Âncoras
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}

/**
 * ==========================================================================
 * GALERIA LIGHTBOX (CSS + JS PURO)
 * Acessível, responsiva, com navegação por teclado, toque/swipe e transição suave
 * ==========================================================================
 */
function initLightboxGallery() {
  const modal = document.getElementById("lightboxModal");
  const backdrop = document.getElementById("lightboxBackdrop");
  const closeBtn = document.getElementById("closeLightboxBtn");
  const prevBtn = document.getElementById("lightboxPrevBtn");
  const nextBtn = document.getElementById("lightboxNextBtn");
  const imageEl = document.getElementById("lightboxImage");
  const counterEl = document.getElementById("lightboxCounter");
  const titleEl = document.getElementById("lightboxTitle");
  const descEl = document.getElementById("lightboxDesc");
  const quoteBtn = document.getElementById("lightboxQuoteBtn");
  const container = document.getElementById("lightboxContainer");

  if (!modal || !imageEl) return;

  const triggerElements = Array.from(document.querySelectorAll(".lightbox-trigger"));
  if (triggerElements.length === 0) return;

  // Monta a lista estruturada de itens para navegação da galeria
  const galleryItems = triggerElements.map((el) => {
    const img = el.querySelector("img");
    const src = el.getAttribute("data-lightbox-src") || (img ? img.getAttribute("src") : "");
    const alt = img ? img.getAttribute("alt") || "" : "Foto ampliada de esquadria";
    const title = el.getAttribute("data-lightbox-title") || 
                  el.closest(".product-item-card")?.querySelector(".product-card-title")?.textContent?.trim() || 
                  "Esquadria de Alumínio";
    const desc = el.getAttribute("data-lightbox-desc") || 
                 el.closest(".product-item-card")?.querySelector(".product-card-desc")?.textContent?.trim() || 
                 "Visualização em alta definição da peça com acabamento de excelência.";
    const productName = el.getAttribute("data-lightbox-title") || 
                        el.closest(".product-item-card")?.querySelector(".product-card-title")?.textContent?.trim() || 
                        "";

    return { src, alt, title, desc, productName };
  });

  let currentIndex = 0;
  let isSwitching = false;

  function renderSlide(index) {
    if (index < 0 || index >= galleryItems.length) return;
    currentIndex = index;
    const item = galleryItems[currentIndex];

    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }
    if (titleEl) {
      titleEl.textContent = item.title;
    }
    if (descEl) {
      descEl.textContent = item.desc;
    }

    imageEl.src = item.src;
    imageEl.alt = item.alt;
  }

  function changeSlide(newIndex) {
    if (isSwitching) return;
    isSwitching = true;

    // Efeito suave de transição entre imagens
    imageEl.classList.add("fade-out");

    setTimeout(() => {
      const normalizedIndex = (newIndex + galleryItems.length) % galleryItems.length;
      renderSlide(normalizedIndex);
      imageEl.classList.remove("fade-out");
      isSwitching = false;
    }, 150);
  }

  function openLightbox(index) {
    renderSlide(index);
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Foco inicial no botão de fechar para usabilidade via teclado
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  function closeLightbox() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Vincula cliques e eventos de teclado a cada miniatura
  triggerElements.forEach((trigger, idx) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(idx);
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  // Botões de navegação
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      changeSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      changeSlide(currentIndex + 1);
    });
  }

  // Fechamento pelo botão "X" e pelo backdrop escuro
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeLightbox);
  }

  // Fechar clicando na área vazia da sobreposição
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Ação de solicitar orçamento diretamente da imagem ampliada
  if (quoteBtn) {
    quoteBtn.addEventListener("click", () => {
      const item = galleryItems[currentIndex];
      closeLightbox();
      if (typeof window.openQuoteModal === "function") {
        window.openQuoteModal(item.productName || item.title);
      }
    });
  }

  // Navegação global por teclado (Esc para fechar, Setas para navegar)
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      changeSlide(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      changeSlide(currentIndex + 1);
    }
  });

  // Suporte a gestos Touch / Swipe em dispositivos móveis
  let touchStartX = 0;
  let touchEndX = 0;

  if (container) {
    container.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 45;
    const diff = touchEndX - touchStartX;

    if (diff > threshold) {
      // Arrastou para a direita -> foto anterior
      changeSlide(currentIndex - 1);
    } else if (diff < -threshold) {
      // Arrastou para a esquerda -> próxima foto
      changeSlide(currentIndex + 1);
    }
  }
}

