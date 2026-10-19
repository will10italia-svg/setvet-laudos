// js/galeria.js
const GerenciadorGaleria = {
  handleDragOver: function(event) {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = document.getElementById('dropzoneGallery');
    if (dropzone) dropzone.classList.add('border-vet-600', 'bg-vet-50');
  },

  handleDragLeave: function(event) {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = document.getElementById('dropzoneGallery');
    if (dropzone) dropzone.classList.remove('border-vet-600', 'bg-vet-50');
  },

  handleDrop: function(event) {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = document.getElementById('dropzoneGallery');
    if (dropzone) dropzone.classList.remove('border-vet-600', 'bg-vet-50');

    const dt = event.dataTransfer;
    const files = dt ? dt.files : [];
    this.processarArquivos(files);
  },

  tratarUpload: function(event) {
    const files = event.target.files || [];
    this.processarArquivos(files);
    event.target.value = '';
  },

  processarArquivos: function(files) {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    let count = 0;
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        EstadoApp.photos.push({ id: '_' + Math.random().toString(36).substr(2, 9), url: e.target.result });
        if (++count === validFiles.length) { 
          this.atualizarSidebar(); 
          MotorLaudo.atualizarPaginasLaudo(); 
        }
      };
      reader.readAsDataURL(file);
    });
  },

  removePhoto: function(id) {
    EstadoApp.photos = EstadoApp.photos.filter(p => p.id !== id);
    this.atualizarSidebar(); 
    MotorLaudo.atualizarPaginasLaudo();
  },

  atualizarSidebar: function() {
    const list = document.getElementById('sidebar-photos-list');
    const badge = document.getElementById('galeria-count-badge');
    const tabBadge = document.getElementById('tab-photo-count');

    if (badge) badge.textContent = `${EstadoApp.photos.length} foto(s)`;
    if (tabBadge) tabBadge.textContent = EstadoApp.photos.length;

    if (!list) return;

    if (EstadoApp.photos.length === 0) {
      list.innerHTML = '<span class="text-[11px] text-slate-400 block text-center py-3 italic">Nenhuma foto adicionada ainda.</span>';
      return;
    }

    list.innerHTML = EstadoApp.photos.map((p, i) => `
      <div class="flex items-center justify-between bg-slate-50 dark:bg-zinc-800 p-2 rounded-lg text-xs border border-slate-200 dark:border-zinc-700">
        <div class="flex items-center gap-2">
          <img src="${p.url}" class="w-8 h-8 rounded object-cover border border-slate-300">
          <span class="font-semibold text-slate-700 dark:text-zinc-200">Imagem ${i + 1}</span>
        </div>
        <button type="button" onclick="GerenciadorGaleria.removePhoto('${p.id}')" class="text-red-500 font-bold hover:underline text-[11px] py-1 px-2">Excluir</button>
      </div>
    `).join('');
  },

  // Gera os blocos de forma granular (título + linhas de 2 imagens) para o motor de paginação encaixar sem vazios
  gerarBlocosHTML: function() {
    let blocos = [];
    if (EstadoApp.photos.length === 0) return blocos;

    // Título da Seção
    blocos.push(`<div class="a4-section-title">IMAGENS ULTRASSONOGRÁFICAS</div>`);

    // Cada par de imagens forma uma linha isolada, permitindo que o motor quebre a página linha a linha se necessário
    for (let i = 0; i < EstadoApp.photos.length; i += 2) {
      const parFotos = EstadoApp.photos.slice(i, i + 2);
      
      let linhaHtml = `<div class="gallery-grid-2x3" style="margin-bottom: 10px;">`;
      parFotos.forEach((photo, idxLocal) => {
        const absoluteIdx = i + idxLocal;
        const keyPhoto = `photo_caption_${absoluteIdx}`;
        const captionText = EstadoApp.textosEditadosManualmente[keyPhoto] || `Imagem ${absoluteIdx + 1}`;

        linhaHtml += `
          <div class="gallery-item-a4">
            <div class="image-wrapper-a4">
              <img src="${photo.url}" alt="Imagem ${absoluteIdx + 1}">
            </div>
            <div class="photo-caption-a4" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('${keyPhoto}', this)">${captionText}</div>
          </div>`;
      });
      linhaHtml += `</div>`;
      blocos.push(linhaHtml);
    }

    return blocos;
  }
};