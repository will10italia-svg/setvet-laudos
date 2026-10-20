// Configuração do Tema Tailwind
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vet: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#059669',
          600: '#0F5A47',
          700: '#0a3f32',
          800: '#064e3b',
          900: '#022c22'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  }
};

function initIcons() { if (window.lucide) lucide.createIcons(); }

const CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

const EstadoApp = {
  photos: [],
  tabAtiva: 'paciente',
  orgaoConfigAtivo: 'figado',
  painelAberto: true,
  textosEditadosManualmente: {},
  orgaosAdicionais: [],

  itensLaudoTemplate: [
    { id: 'figado', nome: 'Fígado', texto: '', tipo: 'orgao', oculto: false },
    { id: 'vesicula_biliar', nome: 'Vesícula Biliar', texto: '', tipo: 'orgao', oculto: false },
    { id: 'estomago', nome: 'Estômago', texto: '', tipo: 'orgao', oculto: false },
    { id: 'alcas', nome: 'Alças Intestinais', texto: '', tipo: 'orgao', oculto: false },
    { id: 'baco', nome: 'Baço', texto: '', tipo: 'orgao', oculto: false },
    { id: 'rins', nome: 'Rins', texto: '', tipo: 'orgao', oculto: false },
    { id: 'vesicula_urinaria', nome: 'Vesícula Urinária', texto: '', tipo: 'orgao', oculto: false },
    { id: 'uretra', nome: 'Uretra', texto: '', tipo: 'orgao', oculto: false },
    { id: 'pancreas', nome: 'Pâncreas', texto: '', tipo: 'orgao', oculto: false },
    { id: 'adrenais', nome: 'Glândulas Adrenais', texto: '', tipo: 'orgao', oculto: false },
    { id: 'ovarios', nome: 'Ovários', texto: '', tipo: 'orgao', sexoObrigatorio: 'Fêmea', oculto: false },
    { id: 'utero', nome: 'Útero', texto: '', tipo: 'orgao', sexoObrigatorio: 'Fêmea', oculto: false },
    { id: 'prostata', nome: 'Próstata', texto: '', tipo: 'orgao', sexoObrigatorio: 'Macho', oculto: false },
    { id: 'testiculo', nome: 'Testículos', texto: '', tipo: 'orgao', sexoObrigatorio: 'Macho', oculto: false },
    { id: 'linfonodos', nome: 'Linfonodos', texto: '', tipo: 'orgao', oculto: false }
  ]
};

// Auxiliar para verificar restrição de sexo por ID de órgão
function orgaoEhIncompativelComSexo(idOrgao, sexoAtual) {
  const idNormalizado = String(idOrgao).toLowerCase();
  
  if (sexoAtual === 'Fêmea') {
    if (idNormalizado.includes('testic') || idNormalizado.includes('prostat')) {
      return true;
    }
  } else if (sexoAtual === 'Macho') {
    if (idNormalizado.includes('ovari') || idNormalizado.includes('uter')) {
      return true;
    }
  }
  return false;
}

