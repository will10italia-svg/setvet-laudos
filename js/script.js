/**
 * Setvet - Sistema Diagnóstico & Confecção de Laudo
 * Arquivo: script.js (Código Principal Completo e Corrigido)
 */

function initIcons() { 
  if (window.lucide) lucide.createIcons(); 
}

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

function orgaoEhIncompativelComSexo(idOrgao, sexoAtual) {
  return false; 
}

const PainelConfigurador = {
  inicializarSeletor: function() {
    const select = document.getElementById('seletor-orgao-ativo');
    if (!select) return;

    const orgaosCompativeis = Object.entries(CONFIGURACAO_ORGAOS);
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
    const nome = prompt("Nome da nova estrutura/órgão:");
    if (!nome || nome.trim() === '') return;

    const id = 'adicional_' + Date.now();
    EstadoApp.orgaosAdicionais.push({ id, nome: nome.trim(), texto: 'Sem alterações dignas de nota.' });
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
          <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">${orgao.icone || '🩺'}</div>
          <div>
            <h3 class="text-xs font-bold text-emerald-900 dark:text-emerald-300">Editar: ${orgao.nome}</h3>
            <p class="text-[10px] text-emerald-700 dark:text-emerald-400">Parâmetros e patologias</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="PainelConfigurador.resetar('${orgao.id}')" class="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3 h-3"></i> Resetar</button>
          <span class="text-slate-300 dark:text-zinc-600">|</span>
          <button onclick="PainelConfigurador.toggleOcultar('${orgao.id}')" class="text-[10px] font-bold ${orgao.oculto ? 'text-emerald-600' : 'text-red-600'} hover:underline flex items-center gap-1"><i data-lucide="${orgao.oculto ? 'eye' : 'eye-off'}" class="w-3 h-3"></i> <span>${orgao.oculto ? 'Exibir' : 'Ocultar'}</span></button>
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
          html += `<div class="p-2.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700"><label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer"><input type="checkbox" ${val ? 'checked' : ''} onchange="PainelConfigurador.atualizarCampo('${orgao.id}', '${campoKey}', this.checked)" class="accent-emerald-600 w-4 h-4 rounded"><span>${label}</span></label></div>`;
        } else if (orgao.options && orgao.options[campoKey]) {
          const opts = orgao.options[campoKey];
          html += `<div><label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${label}</label><select onchange="PainelConfigurador.atualizarCampo('${orgao.id}', '${campoKey}', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">${opts.map(opt => { const optVal = typeof opt === 'object' ? opt.value : opt; const optLabel = typeof opt === 'object' ? opt.label : opt; return `<option value="${optVal}" ${val === optVal ? 'selected' : ''}>${optLabel}</option>`; }).join('')}</select></div>`;
        } else if (typeof val === 'string') {
          html += `<div><label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${label}</label><input type="text" value="${val}" oninput="PainelConfigurador.atualizarCampo('${orgao.id}', '${campoKey}', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200"></div>`;
        }
      });
    }
    html += `</div>`;

    if (orgao.chipsPatologias && orgao.chipsPatologias.length > 0) {
      html += `<div class="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800"><label class="block text-[11px] font-bold text-slate-600 dark:text-zinc-300">Achados Adicionais / Patologias</label><div class="flex flex-wrap gap-1.5">${orgao.chipsPatologias.map(chip => { const isSel = orgao.chipsSelecionados.includes(chip.id); return `<button type="button" onclick="PainelConfigurador.toggleChip('${orgao.id}', '${chip.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${isSel ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200' : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200'}">${isSel ? '✓ ' : '+ '} ${chip.rotulo}</button>`; }).join('')}</div></div>`;
    }

    html += `<div class="pt-2"><button type="button" onclick="PainelConfigurador.aplicarESalvar('${orgao.id}')" class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"><i data-lucide="check-check" class="w-4 h-4"></i><span>Aplicar e Salvar ${orgao.nome}</span></button></div>`;
    container.innerHTML = html;
    initIcons();
    if (typeof orgao.onInit === 'function') setTimeout(() => orgao.onInit(), 10);
  },

  atualizarTextoAdicional: function(id, val) {
    const o = EstadoApp.orgaosAdicionais.find(x => x.id === id);
    if (o) { o.texto = val; delete EstadoApp.textosEditadosManualmente[id]; AppInterface.marcarComoRascunho(); MotorLaudo.atualizarPaginasLaudo(); }
  },

  atualizarCampo: function(orgaoId, campo, valor) {
    const orgao = CONFIGURACAO_ORGAOS[orgaoId];
    if (!orgao) return;
    if (typeof orgao.onFieldChange === 'function') orgao.onFieldChange(campo, valor);
    else orgao.campos[campo] = valor;
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
    if (item) { item.texto = orgao.gerarTexto(orgao.campos); item.oculto = false; }
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
    if (EstadoApp.tabAtiva === tabId && EstadoApp.painelAberto) { this.togglePanelCollapse(); return; }
    if (!EstadoApp.painelAberto) this.setPainelAberto(true);
    EstadoApp.tabAtiva = tabId;
    this.atualizarEstiloBotoesAba(tabId);
    document.querySelectorAll('.tab-panel-body').forEach(panel => panel.classList.add('hidden'));
    const activePanel = document.getElementById(`tab-content-${tabId}`);
    if (activePanel) activePanel.classList.remove('hidden');
    if (tabId === 'figado') PainelConfigurador.inicializarSeletor();
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
    if (!sidebar) return;
    if (aberto) {
      sidebar.classList.remove('sidebar-collapsed');
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'chevron-left');
    } else {
      sidebar.classList.add('sidebar-collapsed');
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'chevron-right');
    }
    initIcons();
  },

  toggleLiquidoSubmenu: function() {
    const chk = document.getElementById('chk-liquido');
    const wrapper = document.getElementById('wrapper-liquido-dropdown');
    if (chk && wrapper) { if (chk.checked) wrapper.classList.remove('hidden'); else wrapper.classList.add('hidden'); }
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
    PainelConfigurador.renderizar();
    MotorLaudo.atualizarPaginasLaudo();
  },

  handlePorteChange: function() {
    PainelConfigurador.renderizar();
    MotorLaudo.atualizarPaginasLaudo();
  },

  handleSexoChange: function() {
    const sexo = document.getElementById('p-sexo')?.value || '';
    const statusRepro = document.getElementById('p-statusReprodutivo');
    if (statusRepro) {
      if (sexo === 'Fêmea') { statusRepro.options[0].text = 'Castrada'; statusRepro.options[1].text = 'Não Castrada'; }
      else { statusRepro.options[0].
