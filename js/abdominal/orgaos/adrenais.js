window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.adrenais = {
  id: 'adrenais',
  nome: 'Glândulas Adrenais',
  icone: '🧬',
  oculto: false,

  // Submenus recolhidos por padrão
  menuAeAberto: false,
  menuAdAberto: false,

  campos: {
    naoCaracterizadas: false,
    simetria: 'simétricas',
    
    // Medidas Adrenal Esquerda (AE)
    aeComp: '0,00',
    aeCranial: '0,00',
    aeCaudal: '0,00',
    aeDimensao: 'normais',

    // Medidas Adrenal Direita (AD)
    adComp: '0,00',
    adCranial: '0,00',
    adCaudal: '0,00',
    adDimensao: 'normais',

    // Configuração Geral do Achado Nodular
    noduloQtd: 'singular',
    noduloEco: 'hipoecogênica',
    
    // 1º Nódulo
    noduloLado1: 'esquerda',
    noduloPolo1: 'cranial',
    noduloMedida1Comp: '0,0',
    noduloMedida1Esp: '0,0',

    // 2º Nódulo
    temSegundoNodulo: false,
    noduloLado2: 'direita',
    noduloPolo2: 'caudal',
    noduloMedida2Comp: '0,0',
    noduloMedida2Esp: '0,0'
  },

  options: {
    simetria: [
      { value: 'simétricas', label: 'simétricas' },
      { value: 'assimétricas', label: 'assimétricas' }
    ],
    aeDimensao: [
      { value: 'normais', label: 'normais' },
      { value: 'aumentadas', label: 'aumentadas' }
    ],
    adDimensao: [
      { value: 'normais', label: 'normais' },
      { value: 'aumentadas', label: 'aumentadas' }
    ],
    noduloQtd: [
      { value: 'singular', label: 'estrutura nodular (Singular)' },
      { value: 'plural', label: 'estruturas nodulares (Plural)' }
    ],
    noduloEco: [
      { value: 'hipoecogênica', label: 'hipoecogênica' },
      { value: 'ecogênica', label: 'ecogênica' }
    ],
    noduloPolo: [
      { value: 'cranial', label: 'cranial' },
      { value: 'caudal', label: 'caudal' },
      { value: 'caudal e cranial', label: 'caudal e cranial' }
    ],
    noduloLado: [
      { value: 'esquerda', label: 'Esquerda' },
      { value: 'direita', label: 'Direita' }
    ]
  },

  labels: {
    aeComp: 'AE Comprimento (cm)',
    aeCranial: 'AE Polo Cranial (cm)',
    aeCaudal: 'AE Polo Caudal (cm)',
    adComp: 'AD Comprimento (cm)',
    adCranial: 'AD Polo Cranial (cm)',
    adCaudal: 'AD Polo Caudal (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { id: 'AchadoNodular', rotulo: 'Achado Nodular', texto: '' },
    { id: 'NotaHistologica', rotulo: 'Nota Histológica', texto: '' }
  ],

  toggleSubmenu: function(lado) {
    if (lado === 'ae') {
      this.menuAeAberto = !this.menuAeAberto;
    } else if (lado === 'ad') {
      this.menuAdAberto = !this.menuAdAberto;
    }
    PainelConfigurador.renderizar();
  },

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    // Ajusta o lado do 2º nódulo por conveniência quando o 1º muda
    if (campo === 'noduloLado1') {
      this.campos.noduloLado2 = valor === 'esquerda' ? 'direita' : 'esquerda';
    }

    // Se mudar a quantidade para plural, ativa automaticamente o segundo nódulo
    if (campo === 'noduloQtd') {
      this.campos.temSegundoNodulo = (valor === 'plural');
    }

    this.validarMedidasEAutopreencher();
  },

  validarMedidasEAutopreencher: function() {
    const valEsqCaudalStr = (this.campos.aeCaudal || '0').toString().trim().replace(',', '.');
    const valDirCaudalStr = (this.campos.adCaudal || '0').toString().trim().replace(',', '.');

    const valEsqCaudal = parseFloat(valEsqCaudalStr) || 0;
    const valDirCaudal = parseFloat(valDirCaudalStr) || 0;
    const maxLimit = 0.58; // Referência cão até 10kg

    if (valEsqCaudalStr !== '0,00' && valEsqCaudalStr !== '0') {
      this.campos.aeDimensao = valEsqCaudal > maxLimit ? 'aumentadas' : 'normais';
    }
    if (valDirCaudalStr !== '0,00' && valDirCaudalStr !== '0') {
      this.campos.adDimensao = valDirCaudal > maxLimit ? 'aumentadas' : 'normais';
    }

    if (valEsqCaudal > 0 && valDirCaudal > 0) {
      const maior = Math.max(valEsqCaudal, valDirCaudal);
      const menor = Math.min(valEsqCaudal, valDirCaudal);
      const dif = ((maior - menor) / menor) * 100;
      this.campos.simetria = dif > 10 ? 'assimétricas' : 'simétricas';
    } else {
      this.campos.simetria = 'simétricas';
    }
  },

  gerarTexto: function(c) {
    if (c.naoCaracterizadas) {
      return 'não caracterizadas neste exame.';
    }

    let txt = `tópicas, ${c.simetria}.<br>`;
    txt += `• <b>AE:</b> ${c.aeComp}cm x ${c.aeCranial}cm x ${c.aeCaudal}cm (de dimensões ${c.aeDimensao})<br>`;
    txt += `• <b>AD:</b> ${c.adComp}cm x ${c.adCranial}cm x ${c.adCaudal}cm (de dimensões ${c.adDimensao})<br>`;
    txt += `<span class="text-[11px] text-slate-500 italic font-mono display:block mt-0.5">(comprimento x espessura do polo cranial x espessura do polo caudal)</span><br>`;
    txt += `Contornos regulares, ecogenicidade mantida e ecotextura homogênea.`;

    if (c.aeDimensao === 'aumentadas' && c.adDimensao === 'aumentadas') {
      txt += ` <span style="font-weight: 500; color: #b45309;">(Sugestivo de hiperplasia glandular/endocrinopatia)</span>`;
    } else if (c.aeDimensao === 'aumentadas' || c.adDimensao === 'aumentadas') {
      txt += ` <span style="font-weight: 500; color: #b45309;">(Hiperplasia glandular / endocrinopatia? À esclarecer, sugere-se correlacionar ao demais exames e achados clínicos do paciente)</span>`;
    }

    return txt;
  },

  gerarTextoAchado: function(chipId, c) {
    if (chipId === 'AchadoNodular') {
      const isPlural = c.noduloQtd === 'plural' || c.temSegundoNodulo;
      const termEstrutura = isPlural ? 'estruturas nodulares' : 'estrutura nodular';
      
      let termEco = c.noduloEco;
      if (isPlural) {
        termEco = c.noduloEco === 'ecogênica' ? 'ecogênicas' : 'hipoecogênicas';
      }

      const termHomo = isPlural ? 'homogêneas' : 'homogênea';
      const termLoc = isPlural ? 'localizadas' : 'localizada';
      const lblLado1 = c.noduloLado1 === 'esquerda' ? 'esq' : 'dir';

      let txt = `Nota-se presença de ${termEstrutura}, de contornos definidos e regulares, ${termEco} e ${termHomo}, ${termLoc} em polo ${c.noduloPolo1} da adrenal ${c.noduloLado1} medindo cerca de ${c.noduloMedida1Comp} cm x ${c.noduloMedida1Esp} cm (${lblLado1})`;

      if (isPlural) {
        const lblLado2 = c.noduloLado2 === 'esquerda' ? 'esq' : 'dir';
        txt += ` e em polo ${c.noduloPolo2} da adrenal ${c.noduloLado2} medindo cerca de ${c.noduloMedida2Comp} cm x ${c.noduloMedida2Esp} cm (${lblLado2})`;
      }

      txt += ` (Imagens ultrassonográficas que sugerem nódulo hiperplásico).`;
      return txt;
    }

    if (chipId === 'NotaHistologica') {
      return `<b>OBS:</b> A avaliação ultrassonográfica não determina a natureza histológica da estrutura estudada, para maiores informações, recomenda-se avaliação citológica e/ou histológica.`;
    }

    return '';
  },

  renderCamposCustomizados: function() {
    const isNaoCarac = this.campos.naoCaracterizadas;

    let html = `
      <div class="space-y-3">
        <div class="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50">
          <label class="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400 cursor-pointer">
            <input type="checkbox" ${isNaoCarac ? 'checked' : ''} 
                   onchange="PainelConfigurador.atualizarCampo('adrenais', 'naoCaracterizadas', this.checked)" 
                   class="accent-red-600 w-4 h-4 rounded">
            <span>Não Caracterizadas Neste Exame</span>
          </label>
        </div>
    `;

    if (!isNaoCarac) {
      html += `
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Simetria</label>
          <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'simetria', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.simetria.map(opt => `<option value="${opt.value}" ${this.campos.simetria === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>

        <!-- SUBMENU SANFONADO ADRENAL ESQUERDA (AE) -->
        <div class="border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-800/40">
          <button type="button" 
                  onclick="CONFIGURACAO_ORGAOS.adrenais.toggleSubmenu('ae')" 
                  class="w-full px-3 py-2.5 bg-slate-100 dark:bg-zinc-800 flex items-center justify-between font-bold text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700/70 transition-colors">
            <span class="font-bold">Adrenal Esquerda (AE)</span>
            <i data-lucide="${this.menuAeAberto ? 'chevron-up' : 'chevron-down'}" class="w-4 h-4 text-slate-400"></i>
          </button>

          ${this.menuAeAberto ? `
            <div class="p-3 space-y-2 border-t border-slate-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/50">
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase">Comp. (cm)</label>
                  <input type="text" value="${this.campos.aeComp}" 
                         onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                         onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'aeComp', '0,00')"
                         oninput="PainelConfigurador.atualizarCampo('adrenais', 'aeComp', this.value)" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase">Cranial (cm)</label>
                  <input type="text" value="${this.campos.aeCranial}" 
                         onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                         onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'aeCranial', '0,00')"
                         oninput="PainelConfigurador.atualizarCampo('adrenais', 'aeCranial', this.value)" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase">Caudal (cm)</label>
                  <input type="text" value="${this.campos.aeCaudal}" 
                         onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                         onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'aeCaudal', '0,00')"
                         oninput="PainelConfigurador.atualizarCampo('adrenais', 'aeCaudal', this.value)" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono font-bold text-emerald-600">
                </div>
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase mt-1">Dimensão AE</label>
                <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'aeDimensao', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
                  ${this.options.aeDimensao.map(opt => `<option value="${opt.value}" ${this.campos.aeDimensao === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- SUBMENU SANFONADO ADRENAL DIREITA (AD) -->
        <div class="border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-800/40">
          <button type="button" 
                  onclick="CONFIGURACAO_ORGAOS.adrenais.toggleSubmenu('ad')" 
                  class="w-full px-3 py-2.5 bg-slate-100 dark:bg-zinc-800 flex items-center justify-between font-bold text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700/70 transition-colors">
            <span class="font-bold">Adrenal Direita (AD)</span>
            <i data-lucide="${this.menuAdAberto ? 'chevron-up' : 'chevron-down'}" class="w-4 h-4 text-slate-400"></i>
          </button>

          ${this.menuAdAberto ? `
            <div class="p-3 space-y-2 border-t border-slate-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/50">
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase">Comp. (cm)</label>
                  <input type="text" value="${this.campos.adComp}" 
                         onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                         onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'adComp', '0,00')"
                         oninput="PainelConfigurador.atualizarCampo('adrenais', 'adComp', this.value)" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase">Cranial (cm)</label>
                  <input type="text" value="${this.campos.adCranial}" 
                         onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                         onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'adCranial', '0,00')"
                         oninput="PainelConfigurador.atualizarCampo('adrenais', 'adCranial', this.value)" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase">Caudal (cm)</label>
                  <input type="text" value="${this.campos.adCaudal}" 
                         onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                         onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'adCaudal', '0,00')"
                         oninput="PainelConfigurador.atualizarCampo('adrenais', 'adCaudal', this.value)" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono font-bold text-emerald-600">
                </div>
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase mt-1">Dimensão AD</label>
                <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'adDimensao', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
                  ${this.options.adDimensao.map(opt => `<option value="${opt.value}" ${this.campos.adDimensao === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // ACHADO NODULAR DETALHADO
    if (this.chipsSelecionados.includes('AchadoNodular')) {
      const isPlural = this.campos.noduloQtd === 'plural';
      const exibeSegundoNodulo = isPlural || this.campos.temSegundoNodulo;

      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-3 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Configurar Nódulo Adrenal</span>
          
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quantidade</label>
              <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'noduloQtd', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
                ${this.options.noduloQtd.map(opt => `<option value="${opt.value}" ${this.campos.noduloQtd === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade</label>
              <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'noduloEco', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
                ${this.options.noduloEco.map(opt => `<option value="${opt.value}" ${this.campos.noduloEco === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- BLOCO DO 1º NÓDULO -->
          <div class="p-2.5 bg-white dark:bg-zinc-900/80 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
            <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">1º Nódulo</span>
            
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Adrenal</label>
                <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'noduloLado1', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
                  ${this.options.noduloLado.map(opt => `<option value="${opt.value}" ${this.campos.noduloLado1 === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Polo</label>
                <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'noduloPolo1', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
                  ${this.options.noduloPolo.map(opt => `<option value="${opt.value}" ${this.campos.noduloPolo1 === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Comp. 1º Nódulo (cm)</label>
                <input type="text" value="${this.campos.noduloMedida1Comp}" 
                       onfocus="if(this.value==='0,0')this.value=''" 
                       onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'noduloMedida1Comp', '0,0')"
                       oninput="PainelConfigurador.atualizarCampo('adrenais', 'noduloMedida1Comp', this.value)" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Esp. 1º Nódulo (cm)</label>
                <input type="text" value="${this.campos.noduloMedida1Esp}" 
                       onfocus="if(this.value==='0,0')this.value=''" 
                       onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'noduloMedida1Esp', '0,0')"
                       oninput="PainelConfigurador.atualizarCampo('adrenais', 'noduloMedida1Esp', this.value)" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
            </div>
          </div>

          <!-- OPÇÃO MANUAL PARA ADICIONAR 2º NÓDULO NO SINGULAR -->
          ${!isPlural ? `
            <div class="pt-1">
              <label class="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 cursor-pointer">
                <input type="checkbox" ${this.campos.temSegundoNodulo ? 'checked' : ''} 
                       onchange="PainelConfigurador.atualizarCampo('adrenais', 'temSegundoNodulo', this.checked)" 
                       class="accent-emerald-600 w-4 h-4 rounded">
                <span>Adicionar 2º Nódulo</span>
              </label>
            </div>
          ` : ''}

          <!-- BLOCO DO 2º NÓDULO -->
          ${exibeSegundoNodulo ? `
            <div class="p-2.5 bg-white dark:bg-zinc-900/80 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
              <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">2º Nódulo</span>
              
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Adrenal</label>
                  <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'noduloLado2', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
                    ${this.options.noduloLado.map(opt => `<option value="${opt.value}" ${this.campos.noduloLado2 === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Polo</label>
                  <select onchange="PainelConfigurador.atualizarCampo('adrenais', 'noduloPolo2', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
                    ${this.options.noduloPolo.map(opt => `<option value="${opt.value}" ${this.campos.noduloPolo2 === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Comp. 2º Nódulo (cm)</label>
                  <input type="text" value="${this.campos.noduloMedida2Comp}" 
                         onfocus="if(this.value==='0,0')this.value=''" 
                         onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'noduloMedida2Comp', '0,0')"
                         oninput="PainelConfigurador.atualizarCampo('adrenais', 'noduloMedida2Comp', this.value)" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Esp. 2º Nódulo (cm)</label>
                  <input type="text" value="${this.campos.noduloMedida2Esp}" 
                         onfocus="if(this.value==='0,0')this.value=''" 
                         onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('adrenais', 'noduloMedida2Esp', '0,0')"
                         oninput="PainelConfigurador.atualizarCampo('adrenais', 'noduloMedida2Esp', this.value)" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }
};