const PainelConfigurador = {
  inicializarSeletor: function() {
    const select = document.getElementById('seletor-orgao-ativo');
    if (!select) return;

    const sexoAtual = document.getElementById('p-sexo')?.value || 'Macho';

    const orgaosCompativeis = Object.entries(CONFIGURACAO_ORGAOS).filter(([chave, orgao]) => {
      const idOrgao = orgao.id || chave;
      return !orgaoEhIncompativelComSexo(idOrgao, sexoAtual);
    });

    const idsValidos = orgaosCompativeis.map(([chave, o]) => o.id || chave);
    const ativoValido = idsValidos.includes(EstadoApp.orgaoConfigAtivo) ||
                        EstadoApp.orgaosAdicionais.some(oa => oa.id === EstadoApp.orgaoConfigAtivo);

    if (!ativoValido) {
      EstadoApp.orgaoConfigAtivo = 'figado';
    }

    let optionsHTML = orgaosCompativeis.map(([chave, o]) => `
      <option value="${o.id || chave}">${o.icone || '🩺'} ${o.nome}</option>
    `).join('');

    EstadoApp.orgaosAdicionais.forEach(oa => {
      optionsHTML += `<option value="${oa.id}">➕ ${oa.nome}</option>`;
    });

    select.innerHTML = optionsHTML;
    select.value = EstadoApp.orgaoConfigAtivo;
    this.renderizar();
  },

  trocarOrgaoAtivo: function(orgaoId) {
    EstadoApp.orgaoConfigAtivo = orgaoId;
    const select = document.getElementById('seletor-orgao-ativo');
    if (select) select.value = orgaoId;

    if (!EstadoApp.painelAberto) AppInterface.setPainelAberto(true);
    
    EstadoApp.tabAtiva = 'figado';
    AppInterface.atualizarEstiloBotoesAba('figado');
    
    document.querySelectorAll('.tab-panel-body').forEach(panel => panel.classList.add('hidden'));
    const activePanel = document.getElementById('tab-content-figado');
    if (activePanel) activePanel.classList.remove('hidden');

    this.renderizar();
  },

  adicionarOrgaoAdicional: function() {
    const nome = prompt("Nome da nova estrutura/órgão (ex: Massa Abdominal, Adrenal Direita, etc):");
    if (!nome || nome.trim() === '') return;

    const id = 'adicional_' + Date.now();
    const novoOrgao = {
      id: id,
      nome: nome.trim(),
      texto: 'Sem alterações dignas de nota.'
    };

    EstadoApp.orgaosAdicionais.push(novoOrgao);
    this.inicializarSeletor();
    this.trocarOrgaoAtivo(id);
    MotorLaudo.atualizarPaginasLaudo();
  },

  removerOrgaoAdicional: function(id) {
    EstadoApp.orgaosAdicionais = EstadoApp.orgaosAdicionais.filter(o => o.id !== id);
    delete EstadoApp.textosEditadosManualmente[id];
    EstadoApp.orgaoConfigAtivo = 'figado';
    this.inicializarSeletor();
    MotorLaudo.atualizarPaginasLaudo();
  },

  renderizar: function() {
    const container = document.getElementById('container-orgao-dinamico');
    if (!container) return;

    const orgaoAdicional = EstadoApp.orgaosAdicionais.find(o => o.id === EstadoApp.orgaoConfigAtivo);
    if (orgaoAdicional) {
      container.innerHTML = `
        <div class="bg-slate-100 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-xl p-3 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-slate-800 dark:text-zinc-200">Estrutura Adicional: ${orgaoAdicional.nome}</h3>
            <button onclick="PainelConfigurador.removerOrgaoAdicional('${orgaoAdicional.id}')" class="text-xs font-bold text-red-600 hover:underline">Excluir</button>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição / Achados:</label>
            <textarea oninput="PainelConfigurador.atualizarTextoAdicional('${orgaoAdicional.id}', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs h-24">${orgaoAdicional.texto}</textarea>
          </div>
        </div>
      `;
      return;
    }

    const orgao = CONFIGURACAO_ORGAOS[EstadoApp.orgaoConfigAtivo];
    if (!orgao) return;

    let html = `
      <div class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            ${orgao.icone || '🩺'}
          </div>
          <div>
            <h3 class="text-xs font-bold text-emerald-900 dark:text-emerald-300">Editar: ${orgao.nome}</h3>
            <p class="text-[10px] text-emerald-700 dark:text-emerald-400">Parâmetros e patologias</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="PainelConfigurador.resetar('${orgao.id}')" class="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
            <i data-lucide="rotate-ccw" class="w-3 h-3"></i> Resetar
          </button>
          <span class="text-slate-300 dark:text-zinc-600">|</span>
          <button onclick="PainelConfigurador.toggleOcultar('${orgao.id}')" class="text-[10px] font-bold ${orgao.oculto ? 'text-emerald-600' : 'text-red-600'} hover:underline flex items-center gap-1">
            <i data-lucide="${orgao.oculto ? 'eye' : 'eye-off'}" class="w-3 h-3"></i> 
            <span>${orgao.oculto ? 'Exibir no Laudo' : 'Ocultar do Laudo'}</span>
          </button>
        </div>
      </div>
      <div class="space-y-3">
    `;

    if (typeof orgao.renderCamposCustomizados === 'function') {
      html += orgao.renderCamposCustomizados();
    } else {
      Object.keys(orgao.campos).forEach(campoKey => {
        const val = orgao.campos[campoKey];
        const label = (orgao.labels && orgao.labels[campoKey]) || campoKey;

        if (typeof val === 'boolean') {
          html += `
            <div class="p-2.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
                <input type="checkbox" ${val ? 'checked' : ''} onchange="PainelConfigurador.atualizarCampo('${orgao.id}', '${campoKey}', this.checked)" class="accent-emerald-600 w-4 h-4 rounded">
                <span>${label}</span>
              </label>
            </div>
          `;
        } else if (orgao.options && orgao.options[campoKey]) {
          const opts = orgao.options[campoKey];
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${label}</label>
              <select onchange="PainelConfigurador.atualizarCampo('${orgao.id}', '${campoKey}', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                ${opts.map(opt => {
                  const optVal = typeof opt === 'object' ? opt.value : opt;
                  const optLabel = typeof opt === 'object' ? opt.label : opt;
                  return `<option value="${optVal}" ${val === optVal ? 'selected' : ''}>${optLabel}</option>`;
                }).join('')}
              </select>
            </div>
          `;
        } else if (typeof val === 'string') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${label}</label>
              <input type="text" value="${val}" oninput="PainelConfigurador.atualizarCampo('${orgao.id}', '${campoKey}', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            </div>
          `;
        }
      });
    }

    html += `</div>`;

    if (orgao.chipsPatologias && orgao.chipsPatologias.length > 0) {
      html += `
        <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
          <label class="block text-[11px] font-bold text-slate-600 dark:text-zinc-300">Achados Adicionais / Patologias</label>
          <div class="flex flex-wrap gap-1.5">
            ${orgao.chipsPatologias.map(chip => {
              const isSel = orgao.chipsSelecionados.includes(chip.id);
              return `
                <button type="button" onclick="PainelConfigurador.toggleChip('${orgao.id}', '${chip.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${isSel ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200' : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200'}">
                  ${isSel ? '✓ ' : '+ '} ${chip.rotulo}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    html += `
      <div class="pt-2">
        <button type="button" onclick="PainelConfigurador.aplicarESalvar('${orgao.id}')" class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
          <i data-lucide="check-check" class="w-4 h-4"></i>
          <span>Aplicar e Salvar ${orgao.nome}</span>
        </button>
      </div>
    `;

    container.innerHTML = html;
    initIcons();

    if (typeof orgao.onInit === 'function') {
      setTimeout(() => {
        orgao.onInit();
      }, 10);
    }
  },

  atualizarTextoAdicional: function(id, val) {
    const o = EstadoApp.orgaosAdicionais.find(x => x.id === id);
    if (o) {
      o.texto = val;
      delete EstadoApp.textosEditadosManualmente[id];
      AppInterface.marcarComoRascunho();
      MotorLaudo.atualizarPaginasLaudo();
    }
  },

  atualizarCampo: function(orgaoId, campo, valor) {
    const orgao = CONFIGURACAO_ORGAOS[orgaoId];
    if (!orgao) return;

    if (typeof orgao.onFieldChange === 'function') {
      orgao.onFieldChange(campo, valor);
    } else {
      orgao.campos[campo] = valor;
    }

    delete EstadoApp.textosEditadosManualmente[orgaoId];

    const item = EstadoApp.itensLaudoTemplate.find(i => i.id === orgaoId);
    if (item) item.texto = orgao.gerarTexto(orgao.campos);

    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  toggleChip: function(orgaoId, chipId) {
    const orgao = CONFIGURACAO_ORGAOS[orgaoId];
    if (!orgao) return;

    const idx = orgao.chipsSelecionados.indexOf(chipId);
    if (idx >= 0) orgao.chipsSelecionados.splice(idx, 1);
    else orgao.chipsSelecionados.push(chipId);

    delete EstadoApp.textosEditadosManualmente[orgaoId];

    this.renderizar();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  toggleOcultar: function(orgaoId) {
    const orgao = CONFIGURACAO_ORGAOS[orgaoId];
    if (!orgao) return;
    orgao.oculto = !orgao.oculto;

    const item = EstadoApp.itensLaudoTemplate.find(i => i.id === orgaoId);
    if (item) item.oculto = orgao.oculto;

    this.renderizar();
    MotorLaudo.atualizarPaginasLaudo();
  },

  resetar: function(orgaoId) {
    const orgao = CONFIGURACAO_ORGAOS[orgaoId];
    if (!orgao) return;
    orgao.chipsSelecionados = [];
    orgao.oculto = false;

    delete EstadoApp.textosEditadosManualmente[orgaoId];

    const item = EstadoApp.itensLaudoTemplate.find(i => i.id === orgaoId);
    if (item) {
      item.texto = orgao.gerarTexto(orgao.campos);
      item.oculto = false;
    }

    this.renderizar();
    MotorLaudo.atualizarPaginasLaudo();
  },

  aplicarESalvar: function(orgaoId) {
    const orgao = CONFIGURACAO_ORGAOS[orgaoId];
    if (!orgao) return;

    const item = EstadoApp.itensLaudoTemplate.find(i => i.id === orgaoId);
    if (item) item.texto = orgao.gerarTexto(orgao.campos);

    AppInterface.toggleStatusSalvo(true);
    MotorLaudo.atualizarPaginasLaudo();
  }
};

const AppInterface = {
  clickTopTab: function(tabId) {
    if (EstadoApp.tabAtiva === tabId && EstadoApp.painelAberto) {
      this.togglePanelCollapse();
      return;
    }

    if (!EstadoApp.painelAberto) this.setPainelAberto(true);

    EstadoApp.tabAtiva = tabId;
    this.atualizarEstiloBotoesAba(tabId);

    document.querySelectorAll('.tab-panel-body').forEach(panel => panel.classList.add('hidden'));
    const activePanel = document.getElementById(`tab-content-${tabId}`);
    if (activePanel) activePanel.classList.remove('hidden');

    if (tabId === 'figado') {
      PainelConfigurador.inicializarSeletor();
    }
  },

  atualizarEstiloBotoesAba: function(tabId) {
    document.querySelectorAll('.top-tab-btn').forEach(btn => {
      btn.className = 'top-tab-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-100 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900';
    });

    const activeBtn = document.getElementById(`tab-btn-${tabId}`);
    if (activeBtn) {
      activeBtn.className = 'top-tab-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white dark:bg-zinc-900 text-vet-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-zinc-700';
    }
  },

  togglePanelCollapse: function(forcarFechado = null) {
    const novoEstado = forcarFechado !== null ? !forcarFechado : !EstadoApp.painelAberto;
    this.setPainelAberto(novoEstado);
  },

  setPainelAberto: function(aberto) {
    EstadoApp.painelAberto = aberto;
    const sidebar = document.getElementById('appSidebar');
    const toggleIcon = document.getElementById('icon-sidebar-toggle');
    const overlay = document.getElementById('sidebarOverlay');

    if (!sidebar) return;

    if (aberto) {
      sidebar.classList.remove('sidebar-collapsed');
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'chevron-left');
      if (overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
      }
    } else {
      sidebar.classList.add('sidebar-collapsed');
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'chevron-right');
      if (overlay) {
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 250);
      }
    }
    initIcons();
  },

  toggleLiquidoSubmenu: function() {
    const chk = document.getElementById('chk-liquido');
    const wrapper = document.getElementById('wrapper-liquido-dropdown');
    if (chk && wrapper) {
      if (chk.checked) wrapper.classList.remove('hidden');
      else wrapper.classList.add('hidden');
    }
  },

  toggleDarkMode: function() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('ultrasvet_theme', html.classList.contains('dark') ? 'dark' : 'light');
  },

  marcarComoRascunho: function() {
    const badge = document.getElementById('report-status-badge');
    if (badge && badge.classList.contains('bg-emerald-100')) {
      badge.className = 'shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 transition-colors';
      badge.textContent = 'Rascunho';
    }
  },

  salvarEdicaoManualTexto: function(chave, elemento) {
    if (!elemento) return;
    EstadoApp.textosEditadosManualmente[chave] = elemento.innerHTML;
    this.marcarComoRascunho();
  },

  toggleStatusSalvo: function(forcarSalvo = false) {
    const badge = document.getElementById('report-status-badge');
    if (!badge) return;
    if (forcarSalvo || badge.textContent.trim() === 'Rascunho') {
      badge.className = 'shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors';
      badge.textContent = 'Salvo';
    } else {
      this.marcarComoRascunho();
    }
  },

  handleEspecieChange: function() {
    const especieElem = document.getElementById('p-especie');
    const porte = document.getElementById('p-porte');
    if (!especieElem || !porte) return;
    
    if (especieElem.value === "Felino") porte.value = "Felino";
    else if (porte.value === "Felino") porte.value = "Cão P";
    MotorLaudo.atualizarPaginasLaudo();
  },

  handleSexoChange: function() {
    const sexo = document.getElementById('p-sexo')?.value || 'Macho';
    const statusRepro = document.getElementById('p-statusReprodutivo');
    if (statusRepro) {
      if (sexo === 'Fêmea') {
        statusRepro.options[0].text = 'Castrada';
        statusRepro.options[1].text = 'Não Castrada';
      } else {
        statusRepro.options[0].text = 'Castrado';
        statusRepro.options[1].text = 'Não Castrado';
      }
    }

    Object.keys(EstadoApp.textosEditadosManualmente).forEach(key => {
      if (orgaoEhIncompativelComSexo(key, sexo)) {
        delete EstadoApp.textosEditadosManualmente[key];
      }
    });

    PainelConfigurador.inicializarSeletor();
    MotorLaudo.atualizarPaginasLaudo();
  },

  addNovaRaca: function() {
    const selectRaca = document.getElementById('p-raca');
    if (!selectRaca) return;
    const nova = prompt("Digite o nome da nova raça:");
    if (nova && nova.trim() !== "") {
      const opt = document.createElement('option');
      opt.value = nova.trim();
      opt.text = nova.trim();
      opt.selected = true;
      selectRaca.appendChild(opt);
      MotorLaudo.atualizarPaginasLaudo();
    }
  }
};

