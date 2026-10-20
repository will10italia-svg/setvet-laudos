const ControleZoom = {
  escala: 1.0,
  
  obterEscalaInicial: function() {
    // Se for telemóvel ou tablet (telas até 1024px), ajusta a escala ideal para não estragar o layout A4
    if (window.innerWidth <= 768) return 0.70; // Telemóveis
    if (window.innerWidth <= 1024) return 0.85; // Tablets (como o Galaxy Tab A11)
    return 1.0; // Computador
  },

  ajustarZoomInicial: function() {
    this.escala = this.obterEscalaInicial();
    this.aplicarEscala();
  },

  aplicarEscala: function() {
    const wrapper = document.getElementById('a4WrapperScale');
    if (wrapper) {
      wrapper.style.setProperty('--a4-scale', this.escala.toFixed(2));
    }
    this.atualizarBadge(Math.round(this.escala * 100) + '%');
  },
  
  zoomIn: function() {
    this.escala = Math.min(1.8, this.escala + 0.1);
    this.aplicarEscala();
  },
  
  zoomOut: function() {
    this.escala = Math.max(0.4, this.escala - 0.1);
    this.aplicarEscala();
  },
  
  resetZoom: function() {
    this.ajustarZoomInicial();
  },
  
  atualizarBadge: function(texto) {
    const el = document.getElementById('zoom-level-text');
    if (el) el.textContent = texto;
  }
};
