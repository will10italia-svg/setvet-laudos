window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.ovarios = {
  id: 'ovarios',
  nome: 'Ovários',
  icone: '🧬',
  oculto: false,

  campos: {
    naoCaracterizados: false,
    simetria: 'simétricos',
    
    // Ovário Esquerdo
    oeDimensoes: 'normais',
    oeMedida: '0,00',

    // Ovário Direito
    odDimensoes: 'normais',
    odMedida: '0,00',

    // Aspecto Geral
    contornos: 'regulares',
    ecogenicidade: 'mantida',
    ecotextura: 'homogênea',

    // Achado: Cisto / Folículo
    cistoLocal: 'ovário esquerdo',
    cistoMedidaEsq: '0,00',
    cistoMedidaDir: '0,00'
  },

  options: {
    simetria: [
      { value: 'simétricos', label: 'simétricos' },
      { value: 'assimétricos', label: 'assimétricos' }
    ],
    dimensoes: [
      { value: 'normais', label: 'normais' },
      { value: 'aumentadas', label: 'aumentadas' }
    ],
    contornos: [
      { value: 'regulares', label: 'regulares' },
      { value: 'irregulares', label: 'irregulares' }
    ],
    ecogenicidade: [
      { value: 'mantida', label: 'mantida' },
      { value: 'alterada', label: 'alterada' }
    ],
    ecotextura: [
      { value: 'homogênea', label: 'homogênea' },
      { value: 'heterogênea', label: 'heterogênea' }
    ],
    cistoLocalOpcoes: [
      { value: 'ovário esquerdo', label: 'ovário esquerdo' },
      { value: 'ovário direito', label: 'ovário direito' },
      { value: 'ovário esquerdo e direito', label: 'ovário esquerdo e direito' }
    ]
  },

  labels: {
    oeMedida: 'Eixo Long. Ovário Esquerdo (cm)',
    odMedida: 'Eixo Long. Ovário Direito (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { id: 'CistoFoliculo', rotulo: 'Cisto / Folículo', texto: '' }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    if (campo === 'oeMedida' || campo === 'odMedida') {
      this.validarMedidasEAutopreencher();
    }

    if (campo === 'cistoLocal' || campo === 'naoCaracterizados') {
      PainelConfigurador.renderizar();
    }
  },

  validarMedidasEAutopreencher: function() {
    const valEStr = (this.campos.oeMedida || '0').toString().trim().replace(',', '.');
    const valDStr = (this.campos.odMedida || '0').toString().trim().replace(',', '.');

    const valE = parseFloat(valEStr) || 0;
    const valD = parseFloat(valDStr) || 0;
    const maxLimit = 2.0; // Ref Ovário Cão: 2.0 cm

    if (valEStr !== '0,00' && valEStr !== '0') {
      this.campos.oeDimensoes = valE > maxLimit ? 'aumentadas' : 'normais';
    }
    if (valDStr !== '0,00' && valDStr !== '0') {
      this.campos.odDimensoes = valD > maxLimit ? 'aumentadas' : 'normais';
    }

    if (valE > 0 && valD > 0) {
      const maior = Math.max(valE, valD);
      const menor = Math.min(valE, valD);
      const dif = ((maior - menor) / menor) * 100;
      this.campos.simetria = dif > 10 ? 'assimétricos' : 'simétricos';
    } else {
      this.campos.simetria = 'simétricos';
    }
  },

  gerarTexto: function(c) {
    if (c.naoCaracterizados) {
      return 'não caracterizados neste exame.';
    }

    const valE = parseFloat((c.oeMedida || '0').replace(',', '.')) || 0;
    const valD = parseFloat((c.odMedida || '0').replace(',', '.')) || 0;
    const isAlerta = valE > 2.0 || valD > 2.0;
    const classeRef = isAlerta ? 'ref-text alerta-vermelho' : 'ref-text';

    let txt = `tópicos e ${c.simetria}<br>`;
    txt += `• Ovário esquerdo: de dimensões ${c.oeDimensoes} medindo ${c.oeMedida} cm em eixo longitudinal<br>`;
    txt += `• Ovário direito: de dimensões ${c.odDimensoes} medindo ${c.odMedida} cm em eixo longitudinal<br>`;
    txt += `<div class="${classeRef}"><span>Ref Ovários: (Cão: 2,0cm)</span></div>`;
    txt += `Contornos ${c.contornos}, ecogenicidade ${c.ecogenicidade} e ecotextura ${c.ecotextura}.`;

    if (this.chipsSelecionados.includes('CistoFoliculo')) {
      const isPlural = c.cistoLocal === 'ovário esquerdo e direito';
      const termoEst = isPlural ? 'estruturas' : 'estrutura';
      const termoEco = isPlural ? 'anecogênicas e homogêneas' : 'anecogênica e homogênea';

      let medidas = isPlural
        ? `esquerdo: ${c.cistoMedidaEsq} cm e direito: ${c.cistoMedidaDir} cm`
        : `${c.cistoMedidaEsq} cm`;

      txt += `<br><br>Observa-se ${termoEst} arredondada, de contornos definidos e pouco irregulares, paredes finas, ${termoEco}, localizada em ${c.cistoLocal} e medindo ${medidas} (Pode estar relacionado a cisto ou folículo).`;
    }

    return txt;
  },

  renderCamposCustomizados: function() {
    const isNaoCarac = this.campos.naoCaracterizados;

    let html = `
      <div class="space-y-3">
        <!-- CHECKBOX NÃO CARACTERIZADOS -->
        <div class="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50">
          <label class="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400 cursor-pointer">
            <input type="checkbox" ${isNaoCarac ? 'checked' : ''} 
                   onchange="PainelConfigurador.atualizarCampo('ovarios', 'naoCaracterizados', this.checked)" 
                   class="accent-red-600 w-4 h-4 rounded">
            <span>Não Caracterizados Neste Exame</span>
          </label>
        </div>
    `;

    if (!isNaoCarac) {
      html += `
        <!-- SIMETRIA -->
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Simetria</label>
          <select onchange="PainelConfigurador.atualizarCampo('ovarios', 'simetria', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.simetria.map(opt => `<option value="${opt.value}" ${this.campos.simetria === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>

        <!-- MEDIDAS OVÁRIO ESQUERDO E DIREITO -->
        <div class="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block border-b border-slate-200 dark:border-zinc-700 pb-1">Biometria (Eixo Longitudinal)</span>
          
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">Ovário Esquerdo (cm)</label>
              <input type="text" value="${this.campos.oeMedida}" 
                     onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('ovarios', 'oeMedida', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('ovarios', 'oeMedida', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">Ovário Direito (cm)</label>
              <input type="text" value="${this.campos.odMedida}" 
                     onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('ovarios', 'odMedida', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('ovarios', 'odMedida', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
          </div>
        </div>

        <!-- ASPECTO GERAL -->
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Contornos</label>
            <select onchange="PainelConfigurador.atualizarCampo('ovarios', 'contornos', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
              ${this.options.contornos.map(opt => `<option value="${opt.value}" ${this.campos.contornos === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade</label>
            <select onchange="PainelConfigurador.atualizarCampo('ovarios', 'ecogenicidade', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
              ${this.options.ecogenicidade.map(opt => `<option value="${opt.value}" ${this.campos.ecogenicidade === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Ecotextura</label>
            <select onchange="PainelConfigurador.atualizarCampo('ovarios', 'ecotextura', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
              ${this.options.ecotextura.map(opt => `<option value="${opt.value}" ${this.campos.ecotextura === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
        </div>
      `;
    }

    if (this.chipsSelecionados.includes('CistoFoliculo') && !isNaoCarac) {
      const isPlural = this.campos.cistoLocal === 'ovário esquerdo e direito';

      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Cisto / Folículo</span>
          
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Localização</label>
            <select onchange="PainelConfigurador.atualizarCampo('ovarios', 'cistoLocal', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.cistoLocalOpcoes.map(opt => `<option value="${opt.value}" ${this.campos.cistoLocal === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Medida Esq. (cm)' : 'Medida (cm)'}</label>
              <input type="text" value="${this.campos.cistoMedidaEsq}" 
                     onfocus="if(this.value==='0,00')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('ovarios', 'cistoMedidaEsq', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('ovarios', 'cistoMedidaEsq', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            ${isPlural ? `
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Medida Dir. (cm)</label>
                <input type="text" value="${this.campos.cistoMedidaDir}" 
                       onfocus="if(this.value==='0,00')this.value=''" 
                       onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('ovarios', 'cistoMedidaDir', '0,00')"
                       oninput="PainelConfigurador.atualizarCampo('ovarios', 'cistoMedidaDir', this.value)" 
                       class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }
};