const MotorLaudo = {
  atualizarPaginasLaudo: function() {
    AppInterface.marcarComoRascunho();
    const container = document.getElementById('a4WrapperScale');
    if (!container) return;
    container.innerHTML = '';

    const val = id => document.getElementById(id)?.value || '';
    const paciente = val('p-paciente') || 'Não informado';
    const idAnimal = val('p-idAnimal') || '---';
    const especie = val('p-especie') || 'Canino';
    const raca = val('p-raca') || 'SRD (Canino)';
    const sexo = val('p-sexo') || 'Macho';
    const statusReproVal = val('p-statusReprodutivo');
    const tutor = val('p-responsavel') || 'Não informado';
    const clinica = val('p-clinica') || 'Não informada';
    const porte = val('p-porte') || 'Cão P';

    let textoStatusRepro = '';
    if (statusReproVal === 'Castrado') {
      textoStatusRepro = sexo === 'Fêmea' ? 'Castrada' : 'Castrado';
    } else {
      textoStatusRepro = sexo === 'Fêmea' ? 'Não Castrada' : 'Não Castrado';
    }

    const sanitize = s => (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-]/g, "_").trim();
    const nomeArquivoPdf = `Laudo_${sanitize(paciente)}_${sanitize(tutor)}.pdf`;
    
    const labelElem = document.getElementById('label-filename');
    if (labelElem) labelElem.innerText = nomeArquivoPdf;

    let blocosHTML = [];

    if (typeof ModuloPainelPaciente !== 'undefined' && ModuloPainelPaciente.renderizarFicha) {
      blocosHTML.push(
        ModuloPainelPaciente.renderizarFicha(
          paciente, idAnimal, tutor, especie, raca, sexo, 
          textoStatusRepro, val('p-idadeAnos'), val('p-idadeMeses'), 
          porte, val('p-requisitante') || 'Não informado', clinica
        )
      );
    }

    blocosHTML.push(`<div class="a4-section-title">ACHADOS ULTRASSONOGRÁFICOS</div>`);

    Object.entries(CONFIGURACAO_ORGAOS).forEach(([chave, orgao]) => {
      if (orgao.oculto) return;

      const idOrgao = orgao.id || chave;

      if (orgaoEhIncompativelComSexo(idOrgao, sexo)) {
        return;
      }

      const textoCalculado = orgao.gerarTexto(orgao.campos);
      const textoFinal = EstadoApp.textosEditadosManualmente[idOrgao] || textoCalculado;

      let refHtml = '';
      const jaPossuiRef = textoFinal && textoFinal.includes('ref-text');

      if (!jaPossuiRef) {
        if (idOrgao === 'estomago') {
          const med = parseFloat((orgao.campos.medida || '0').toString().replace(',', '.')) || 0;
          const lim = porte === 'Felino' ? 0.25 : (porte === 'Cão G' ? 0.40 : 0.30);
          const alertClass = med > lim ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_estomago', this)">Ref: (${porte}: ${lim.toFixed(2).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'rins') {
          const valE = parseFloat((orgao.campos.rimeMedida || orgao.campos.medidaEsq || '0').toString().replace(',', '.')) || 0;
          const valD = parseFloat((orgao.campos.rimdMedida || orgao.campos.medidaDir || '0').toString().replace(',', '.')) || 0;
          const maxLim = porte === 'Felino' ? 4.3 : (porte === 'Cão G' ? 7.0 : (porte === 'Cão M' ? 5.5 : 4.0));
          const alertClass = (valE > maxLim || valD > maxLim) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_rins', this)">Ref Rins: (${porte} até ${maxLim.toFixed(1).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'vesicula_urinaria') {
          const med = parseFloat((orgao.campos.medidaParedes || orgao.campos.medida || '0').toString().replace(',', '.')) || 0;
          const lim = porte === 'Felino' ? 0.20 : 0.30;
          const alertClass = med > lim ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_vesicula_urinaria', this)">Ref: (${especie}: ${lim.toFixed(2).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'pancreas') {
          const med = parseFloat((orgao.campos.medida || '0').toString().replace(',', '.')) || 0;
          const lim = porte === 'Felino' ? 0.8 : 1.0;
          const alertClass = med > lim ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_pancreas', this)">Ref Pâncreas: (${especie}: ${lim.toFixed(1).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'adrenais') {
          const valE = parseFloat((orgao.campos.aeCaudal || orgao.campos.medidaEsq || '0').toString().replace(',', '.')) || 0;
          const valD = parseFloat((orgao.campos.adCaudal || orgao.campos.medidaDir || '0').toString().replace(',', '.')) || 0;
          const lim = porte === 'Felino' ? 0.45 : 0.58;
          const alertClass = (valE > lim || valD > lim) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_adrenais', this)">Ref Polo Caudal: (${porte}: ${lim.toFixed(2).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'ovarios') {
          const valE = parseFloat((orgao.campos.oeMedida || orgao.campos.medEsq || orgao.campos.medidaEsq || '0').toString().replace(',', '.')) || 0;
          const valD = parseFloat((orgao.campos.odMedida || orgao.campos.medDir || orgao.campos.medidaDir || '0').toString().replace(',', '.')) || 0;
          const alertClass = (valE > 2.0 || valD > 2.0) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_ovarios', this)">Ref Ovários: (${especie}: 2,0cm)</span>`;
        } else if (idOrgao === 'utero') {
          const valE = parseFloat((orgao.campos.medidaEsq || orgao.campos.medEsq || orgao.campos.oeMedida || '0').toString().replace(',', '.')) || 0;
          const valD = parseFloat((orgao.campos.medidaDir || orgao.campos.medDir || orgao.campos.odMedida || '0').toString().replace(',', '.')) || 0;
          const alertClass = (valE > 0.80 || valD > 0.80) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_utero', this)">Ref Útero: (${porte}: 0,50cm - 0,80cm)</span>`;
        } else if (idOrgao === 'prostata') {
          const val1 = parseFloat((orgao.campos.medida1 || orgao.campos.medida || '0').toString().replace(',', '.')) || 0;
          const alertClass = val1 > 2.5 ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_prostata', this)">Ref Próstata: (Até 2,5cm)</span>`;
        }
      }

      if (textoFinal && textoFinal.trim() !== '') {
        blocosHTML.push(`
          <div class="a4-organ-item">
            <div>
              <span class="a4-organ-name" onclick="PainelConfigurador.trocarOrgaoAtivo('${idOrgao}')" title="Configurar ${orgao.nome}">${orgao.nome}:</span> 
              <span class="a4-organ-content" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('${idOrgao}', this)">${textoFinal}</span>
            </div>
            ${refHtml}
          </div>
        `);
      }

      if (orgao.chipsSelecionados && orgao.chipsSelecionados.length > 0) {
        orgao.chipsSelecionados.forEach(chipId => {
          let textoChip = '';
          if (typeof orgao.gerarTextoAchado === 'function') {
            textoChip = orgao.gerarTextoAchado(chipId, orgao.campos);
          }
          if (!textoChip) {
            const chipObj = orgao.chipsPatologias.find(c => c.id === chipId);
            textoChip = chipObj ? chipObj.texto : `Achado de ${chipId} em ${orgao.nome}.`;
          }

          const keyChip = `chip_${idOrgao}_${chipId}`;
          const textoChipFinal = EstadoApp.textosEditadosManualmente[keyChip] || `<strong>[${chipId}]:</strong> ${textoChip}`;

          blocosHTML.push(`
            <div class="achado-adicional-highlight" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('${keyChip}', this)">
              ${textoChipFinal}
            </div>
          `);
        });
      }
    });

    EstadoApp.orgaosAdicionais.forEach(oa => {
      const txtAdicionalFinal = EstadoApp.textosEditadosManualmente[oa.id] || oa.texto;
      blocosHTML.push(`
        <div class="a4-organ-item">
          <div>
            <span class="a4-organ-name" onclick="PainelConfigurador.trocarOrgaoAtivo('${oa.id}')">${oa.nome}:</span> 
            <span class="a4-organ-content" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('${oa.id}', this)">${txtAdicionalFinal}</span>
          </div>
        </div>
      `);
    });

    const isChk = id => document.getElementById(id)?.checked;

    if (isChk('chk-obs-hist')) {
      const txtHist = EstadoApp.textosEditadosManualmente['chk_obs_hist'] || "<b>OBS:</b> A avaliação ultrassonográfica não determina a natureza histológica da estrutura estudada, recomenda-se avaliação citológica e/ou histológica.";
      blocosHTML.push(`<div class="general-phrase-item" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('chk_obs_hist', this)">${txtHist}</div>`);
    }

    if (isChk('chk-linfo') && !CONFIGURACAO_ORGAOS['linfonodos']) {
      const txtLinfo = EstadoApp.textosEditadosManualmente['chk_linfo'] || "Não foram observados sinais sonográficos de alteração/aumento em região topográfica de linfonodos visibilizados.";
      blocosHTML.push(`
        <div class="a4-organ-item">
          <div>
            <span class="a4-organ-name">Linfonodos:</span> 
            <span class="a4-organ-content" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('chk_linfo', this)">${txtLinfo}</span>
          </div>
        </div>
      `);
    }

    if (isChk('chk-liquido')) {
      const v = document.getElementById('sel-liquido-qtd')?.value || 'nenhum';
      let txtLiquido = "Não há evidências sonográficas de líquido livre abdominal.";
      if (v === 'discreta') txtLiquido = "Nota-se discreta quantidade de conteúdo anecogênico livre disperso pela cavidade abdominal.";
      if (v === 'moderada') txtLiquido = "Nota-se moderada quantidade de conteúdo anecogênico livre disperso pela cavidade abdominal.";
      if (v === 'acentuada') txtLiquido = "Nota-se acentuada quantidade de conteúdo anecogênico livre disperso pela cavidade abdominal.";

      const txtLiqFinal = EstadoApp.textosEditadosManualmente['chk_liquido'] || txtLiquido;
      blocosHTML.push(`<div class="general-phrase-item" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('chk_liquido', this)">${txtLiqFinal}</div>`);
    }

    if (isChk('chk-vasos')) {
      const txtVasos = EstadoApp.textosEditadosManualmente['chk_vasos'] || "Não há evidências sonográficas de alterações nas porções visibilizadas dos grandes vasos abdominais.";
      blocosHTML.push(`<div class="general-phrase-item" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('chk_vasos', this)">${txtVasos}</div>`);
    }

    if (EstadoApp.photos.length > 0 && typeof GerenciadorGaleria !== 'undefined' && typeof GerenciadorGaleria.gerarBlocosHTML === 'function') {
      blocosHTML.push(...GerenciadorGaleria.gerarBlocosHTML());
    }

    if (isChk('chk-qualidade')) {
      const txtQual = EstadoApp.textosEditadosManualmente['chk_qualidade'] || "Qualidade técnica do exame pode ser prejudicada devido padrão respiratório / agitação corporal do paciente.";
      blocosHTML.push(`<div class="general-phrase-item" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('chk_qualidade', this)">${txtQual}</div>`);
    }

    if (isChk('chk-valor')) {
      const txtValor = EstadoApp.textosEditadosManualmente['chk_valor'] || "O valor preditivo de qualquer exame de diagnóstico por imagem depende da análise conjunta dos dados clínicos e demais exames do paciente. O laudo fica reservado somente para o ato do exame.";
      blocosHTML.push(`<div class="general-phrase-item" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('chk_valor', this)">${txtValor}</div>`);
    }

    const txtAssinatura1 = EstadoApp.textosEditadosManualmente['sig_nome'] || "Dra. Célia Carolina";
    const txtAssinatura2 = EstadoApp.textosEditadosManualmente['sig_crmv'] || "CRMV 54149";

    blocosHTML.push(`
      <div class="signature-container">
        <div class="signature-line"></div>
        <div class="text-xs font-bold" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('sig_nome', this)">${txtAssinatura1}</div>
        <div class="text-[10px] text-slate-500" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('sig_crmv', this)">${txtAssinatura2}</div>
      </div>
    `);

    let paginas = [];
    function criarNovaPaginaA4() {
      const pageElem = document.createElement('div');
      pageElem.className = 'page-a4';
      pageElem.innerHTML = `
        <div class="page-content"></div>
        <div class="a4-footer">
          <span class="page-num"></span>
        </div>
      `;
      container.appendChild(pageElem);
      paginas.push(pageElem);
      return pageElem.querySelector('.page-content');
    }

    let currentContent = criarNovaPaginaA4();

    blocosHTML.forEach((htmlBloco) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlBloco;
      const elem = tempDiv.firstElementChild;

      currentContent.appendChild(elem);

      if (currentContent.scrollHeight > currentContent.clientHeight) {
        currentContent.removeChild(elem);
        currentContent = criarNovaPaginaA4();
        currentContent.appendChild(elem);
      }
    });

    const totalPaginas = paginas.length;
    paginas.forEach((pageElem, idx) => {
      const pageNumSpan = pageElem.querySelector('.page-num');
      if (pageNumSpan) { pageNumSpan.textContent = `Página ${idx + 1} de ${totalPaginas}`; }
    });

    initIcons();
    ControleZoom.aplicarEscala();
  }
};

