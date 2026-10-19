window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.pancreas = {
  id: 'pancreas',
  nome: 'Pâncreas',
  icone: '🧬',
  oculto: false,

  campos: {
    pancreasMedida: '0,00',
    pancreasDimensoes: 'normais',
    pancreasParenquima: 'homogêneo',
    pancreasEcogenicidade: 'mantida',
    pancreasNoduloMedida: '0,00'
  },

  options: {
    pancreasDimensoes: [
      { value: 'normais', label: 'normais' },
      { value: 'elevadas', label: 'elevadas' },
      { value: 'discretamente elevadas', label: 'discretamente elevadas' }
    ],
    pancreasParenquima: [
      { value: 'homogêneo', label: 'homogêneo' },
      { value: 'heterogêneo', label: 'heterogêneo' }
    ],
    pancreasEcogenicidade: [
      { value: 'mantida', label: 'mantida' },
      { value: 'reduzida (Sugestivo de processo inflamatório agudo / pancreatite)', label: 'reduzida (pancreatite aguda)' },
      { value: 'elevada (Sugestivo de pancreatopatia)', label: 'elevada (pancreatopatia)' },
      { value: 'mantida (Sugere-se correlacionar com exames laboratoriais e achados clínicos do paciente)', label: 'mantida (correlacionar clínico)' },
      { value: 'reduzida (Sugere-se correlacionar com exames laboratoriais e achados clínicos do paciente)', label: 'reduzida (correlacionar clínico)' },
      { value: 'elevada (Sugere-se correlacionar com exames laboratoriais e achados clínicos do paciente)', label: 'elevada (correlacionar clínico)' },
      { value: 'mista (Sugestivo de pancreatopatia)', label: 'mista (pancreatopatia)' }
    ]
  },

  labels: {
    pancreasMedida: 'Espessura Pâncreas (cm)',
    pancreasNoduloMedida: 'Medida Nódulo Pancreático (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { 
      id: 'Nodulo', 
      rotulo: 'Nódulo Pancreático', 
      texto: '' 
    }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;
  },

  gerarTexto: function(c) {
    return `medindo cerca de ${c.pancreasMedida} cm de espessura, dimensões ${c.pancreasDimensoes}, com parênquima ${c.pancreasParenquima} e ecogenicidade ${c.pancreasEcogenicidade}.`;
  },

  gerarTextoAchado: function(chipId, c) {
    if (chipId === 'Nodulo') {
      return `Observa-se nódulo de ecogenicidade mista em ramo pancreático, medindo cerca de ${c.pancreasNoduloMedida} cm de diâmetro (Sugere-se acompanhamento evolutivo ou correlação citológica).`;
    }
    return '';
  },

  renderCamposCustomizados: function() {
    const valNum = parseFloat((this.campos.pancreasMedida || '0').replace(',', '.')) || 0;
    const isAlerta = valNum > 1.0;

    let html = `
      <div class="space-y-3">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Espessura Pâncreas (cm)</label>
          <input type="text" value="${this.campos.pancreasMedida}" 
                 onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                 onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('pancreas', 'pancreasMedida', '0,00')"
                 oninput="PainelConfigurador.atualizarCampo('pancreas', 'pancreasMedida', this.value)" 
                 class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200 text-center">
          <div class="mt-1 text-[10px] font-mono text-slate-500 ${isAlerta ? 'text-red-500 font-bold' : ''}">
            Ref Pâncreas: (Cão: 1,0cm) ${isAlerta ? '⚠️ Acima da referência' : ''}
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dimensões</label>
          <select onchange="PainelConfigurador.atualizarCampo('pancreas', 'pancreasDimensoes', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.pancreasDimensoes.map(opt => `<option value="${opt.value}" ${this.campos.pancreasDimensoes === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Parênquima</label>
          <select onchange="PainelConfigurador.atualizarCampo('pancreas', 'pancreasParenquima', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.pancreasParenquima.map(opt => `<option value="${opt.value}" ${this.campos.pancreasParenquima === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade</label>
          <select onchange="PainelConfigurador.atualizarCampo('pancreas', 'pancreasEcogenicidade', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.pancreasEcogenicidade.map(opt => `<option value="${opt.value}" ${this.campos.pancreasEcogenicidade === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>
      </div>
    `;

    if (this.chipsSelecionados && this.chipsSelecionados.length > 0) {
      html += `<div class="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-700 space-y-3">`;
      
      this.chipsSelecionados.forEach(chipId => {
        html += `
          <div class="p-3 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block border-b border-slate-200 dark:border-zinc-700 pb-1">Configurações de: Nódulo Pancreático</span>
        `;

        if (chipId === 'Nodulo') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida do Nódulo (cm)</label>
              <input type="text" value="${this.campos.pancreasNoduloMedida}" 
                     onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('pancreas', 'pancreasNoduloMedida', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('pancreas', 'pancreasNoduloMedida', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
            </div>
          `;
        }

        html += `</div>`;
      });

      html += `</div>`;
    }

    return html;
  }
};