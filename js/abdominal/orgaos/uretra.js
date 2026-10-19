window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.uretra = {
  id: 'uretra',
  nome: 'Uretra',
  icone: '〰️',
  oculto: false,

  campos: {
    uretraMedida: '0,00',
    uretraQtdEstruturas: 'pelo menos uma estrutura hiperecogênica formadora',
    uretraSegmento: 'sem especificar',
    uretraLitiasiMedida: '0,00'
  },

  options: {
    uretraQtdEstruturas: [
      { value: 'pelo menos uma estrutura hiperecogênica formadora', label: 'pelo menos uma estrutura' },
      { value: 'diversas estruturas hiperecogênicas formadoras', label: 'diversas estruturas' }
    ],
    uretraSegmento: [
      { value: 'sem especificar', label: 'sem especificar' },
      { value: 'prostática', label: 'prostática' },
      { value: 'peniana', label: 'peniana' }
    ]
  },

  labels: {
    uretraMedida: 'Diâmetro Uretra Dilatada (cm)',
    uretraLitiasiMedida: 'Medida Uretrolitíase (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { 
      id: 'Micro', 
      rotulo: 'Pequenas imagens (Sedimentos)', 
      texto: 'Notando-se a presença pequenas imagens hiperecogênicas e/ou amorfas em lúmen uretral (Sugere-se microlitíase / micro cristal uretral / sedimentos / plug uretral).' 
    },
    { 
      id: 'Litiasi', 
      rotulo: 'Uretrolitíase (Sombreamento)', 
      texto: '' 
    }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;
  },

  gerarTexto: function(c) {
    return `apresenta-se dilatada, medindo em torno de ${c.uretraMedida} cm de diâmetro.`;
  },

  gerarTextoAchado: function(chipId, c) {
    if (chipId === 'Micro') {
      return 'Notando-se a presença pequenas imagens hiperecogênicas e/ou amorfas em lúmen uretral (Sugere-se microlitíase / micro cristal uretral / sedimentos / plug uretral).';
    }
    if (chipId === 'Litiasi') {
      const isDiversas = c.uretraQtdEstruturas.includes('diversas');
      const prefixoMedida = isDiversas ? 'medindo uma delas cerca de' : 'medindo cerca de';
      const segmentoTexto = c.uretraSegmento !== 'sem especificar' ? ` em região ${c.uretraSegmento}` : '';
      
      const valNum = parseFloat((c.uretraLitiasiMedida || '0').replace(',', '.')) || 0;
      const medidaTexto = valNum > 0 ? `, ${prefixoMedida} ${c.uretraLitiasiMedida} cm` : '';

      return `Observa-se a presença de ${c.uretraQtdEstruturas} de sombreamento acústico posterior${segmentoTexto}${medidaTexto} (Compatível com uretrolitíase, podendo estar relacionado a obstrução parcial/total do trato urinário).`;
    }
    return '';
  },

  renderCamposCustomizados: function() {
    let html = `
      <div class="space-y-3">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diâmetro Uretra Dilatada (cm)</label>
          <input type="text" value="${this.campos.uretraMedida}" 
                 onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                 onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('uretra', 'uretraMedida', '0,00')"
                 oninput="PainelConfigurador.atualizarCampo('uretra', 'uretraMedida', this.value)" 
                 class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200 text-center">
        </div>
      </div>
    `;

    // Renderização dos submenus integrada exatamente abaixo de cada achado selecionado
    if (this.chipsSelecionados && this.chipsSelecionados.length > 0) {
      html += `<div class="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-700 space-y-3">`;
      
      this.chipsSelecionados.forEach(chipId => {
        html += `
          <div class="p-3 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block border-b border-slate-200 dark:border-zinc-700 pb-1">Configurações de: ${chipId === 'Micro' ? 'Pequenas imagens (Sedimentos)' : 'Uretrolitíase'}</span>
        `;

        if (chipId === 'Litiasi') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quantidade de Estruturas</label>
              <select onchange="PainelConfigurador.atualizarCampo('uretra', 'uretraQtdEstruturas', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.uretraQtdEstruturas.map(opt => `<option value="${opt.value}" ${this.campos.uretraQtdEstruturas === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Segmento Uretral</label>
              <select onchange="PainelConfigurador.atualizarCampo('uretra', 'uretraSegmento', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.uretraSegmento.map(opt => `<option value="${opt.value}" ${this.campos.uretraSegmento === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida da Litíase (cm)</label>
              <input type="text" value="${this.campos.uretraLitiasiMedida}" 
                     onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('uretra', 'uretraLitiasiMedida', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('uretra', 'uretraLitiasiMedida', this.value)" 
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