// =========================================================
// SALVAR E CARREGAR NA NUVEM (FIRESTORE)
// =========================================================
async function salvarLaudoAtualNaGaleria() {
  const val = id => document.getElementById(id)?.value || '';
  const paciente = val('p-paciente') || 'Paciente';
  const prontuario = val('p-idAnimal') || '---';
  const especie = val('p-especie') || 'Canino';
  const raca = val('p-raca') || 'SRD';
  const tutor = val('p-responsavel') || '';
  const clinica = val('p-clinica') || '';
  
  const paginasA4 = document.querySelectorAll('.page-a4');
  let conteudoHtml = '';
  let resumoTexto = '';
  
  if (paginasA4.length > 0) {
    paginasA4.forEach(pagina => {
      conteudoHtml += `<div class="page-a4 mb-6">${pagina.innerHTML}</div>`;
      resumoTexto += pagina.innerText + '\n';
    });
  } else {
    const wrapper = document.getElementById('a4WrapperScale');
    conteudoHtml = wrapper ? wrapper.innerHTML : '';
    resumoTexto = wrapper ? wrapper.innerText : '';
  }

  const urlParams = new URLSearchParams(window.location.search);
  const idUrl = urlParams.get('editar');

  const dadosLaudo = {
    paciente,
    prontuario,
    especie,
    raca,
    tutor,
    clinica,
    dataExame: new Date().toISOString(),
    estado: 'Salvo',
    conteudoHtml,
    resumoTexto
  };

  try {
    const { collection, addDoc, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    if (idUrl) {
      const docRef = doc(window.db, "laudos", idUrl);
      await setDoc(docRef, dadosLaudo, { merge: true });
    } else {
      await addDoc(collection(window.db, "laudos"), dadosLaudo);
    }

    if (typeof AppInterface !== 'undefined' && typeof AppInterface.toggleStatusSalvo === 'function') {
      AppInterface.toggleStatusSalvo(true);
    }

    alert('Laudo salvo e sincronizado na nuvem com sucesso!');
  } catch (error) {
    console.error("Erro ao salvar no Firebase:", error);
    alert('Erro ao salvar na nuvem. Verifique a ligação à internet.');
  }
}

async function carregarLaudoParaEdicao() {
  const idUrl = new URLSearchParams(window.location.search).get('editar');
  if (!idUrl) return;

  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const docRef = doc(window.db, "laudos", idUrl);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const laudo = docSnap.data();
      const setVal = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = v; };

      setVal('p-paciente', laudo.paciente);
      setVal('p-idAnimal', laudo.prontuario);
      setVal('p-especie', laudo.especie);
      setVal('p-raca', laudo.raca);
      setVal('p-responsavel', laudo.tutor);
      setVal('p-clinica', laudo.clinica);

      AppInterface.toggleStatusSalvo(true);
    }
  } catch (error) {
    console.error("Erro ao carregar laudo para edição:", error);
  }
}

