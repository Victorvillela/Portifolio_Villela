/**
* Template Name: Gp
* Updated: Mar 10 2024 with Bootstrap v5.3.3
* Template URL: https://bootstrapmade.com/gp-free-multipurpose-html-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  // ========================================
  // VIDEO BACKGROUND - MOBILE FIX
  // ========================================

  /**
   * Detecção de dispositivo mobile
   */
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Configuração do vídeo de fundo
   */
  function setupHeroVideo() {
    const video = document.querySelector('#hero video');
    
    if (video) {
      // Força atributos para mobile
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.muted = true;
      
      // Define velocidade do vídeo (0.5x = câmera lenta)
      video.playbackRate = 0.5;
      
      // Função para tentar reproduzir o vídeo
      const playVideo = () => {
        video.play()
          .then(() => {
            console.log('Vídeo de fundo reproduzindo');
          })
          .catch(error => {
            console.log('Vídeo bloqueado em mobile, usando fallback de imagem');
            document.getElementById('hero').classList.add('video-fallback');
          });
      };
      
      // Tenta reproduzir quando o vídeo estiver pronto
      if (video.readyState >= 2) {
        playVideo();
      } else {
        video.addEventListener('loadeddata', playVideo);
      }
      
      // Tenta reproduzir quando o usuário interagir com a página
      ['touchstart', 'click', 'scroll'].forEach(event => {
        document.addEventListener(event, playVideo, { once: true });
      });
      
      // Monitora se o vídeo pausou e tenta reproduzir novamente
      video.addEventListener('pause', function() {
        setTimeout(() => {
          if (video.paused) {
            video.play().catch(() => {
              console.log('Não foi possível retomar o vídeo');
            });
          }
        }, 100);
      });
    }
  }

  /**
   * Adiciona classe mobile-device se for dispositivo móvel
   */
  function addMobileClass() {
    if (isMobileDevice()) {
      const hero = document.getElementById('hero');
      if (hero) {
        hero.classList.add('mobile-device');
      }
    }
  }

  // ========================================
  // PAGE LOAD HANDLERS
  // ========================================

  /**
   * Posiciona no topo da página ao carregá-la
   */
  function scrollToTop() {
    try {
      window.parent.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Preloader
   */
  function handlePreloader() {
    let preloader = select('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    }
  }

  // ========================================
  // HEADER & NAVIGATION
  // ========================================

  /**
   * Navbar links active state on scroll
   */
  function setupNavbarActiveState() {
    let navbarlinks = select('#navbar .scrollto', true);
    
    const navbarlinksActive = () => {
      let position = window.scrollY + 200;
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return;
        let section = select(navbarlink.hash);
        if (!section) return;
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active');
        } else {
          navbarlink.classList.remove('active');
        }
      });
    };
    
    window.addEventListener('load', navbarlinksActive);
    onscroll(document, navbarlinksActive);
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  function setupHeaderScrolled() {
    let selectHeader = select('#header');
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled');
        } else {
          selectHeader.classList.remove('header-scrolled');
        }
      };
      window.addEventListener('load', headerScrolled);
      onscroll(document, headerScrolled);
    }
  }

  /**
   * Mobile nav toggle
   */
  function setupMobileNav() {
    on('click', '.mobile-nav-toggle', function(e) {
      select('#navbar').classList.toggle('navbar-mobile');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }

  /**
   * Mobile nav dropdowns activate
   */
  function setupMobileDropdowns() {
    on('click', '.navbar .dropdown > a', function(e) {
      if (select('#navbar').classList.contains('navbar-mobile')) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle('dropdown-active');
      }
    }, true);
  }

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  function setupScrollToLinks() {
    on('click', '.scrollto', function(e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select('#navbar');
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile');
          let navbarToggle = select('.mobile-nav-toggle');
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
        scrollto(this.hash);
      }
    }, true);
  }

  /**
   * Scroll with offset on page load with hash links in the url
   */
  function setupHashScroll() {
    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash);
        }
      }
    });
  }

  /**
   * Back to top button
   */
  function setupBackToTop() {
    let backtotop = select('.back-to-top');
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active');
        } else {
          backtotop.classList.remove('active');
        }
      };
      window.addEventListener('load', toggleBacktotop);
      onscroll(document, toggleBacktotop);
    }
  }

  // ========================================
  // ANIMATIONS & EFFECTS
  // ========================================

  /**
   * Scroll infinito de logos/empresas
   */
  function setupScrollAnimation() {
    let elemScroll = document.querySelector(".scroll");
    if (elemScroll) {
      let elemContainer = elemScroll.querySelector(".scroll__container");
      let elemChildren = Array.from(elemContainer.children);

      elemChildren.forEach((item) => {
        let itemDuplicado = item.cloneNode(true);
        elemContainer.appendChild(itemDuplicado);
      });
    }
  }

  /**
   * Animation on scroll (AOS)
   */
  function initAOS() {
    window.addEventListener('load', () => {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false
      });
    });
  }

  // ========================================
  // SWIPER SLIDERS
  // ========================================

  /**
   * Clients Slider
   */
  function initClientsSlider() {
    if (document.querySelector('.clients-slider')) {
      new Swiper('.clients-slider', {
        speed: 400,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          320: {
            slidesPerView: 2,
            spaceBetween: 40
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 60
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 80
          },
          992: {
            slidesPerView: 6,
            spaceBetween: 120
          }
        }
      });
    }
  }

  /**
   * Portfolio details slider
   */
  function initPortfolioSlider() {
    if (document.querySelector('.portfolio-details-slider')) {
      new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });
    }
  }

  /**
   * Testimonials slider
   */
  function initTestimonialsSlider() {
    if (document.querySelector('.testimonials-slider')) {
      new Swiper('.testimonials-slider', {
        speed: 600,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });
    }
  }

  // ========================================
  // PORTFOLIO
  // ========================================

  /**
   * Portfolio isotope and filter
   */
  function initPortfolioFilter() {
    window.addEventListener('load', () => {
      let portfolioContainer = select('.portfolio-container');
      if (portfolioContainer) {
        let portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item'
        });

        let portfolioFilters = select('#portfolio-flters li', true);

        on('click', '#portfolio-flters li', function(e) {
          e.preventDefault();
          portfolioFilters.forEach(function(el) {
            el.classList.remove('filter-active');
          });
          this.classList.add('filter-active');

          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          portfolioIsotope.on('arrangeComplete', function() {
            AOS.refresh();
          });
        }, true);
      }
    });
  }

  /**
   * Initiate portfolio lightbox 
   */
  function initPortfolioLightbox() {
    if (typeof GLightbox !== 'undefined') {
      const portfolioLightbox = GLightbox({
        selector: '.portfolio-lightbox'
      });
    }
  }

  // ========================================
  // OTHER PLUGINS
  // ========================================

  /**
   * Initiate Pure Counter 
   */
  function initPureCounter() {
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  /**
   * Inicializa todas as funcionalidades quando o DOM estiver pronto
   */
  document.addEventListener('DOMContentLoaded', function() {
    
    // Page Load
    scrollToTop();
    handlePreloader();
    
    // Video Background
    setupHeroVideo();
    addMobileClass();
    
    // Header & Navigation
    setupNavbarActiveState();
    setupHeaderScrolled();
    setupMobileNav();
    setupMobileDropdowns();
    setupScrollToLinks();
    setupHashScroll();
    setupBackToTop();
    
    // Animations & Effects
    setupScrollAnimation();
    initAOS();
    
    // Sliders
    initClientsSlider();
    initPortfolioSlider();
    initTestimonialsSlider();
    
    // Portfolio
    initPortfolioFilter();
    initPortfolioLightbox();
    
    // Other Plugins
    initPureCounter();
    
  });

})();