window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.prostata = {
  id: 'prostata',
  nome: 'Próstata',
  icone: '🧬',
  oculto: false,

  campos: {
    medida1: '0,00',
    medida2: '0,00',
    ecogenicidade: 'mantida',
    ecotextura: 'homogênea',
    focoMedida: '0,00'
  },

  options: {
    ecogenicidade: [
      { value: 'mantida', label: 'mantida' },
      { value: 'alterada', label: 'alterada' }
    ],
    ecotextura: [
      { value: 'homogênea', label: 'homogênea' },
      { value: 'heterogênea', label: 'heterogênea' }
    ]
  },

  labels: {
    medida1: 'Comprimento Próstata (cm)',
    medida2: 'Largura Próstata (cm)',
    focoMedida: 'Medida do Foco Hipoecogênico (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { 
      id: 'Heterogeneidade', 
      rotulo: 'Detalhe Heterogeneidade', 
      texto: '' 
    }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    // Se o usuário trocar a ecotextura para heterogênea, ativa automaticamente o chip de detalhe
    if (campo === 'ecotextura') {
      if (valor === 'heterogênea' && !this.chipsSelecionados.includes('Heterogeneidade')) {
        this.chipsSelecionados.push('Heterogeneidade');
      } else if (valor === 'homogênea' && this.chipsSelecionados.includes('Heterogeneidade')) {
        this.chipsSelecionados = this.chipsSelecionados.filter(id => id !== 'Heterogeneidade');
      }
    }
  },

  gerarTexto: function(c) {
    return `mensurando ${c.medida1} cm x ${c.medida2} cm, contornos regulares, ecogenicidade ${c.ecogenicidade} e ecotextura ${c.ecotextura}.`;
  },

  gerarTextoAchado: function(chipId, c) {
    if (chipId === 'Heterogeneidade') {
      return `Às custas de diminutos focos hipoecogênicos em permeio, medindo um deles cerca de ${c.focoMedida} cm (Sugestivo de prostatopatia associada a cisto / abcesso / neoplasia cavitária).`;
    }
    return '';
  },

  renderCamposCustomizados: function() {
    const val1 = parseFloat((this.campos.medida1 || '0').replace(',', '.')) || 0;
    const val2 = parseFloat((this.campos.medida2 || '0').replace(',', '.')) || 0;
    const isAlerta = val1 > 2.5 || val2 > 2.5;
    const temHeteroChip = this.chipsSelecionados.includes('Heterogeneidade');

    let html = `
      <div class="space-y-3">
        <div class="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block border-b border-slate-200 dark:border-zinc-700 pb-1">Biometria e Aspecto</span>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">Medida 1 (cm)</label>
              <input type="text" value="${this.campos.medida1}" 
                     onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('prostata', 'medida1', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('prostata', 'medida1', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">Medida 2 (cm)</label>
              <input type="text" value="${this.campos.medida2}" 
                     onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('prostata', 'medida2', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('prostata', 'medida2', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
          </div>
          <div class="text-[10px] font-mono text-slate-500 ${isAlerta ? 'text-red-500 font-bold' : ''}">
            Ref: (Cão P: 2,0 - 2,5cm) ${isAlerta ? '⚠️ Acima da referência' : ''}
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade</label>
          <select onchange="PainelConfigurador.atualizarCampo('prostata', 'ecogenicidade', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.ecogenicidade.map(opt => `<option value="${opt.value}" ${this.campos.ecogenicidade === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecotextura</label>
          <select onchange="PainelConfigurador.atualizarCampo('prostata', 'ecotextura', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.ecotextura.map(opt => `<option value="${opt.value}" ${this.campos.ecotextura === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>
      </div>
    `;

    if (temHeteroChip) {
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Configurações de Heterogeneidade</span>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida Foco Hipoecogênico (cm)</label>
            <input type="text" value="${this.campos.focoMedida}" 
                   onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                   onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('prostata', 'focoMedida', '0,00')"
                   oninput="PainelConfigurador.atualizarCampo('prostata', 'focoMedida', this.value)" 
                   class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
          </div>
        </div>
      `;
    }

    return html;
  }
};