async function sharePdf() {
  const container = document.getElementById('a4WrapperScale');
  if (!container) return;

  const filename = document.getElementById('label-filename')?.innerText || 'Laudo_UltrasVet.pdf';

  try {
    const clone = container.cloneNode(true);
    clone.querySelectorAll('.no-print, .delete-photo-btn').forEach(el => el.remove());

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.background = '#ffffff';
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    const opt = {
      margin: [0, 0, 0, 0],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
      await html2pdf().set(opt).from(clone).save();
    } else {
      window.print();
    }

    if (tempContainer.parentNode) {
      document.body.removeChild(tempContainer);
    }
  } catch (err) {
    console.warn("Alternando para impressão nativa:", err);
    window.print();
  }
}

// =========================================================
// CONTROLO DE ZOOM E GESTOS TOUCH (PINCH, DOUBLE TAP & SWIPE)
// =========================================================
const ControleZoom = {
  escala: 1.0,
  
  obterEscalaInicial: function() {
    const larguraScren = window.innerWidth;
    const larguraA4Px = 794; 

    if (larguraScren < 1024) {
      const escalaIdeal = (larguraScren - 16) / larguraA4Px;
      return Math.max(0.35, Math.min(0.80, escalaIdeal));
    }
    return 1.0;
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
    this.escala = Math.min(2.0, this.escala + 0.1);
    this.aplicarEscala();
  },
  
  zoomOut: function() {
    this.escala = Math.max(0.30, this.escala - 0.1);
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

function inicializarGestosTouchAvancados() {
  const container = document.getElementById('previewContainer');
  const sidebar = document.getElementById('appSidebar');

  let distInicial = 0;
  let escalaInicialPinch = 1.0;
  let ultimoToqueTempo = 0;

  // 1. Pinch-to-zoom com 2 dedos e Double Tap na área do laudo
  if (container) {
    container.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        distInicial = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        escalaInicialPinch = ControleZoom.escala;
      } else if (e.touches.length === 1) {
        const tempoAtual = new Date().getTime();
        const tempoDiff = tempoAtual - ultimoToqueTempo;
        if (tempoDiff < 300 && tempoDiff > 0) {
          e.preventDefault();
          if (ControleZoom.escala < 0.9) {
            ControleZoom.escala = 1.0;
          } else {
            ControleZoom.escala = ControleZoom.obterEscalaInicial();
          }
          ControleZoom.aplicarEscala();
        }
        ultimoToqueTempo = tempoAtual;
      }
    }, { passive: false });

    container.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2 && distInicial > 0) {
        const distAtual = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const fator = distAtual / distInicial;
        let novaEscala = escalaInicialPinch * fator;
        novaEscala = Math.max(0.30, Math.min(2.0, novaEscala));

        ControleZoom.escala = novaEscala;
        ControleZoom.aplicarEscala();
      }
    }, { passive: true });

    container.addEventListener('touchend', function(e) {
      if (e.touches.length < 2) distInicial = 0;
    }, { passive: true });
  }

  // 2. Gesto Swipe para fechar o menu lateral arrastando para a esquerda
  if (sidebar) {
    let touchStartX = 0;
    let touchStartY = 0;

    sidebar.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    sidebar.addEventListener('touchend', function(e) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);

      // Se arrastou para a esquerda (mais de 30px) dentro do menu lateral, fecha-o
      if (diffX > 30 && diffY < 150) {
        if (window.innerWidth < 1024) {
          AppInterface.setPainelAberto(false);
        }
      }
    }, { passive: true });
  }
}

