/**
 * ==========================================================================
 * ESQUADRIAS DE ALUMÍNIO - JAVASCRIPT PRINCIPAL (VANILLA JS)
 * Modular, acessível, interativo e alinhado ao layout da imagem de referência
 * ==========================================================================
 */

const CONFIG = {
  empresa: "Esquadria e Vidraçaria Barreto",
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
      window.open(getWhatsAppUrl("Olá! Gostaria de um orçamento de esquadrias de alumínio."), "_blank");
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

    // Reseta estado de sucesso
    const form = document.getElementById("quoteFormModal");
    const successMsg = document.getElementById("modalSuccessMessage");
    if (form) form.style.display = "flex";
    if (successMsg) successMsg.hidden = true;

    // Seleciona produto se especificado
    if (selectProduto && defaultProduct) {
      for (let i = 0; i < selectProduto.options.length; i++) {
        if (selectProduto.options[i].value.toLowerCase().includes(defaultProduct.toLowerCase())) {
          selectProduto.selectedIndex = i;
          break;
        }
      }
    }

    setTimeout(() => {
      const firstInput = document.getElementById("modalInputNome");
      if (firstInput) firstInput.focus();
    }, 150);
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Gatilhos de abertura
  const triggers = [
    document.getElementById("openQuoteModalHeader"),
    document.getElementById("openQuoteModalMobile"),
    document.getElementById("heroBtnSolicitarOrcamento"),
    document.getElementById("btnFinalCta"),
    document.getElementById("btnSobreNos"),
    document.getElementById("viewAllLink")
  ];

  triggers.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

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
  const phoneInput = document.getElementById("modalInputTelefone");
  const whatsappSubmitBtn = document.getElementById("btnSubmitViaWhatsApp");
  const successBox = document.getElementById("modalSuccessMessage");

  if (!form) return;

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
    const nome = document.getElementById("modalInputNome");
    const tel = document.getElementById("modalInputTelefone");
    const cidade = document.getElementById("modalInputCidade");

    if (nome && nome.value.trim().length < 3) {
      nome.closest(".form-group").classList.add("has-error");
      isValid = false;
    } else if (nome) {
      nome.closest(".form-group").classList.remove("has-error");
    }

    if (tel && tel.value.replace(/\D/g, "").length < 10) {
      tel.closest(".form-group").classList.add("has-error");
      isValid = false;
    } else if (tel) {
      tel.closest(".form-group").classList.remove("has-error");
    }

    if (cidade && cidade.value.trim().length < 2) {
      cidade.closest(".form-group").classList.add("has-error");
      isValid = false;
    } else if (cidade) {
      cidade.closest(".form-group").classList.remove("has-error");
    }

    return isValid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simula envio bem-sucedido
    form.style.display = "none";
    if (successBox) successBox.hidden = false;
    form.reset();
  });

  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener("click", () => {
      const nome = document.getElementById("modalInputNome")?.value.trim() || "";
      const tel = document.getElementById("modalInputTelefone")?.value.trim() || "";
      const cidade = document.getElementById("modalInputCidade")?.value.trim() || "";
      const produto = document.getElementById("modalSelectProduto")?.value || "Esquadrias";
      const msg = document.getElementById("modalInputMensagem")?.value.trim() || "";

      let texto = `*SOLICITAÇÃO DE ORÇAMENTO DE ESQUADRIAS*\n`;
      texto += `• *Nome:* ${nome || "Cliente"}\n`;
      if (tel) texto += `• *Telefone:* ${tel}\n`;
      if (cidade) texto += `• *Cidade:* ${cidade}\n`;
      texto += `• *Produto:* ${produto}\n`;
      if (msg) texto += `• *Detalhes:* ${msg}\n`;

      window.open(getWhatsAppUrl(texto), "_blank", "noopener,noreferrer");
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
