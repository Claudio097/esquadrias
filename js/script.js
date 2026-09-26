import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

/**
 * ==========================================================================
 * ESQUADRIAS DE ALUMÍNIO - JAVASCRIPT PRINCIPAL (VANILLA JS)
 * Modular, acessível, interativo e alinhado ao layout da imagem de referência
 * ==========================================================================
 */

const CONFIG = {
  empresa: "Esquadria e Vidraçaria Barreto",
  whatsapp: "5511971485608", // Alterado para um número que parece ser do usuário ou padrão regional
  telefoneFormatado: "(11) 97148-5608",
  email: "contato@vidracariabarreto.com.br",
  cidadeSede: "Bragança Paulista - SP",
  atendimentoRegiao: "Bragança Paulista, Atibaia e Região Bragantina",
  googleMapsApiKey: "AIzaSyB2bCBx3rEw8dWHYqhFLKeKaLcoLwDoo6Y" // Mantida a chave existente
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
  initGoogleMapsCoverage();
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
      window.open(getWhatsAppUrl(`Olá! Gostaria de solicitar um orçamento para esquadrias de alumínio em ${CONFIG.atendimentoRegiao}.`), "_blank", "noopener,noreferrer");
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
    }

    if (phoneInput && phoneInput.value.replace(/\D/g, "").length < 10) {
      phoneInput.closest(".form-group").classList.add("has-error");
      if (!firstErrorField) firstErrorField = phoneInput;
      isValid = false;
    }

    if (cityInput && cityInput.value.trim().length < 2) {
      cityInput.closest(".form-group").classList.add("has-error");
      if (!firstErrorField) firstErrorField = cityInput;
      isValid = false;
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
      if (descEl) descEl.textContent = "Nossa equipe técnica já está preparando sua proposta personalizada para Bragança Paulista e região. Em breve entraremos em contato.";
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
      const qtd = document.getElementById("modalInputQuantidade")?.value || "Não informada";
      const medidas = document.getElementById("modalInputMedidas")?.value || "Não informada / Medição no local";
      const msg = document.getElementById("modalInputMensagem")?.value.trim() || "";

      let texto = `*SOLICITAÇÃO DE ORÇAMENTO - ${CONFIG.empresa.toUpperCase()}*\n`;
      texto += `• *Nome:* ${nome}\n`;
      texto += `• *Telefone:* ${tel}\n`;
      texto += `• *Cidade:* ${cidade}\n`;
      texto += `• *Produto:* ${produto}\n`;
      texto += `• *Quantidade:* ${qtd}\n`;
      texto += `• *Medidas:* ${medidas}\n`;
      if (msg) texto += `• *Observações:* ${msg}\n`;

      window.open(getWhatsAppUrl(texto), "_blank", "noopener,noreferrer");

      // Atualiza estado de sucesso no modal
      form.style.display = "none";
      if (successBox) {
        successBox.hidden = false;
        const titleEl = successBox.querySelector("h4");
        const descEl = successBox.querySelector("p");
        if (titleEl) titleEl.textContent = "Mensagem Encaminhada para o WhatsApp!";
        if (descEl) descEl.textContent = "A janela do WhatsApp foi aberta com todos os detalhes do seu pedido. Nossa equipe em Bragança Paulista responderá em instantes.";
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

/**
 * ==========================================================================
 * GOOGLE MAPS PLATFORM - COBERTURA REGIÃO BRAGANTINA & GEOLOCALIZAÇÃO
 * Implementado com @googlemaps/js-api-loader e AdvancedMarkerElement
 * ==========================================================================
 */

async function initGoogleMapsCoverage() {
  const mapElement = document.getElementById("googleMapRegion");
  const loadingOverlay = document.getElementById("mapLoadingOverlay");
  const statusEl = document.getElementById("userCityStatus");
  const badgeEl = document.getElementById("userCoverageBadge");
  const legendUser = document.getElementById("legendBadgeUser");
  const btnDetectMyLoc = document.getElementById("btnDetectMyLoc");
  const btnFocusBragantina = document.getElementById("btnFocusBragantina");

  if (!mapElement) return;

  // Escuta de Quota Exceeded (Quota Defense)
  window.addEventListener("gmp-quota-exceeded", () => {
    const quotaBanner = document.getElementById("gmpQuotaBanner");
    if (quotaBanner) quotaBanner.style.display = "block";
  });

  // Chave de API provisionada
  const apiKey = (import.meta && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
    ? import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    : "AIzaSyB2bCBx3rEw8dWHYqhFLKeKaLcoLwDoo6Y";

  try {
    setOptions({
      key: apiKey,
      v: "weekly",
      language: "pt-BR",
      region: "BR"
    });

    const { Map, Circle, InfoWindow } = await importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await importLibrary("marker");

    // Centro da Região Bragantina (Eixo Bragança Paulista - Atibaia)
    const BRAGANTINA_CENTER = { lat: -23.033, lng: -46.545 };
    const BRAGANCA_PAULISTA = { lat: -22.9527, lng: -46.5419 };

    // Cidades da Região Bragantina atendidas
    const CITIES_BRAGANTINA = [
      {
        name: "Bragança Paulista",
        lat: -22.9527,
        lng: -46.5419,
        isHub: true,
        desc: "Sede de Fabricação, Medição e Logística Principal da Esquadria e Vidraçaria Barreto."
      },
      {
        name: "Atibaia",
        lat: -23.1189,
        lng: -46.5539,
        isHub: true,
        desc: "Atendimento frequente para residências, condomínios fechados e comércios."
      },
      {
        name: "Piracaia",
        lat: -23.0539,
        lng: -46.4589,
        isHub: false,
        desc: "Equipe técnica e entregas programadas semanais."
      },
      {
        name: "Jarinu",
        lat: -23.1008,
        lng: -46.7278,
        isHub: false,
        desc: "Instalação de portas, janelas e fachadas sob medida."
      },
      {
        name: "Nazaré Paulista",
        lat: -23.1814,
        lng: -46.3969,
        isHub: false,
        desc: "Projetos em esquadrias de alumínio para chácaras e residências na represa."
      },
      {
        name: "Joanópolis",
        lat: -22.9297,
        lng: -46.2756,
        isHub: false,
        desc: "Obras residenciais e rurais com vedação de alto padrão."
      },
      {
        name: "Bom Jesus dos Perdões",
        lat: -23.1333,
        lng: -46.4667,
        isHub: false,
        desc: "Atendimento ágil com visita técnica para medição gratuita."
      },
      {
        name: "Pedra Bela",
        lat: -22.7933,
        lng: -46.4422,
        isHub: false,
        desc: "Instalações e manutenção preventiva especializada."
      },
      {
        name: "Pinhalzinho",
        lat: -22.7806,
        lng: -46.5903,
        isHub: false,
        desc: "Fornecimento de portas balcão, janelas e vidros temperados."
      },
      {
        name: "Vargem",
        lat: -22.8892,
        lng: -46.4172,
        isHub: false,
        desc: "Atendimento na divisa SP/MG com rota logística pontual."
      }
    ];

    // Inicialização do Mapa
    const map = new Map(mapElement, {
      center: BRAGANTINA_CENTER,
      zoom: 10,
      mapId: "DEMO_MAP_ID",
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: "cooperative",
      internalUsageAttributionIds: ["gmp_mcp_codeassist_v1_aistudio"]
    });

    // InfoWindow compartilhada
    const sharedInfoWindow = new InfoWindow({
      maxWidth: 280
    });

    // Esconde o overlay de loading quando o mapa estiver pronto
    map.addListener("idle", () => {
      if (loadingOverlay && loadingOverlay.style.display !== "none") {
        loadingOverlay.classList.add("fade-out");
        setTimeout(() => {
          loadingOverlay.style.display = "none";
        }, 300);
      }
    });

    // Fallback: Se o mapa demorar demais para carregar (5 segundos), esconde o loading
    setTimeout(() => {
      if (loadingOverlay && loadingOverlay.style.display !== "none") {
        loadingOverlay.classList.add("fade-out");
        setTimeout(() => {
          loadingOverlay.style.display = "none";
        }, 300);
      }
    }, 5000);

    // Círculo translúcido ilustrando o raio de cobertura da Região Bragantina
    new Circle({
      strokeColor: "#0084ff",
      strokeOpacity: 0.85,
      strokeWeight: 2,
      fillColor: "#0084ff",
      fillOpacity: 0.12,
      map: map,
      center: BRAGANTINA_CENTER,
      radius: 38000 // 38km de raio cobrindo todo o polo bragantino
    });

    // Marcadores das Cidades da Região Bragantina
    CITIES_BRAGANTINA.forEach((city) => {
      let pin;
      if (city.isHub && city.name === "Bragança Paulista") {
        pin = new PinElement({
          background: "#0084ff",
          borderColor: "#004b99",
          glyphColor: "#ffffff",
          scale: 1.25
        });
      } else if (city.isHub) {
        pin = new PinElement({
          background: "#0284c7",
          borderColor: "#0369a1",
          glyphColor: "#ffffff",
          scale: 1.05
        });
      } else {
        pin = new PinElement({
          background: "#38bdf8",
          borderColor: "#0284c7",
          glyphColor: "#ffffff",
          scale: 0.85
        });
      }

      const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: city.lat, lng: city.lng },
        content: pin.element,
        title: `${city.name} - Região Bragantina`
      });

      marker.addListener("click", () => {
        const isMain = city.name === "Bragança Paulista";
        const contentStr = `
          <div style="font-family:'Plus Jakarta Sans',sans-serif;padding:4px;color:#0f172a;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
              <span style="font-size:1.1rem;">📍</span>
              <strong style="font-size:0.92rem;color:${isMain ? '#0084ff' : '#0f172a'};">${city.name}</strong>
            </div>
            <p style="margin:0 0 6px;font-size:0.78rem;line-height:1.4;color:#475569;">${city.desc}</p>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;">
              <span style="font-size:0.7rem;font-weight:700;color:#0284c7;background:#f0f9ff;padding:2px 6px;border-radius:4px;">
                ${isMain ? 'Fábrica & Sede' : 'Região Atendida'}
              </span>
              <a href="#quoteModal" style="font-size:0.75rem;font-weight:700;color:#0084ff;text-decoration:none;">Orçamento &rarr;</a>
            </div>
          </div>
        `;
        sharedInfoWindow.setContent(contentStr);
        sharedInfoWindow.open({
          anchor: marker,
          map: map
        });
      });
    });

    // Variável para o marcador do usuário
    let userMarker = null;

    // Função de Geocalculação (Haversine) em km
    function calcDistanceKm(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    // Função para rastrear e exibir localização de quem acessou
    async function locateVisitor(autoFit = true) {
      if (!navigator.geolocation) {
        if (statusEl) {
          statusEl.innerHTML = "<span>Navegador sem suporte a GPS. (Polo Bragantino Ativo)</span>";
        }
        return;
      }

      if (statusEl) {
        statusEl.innerHTML = '<span class="loc-loader-spin"></span> Detectando sua localização...';
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const distFromBraganca = calcDistanceKm(
            userPos.lat,
            userPos.lng,
            BRAGANCA_PAULISTA.lat,
            BRAGANCA_PAULISTA.lng
          );

          // Verifica se está dentro de um raio de 70km de Bragança
          const isDirectCoverage = distFromBraganca <= 70;

          // Busca o nome amigável da cidade
          let cityName = "Sua Localidade";
          try {
            const revRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userPos.lat}&lon=${userPos.lng}&zoom=12&addressdetails=1`,
              { headers: { "Accept": "application/json" } }
            );
            if (revRes.ok) {
              const revData = await revRes.json();
              cityName =
                revData.address?.city ||
                revData.address?.town ||
                revData.address?.municipality ||
                revData.address?.village ||
                revData.address?.suburb ||
                "Sua Cidade";
            }
          } catch (e) {
            cityName = "Sua Localidade";
          }

          // Atualiza dados na lista de texto da interface
          if (statusEl) {
            statusEl.innerHTML = `<strong>${cityName}</strong> (a aprox. ${Math.round(distFromBraganca)} km de Bragança Paulista)`;
          }

          if (badgeEl) {
            badgeEl.hidden = false;
            if (isDirectCoverage) {
              badgeEl.className = "user-coverage-pill in-coverage";
              badgeEl.textContent = "✅ Na área de atendimento imediato";
            } else {
              badgeEl.className = "user-coverage-pill nearby-coverage";
              badgeEl.textContent = "🚚 Atendimento com rota especial";
            }
          }

          if (legendUser) legendUser.hidden = false;

          // Marcador visual do usuário (Verde Esmeralda)
          const userPin = new PinElement({
            background: "#10b981",
            borderColor: "#065f46",
            glyphColor: "#ffffff",
            scale: 1.2
          });

          if (userMarker) {
            userMarker.position = userPos;
          } else {
            userMarker = new AdvancedMarkerElement({
              map: map,
              position: userPos,
              content: userPin.element,
              title: `Você está aqui (${cityName})`
            });

            userMarker.addListener("click", () => {
              const infoBox = `
                <div style="font-family:'Plus Jakarta Sans',sans-serif;padding:4px;color:#0f172a;">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                    <span style="font-size:1.1rem;">📍</span>
                    <strong style="font-size:0.92rem;color:#065f46;">Você está aqui!</strong>
                  </div>
                  <p style="margin:0 0 6px;font-size:0.8rem;color:#334155;"><strong>${cityName}</strong> &bull; ${Math.round(distFromBraganca)} km de Bragança Paulista</p>
                  <span style="display:inline-block;padding:3px 8px;font-size:0.72rem;font-weight:700;border-radius:12px;background:#ecfdf5;color:#065f46;">
                    ${isDirectCoverage ? 'Atendimento Esquadria e Vidraçaria Barreto' : 'Consulte entrega para sua obra'}
                  </span>
                </div>
              `;
              sharedInfoWindow.setContent(infoBox);
              sharedInfoWindow.open({
                anchor: userMarker,
                map: map
              });
            });
          }

          if (autoFit) {
            // Ajusta o enquadramento do mapa para mostrar o visitante e o polo bragantino
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(userPos);
            bounds.extend(BRAGANCA_PAULISTA);
            bounds.extend({ lat: -23.1189, lng: -46.5539 }); // Atibaia
            map.fitBounds(bounds, { top: 30, bottom: 30, left: 30, right: 30 });
          } else {
            map.panTo(userPos);
            map.setZoom(12);
          }
        },
        (error) => {
          // Usuário recusou permissão ou deu timeout
          if (statusEl) {
            statusEl.innerHTML = '<span style="color:#64748b;">Localização disponível sob clique (Região Bragantina em destaque)</span>';
          }
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
      );
    }

    // Dispara a tentativa automática de localização do visitante
    locateVisitor(true);

    // Botões de Interação
    if (btnDetectMyLoc) {
      btnDetectMyLoc.addEventListener("click", () => {
        locateVisitor(false);
      });
    }

    if (btnFocusBragantina) {
      btnFocusBragantina.addEventListener("click", () => {
        map.panTo(BRAGANTINA_CENTER);
        map.setZoom(10);
      });
    }

  } catch (err) {
    console.error("Erro ao carregar Google Maps:", err);
    if (loadingOverlay) {
      loadingOverlay.innerHTML = `
        <span style="color:#dc2626;font-size:0.85rem;font-weight:700;">Erro ao carregar mapa</span>
        <button type="button" class="btn btn-pill-blue" style="font-size:0.75rem;padding:6px 12px;margin-top:6px;" onclick="window.location.reload()">Recarregar</button>
      `;
    }
  }
}