document.addEventListener('mousedown', function(e) {
  const isInputOrInteractive = e.target.closest('input, select, textarea, button, [contenteditable="true"], option, label');
  const previewContainer = document.getElementById('previewContainer');
  const insidePageA4 = e.target.closest('.page-a4');

  if (!isInputOrInteractive) {
    if (e.target.closest('#previewContainer') && !insidePageA4) {
      e.preventDefault();
      if (document.activeElement) document.activeElement.blur();
      window.getSelection()?.removeAllRanges();
      if (previewContainer) previewContainer.focus();
    } else if (e.target.closest('#topTabBar, header, aside#appSidebar')) {
      if (document.activeElement && document.activeElement.tagName !== 'BODY') {
        document.activeElement.blur();
      }
      window.getSelection()?.removeAllRanges();
      if (previewContainer) previewContainer.focus();
    }
  }
});

window.addEventListener('resize', () => ControleZoom.ajustarZoomInicial());

window.onload = function() {
  const savedTheme = localStorage.getItem('ultrasvet_theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  if (window.CONFIGURACAO_ORGAOS) {
    Object.keys(CONFIGURACAO_ORGAOS).forEach(key => {
      const item = EstadoApp.itensLaudoTemplate.find(i => i.id === key);
      if (item && CONFIGURACAO_ORGAOS[key]) {
        item.texto = CONFIGURACAO_ORGAOS[key].gerarTexto(CONFIGURACAO_ORGAOS[key].campos);
      }
    });
  }

  carregarLaudoParaEdicao();
  PainelConfigurador.inicializarSeletor();
  if (typeof GerenciadorGaleria !== 'undefined' && GerenciadorGaleria.atualizarSidebar) {
    GerenciadorGaleria.atualizarSidebar();
  }

  // Oculta o menu por defeito em ecrãs de telemóveis e tablets (< 1024px)
  if (window.innerWidth < 1024) {
    AppInterface.setPainelAberto(false);
  }

  MotorLaudo.atualizarPaginasLaudo();
  ControleZoom.ajustarZoomInicial();
  inicializarGestosTouchAvancados();
};
