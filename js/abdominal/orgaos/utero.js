window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.utero = {
  id: 'utero',
  nome: 'Útero',
  icone: '🧬',
  oculto: false,

  campos: {
    // Bloco Padrão
    paredes: 'normoespessas e regulares',
    conteudoTipo: 'sem', // 'sem', 'com_conteudo', 'dilatado_por'
    qtdOpcional: '',
    ecogenicidadeConteudo: 'anecogênico e homogêneo',

    // Cornos e Corpo
    estadoEsq: 'normal',
    medidaEsq: '0,00',
    estadoDir: 'normal',
    medidaDir: '0,00',
    medidaCorpo: '0,00',

    // Achado: HEC
    hecParedesTipo: 'espessadas',
    hecConteudoTipo: 'anecogênico e homogêneo',
    hecMedidaEsq: '0,00',
    hecMedidaDir: '0,00',

    // Achado: Piometra / Alteração Luminal
    piometraConteudoTipo: 'ecogênico/anecogênico com diversas estruturas puntiformes e ecogênicas entremeadas (celularidade)'
  },

  options: {
    paredes: [
      { value: 'normoespessas e regulares', label: 'normoespessas e regulares' },
      { value: 'espessadas e irregulares', label: 'espessadas e irregulares' },
      { value: 'espessas', label: 'espessas' }
    ],
    conteudoTipo: [
      { value: 'sem', label: 'sem evidências de conteúdo luminal e/ou lesões císticas' },
      { value: 'com_conteudo', label: 'preenchido por conteúdo' },
      { value: 'dilatado_por', label: 'dilatado por conteúdo' }
    ],
    qtdOpcional: [
      { value: '', label: '[Quantidade opcional]' },
      { value: 'discreta quantidade de', label: 'discreta quantidade de' },
      { value: 'moderada quantidade de', label: 'moderada quantidade de' },
      { value: 'acentuada quantidade de', label: 'acentuada quantidade de' }
    ],
    ecogenicidadeConteudo: [
      { value: 'anecogênico e homogêneo', label: 'anecogênico e homogêneo' },
      { value: 'ecogênico/anecogênico com diversas estruturas puntiformes e ecogênicas entremeadas (celularidade)', label: 'celularidade (puntiformes/ecogênicas)' },
      { value: 'hipoecogênico/ecogênico intraluminal', label: 'hipoecogênico/ecogênico intraluminal' },
      { value: 'ecogênico', label: 'ecogênico' }
    ],
    estadoCorno: [
      { value: 'normal', label: 'normal' },
      { value: 'aumentado', label: 'aumentado' }
    ],
    hecParedesTipo: [
      { value: 'espessadas', label: 'espessadas' },
      { value: 'espessadas difusamente', label: 'espessadas difusamente' }
    ],
    hecConteudoTipo: [
      { value: 'anecogênico e homogêneo', label: 'anecogênico e homogêneo' },
      { value: 'ecogênico/anecogênico com diversas estruturas puntiformes e ecogênicas entremeadas (celularidade)', label: 'celularidade (puntiformes/ecogênicas)' }
    ],
    piometraConteudoTipo: [
      { value: 'ecogênico/anecogênico com diversas estruturas puntiformes e ecogênicas entremeadas (celularidade)', label: 'celularidade (puntiformes/ecogênicas)' },
      { value: 'anecogênico e homogêneo', label: 'anecogênico e homogêneo' }
    ]
  },

  labels: {
    medidaEsq: 'Corno Uterino Esquerdo (cm)',
    medidaDir: 'Corno Uterino Direito (cm)',
    medidaCorpo: 'Corpo Uterino (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { id: 'HEC', rotulo: 'Hiperplasia Endometrial Cística', texto: '' },
    { id: 'Parturicao', rotulo: 'Parturição Recente', texto: '' },
    { id: 'Piometra', rotulo: 'Piometra / Alteração Luminal', texto: '' }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    if (campo === 'estadoEsq' || campo === 'estadoDir') {
      const lado = campo === 'estadoEsq' ? 'Esq' : 'Dir';
      const numVal = parseFloat((this.campos[`medida${lado}`] || '0').replace(',', '.')) || 0;
      if (valor === 'aumentado' && numVal <= 0.80) {
        this.campos[`medida${lado}`] = '1,20';
      } else if (valor === 'normal' && numVal > 0.80) {
        this.campos[`medida${lado}`] = '0,65';
      }
    }

    if (campo === 'medidaEsq' || campo === 'medidaDir') {
      const lado = campo === 'medidaEsq' ? 'Esq' : 'Dir';
      const numVal = parseFloat((valor || '0').replace(',', '.')) || 0;
      if (numVal > 0.80) {
        this.campos[`estado${lado}`] = 'aumentado';
      } else if (numVal > 0 && numVal <= 0.80) {
        this.campos[`estado${lado}`] = 'normal';
      }
    }

    if (campo === 'conteudoTipo') {
      PainelConfigurador.renderizar();
    }
  },

  gerarTexto: function(c) {
    let txt = '';
    const temAchadoAtivo = this.chipsSelecionados.some(chip => ['HEC', 'Parturicao', 'Piometra'].includes(chip));

    if (!temAchadoAtivo) {
      txt += `apresentando paredes ${c.paredes}, `;
      if (c.conteudoTipo === 'sem') {
        txt += `sem evidências de conteúdo luminal e/ou lesões císticas`;
      } else if (c.conteudoTipo === 'com_conteudo') {
        const qtd = c.qtdOpcional ? `${c.qtdOpcional} ` : '';
        txt += `preenchido por ${qtd}conteúdo ${c.ecogenicidadeConteudo} (Sugestivo de processo inflamatório/infeccioso, podendo estar relacionado a mucometra/hemometra/piometra incipiente, devendo ser considerado o ciclo estral)`;
      } else if (c.conteudoTipo === 'dilatado_por') {
        const qtd = c.qtdOpcional ? `${c.qtdOpcional} ` : '';
        txt += `dilatado por ${qtd}conteúdo ${c.ecogenicidadeConteudo} (Pode estar relacionado a hemometra/piometra)`;
      }
      txt += `:<br>`;
    }

    if (this.chipsSelecionados.includes('HEC')) {
      const valE = parseFloat((c.hecMedidaEsq || '0').replace(',', '.')) || 0;
      const valD = parseFloat((c.hecMedidaDir || '0').replace(',', '.')) || 0;

      let medTxt = '';
      if (valE > 0 && valD > 0) {
        medTxt = `medindo uma delas cerca de ${c.hecMedidaEsq} cm em corno esquerdo e ${c.hecMedidaDir} cm em corno direito `;
      } else if (valE > 0) {
        medTxt = `medindo uma delas cerca de ${c.hecMedidaEsq} cm em corno esquerdo `;
      } else if (valD > 0) {
        medTxt = `medindo uma delas cerca de ${c.hecMedidaDir} cm em corno direito `;
      }

      txt += `de dimensões aumentadas e paredes ${c.hecParedesTipo}, dilatado por conteúdo ${c.hecConteudoTipo}, além da presença de inúmeras estruturas císticas intramurais, ${medTxt}(Sugestivo de hiperplasia endometrial cística, podendo estar associado a processo inflamatório/infeccioso, como piometra/mucometra).<br>`;
    }

    if (this.chipsSelecionados.includes('Parturicao')) {
      txt += `de dimensões aumentadas, paredes espessas, de contornos irregulares e preenchido por moderada quantidade de conteúdo hipoecogênico/ecogênico intraluminal (Compatível com parturição recente, não descartando a possibilidade de processo inflamatório/infeccioso – Sugere-se acompanhamento sonográfico à critério do clínico responsável).<br>`;
    }

    if (this.chipsSelecionados.includes('Piometra')) {
      txt += `de dimensões aumentadas e paredes espessadas, dilatado por conteúdo ${c.piometraConteudoTipo} (Pode estar relacionado a hemometra/piometra).<br>`;
    }

    // Biometria
    const valEsq = parseFloat((c.medidaEsq || '0').replace(',', '.')) || 0;
    const valDir = parseFloat((c.medidaDir || '0').replace(',', '.')) || 0;
    const valCorpo = parseFloat((c.medidaCorpo || '0').replace(',', '.')) || 0;

    let linhas = [];
    if (valEsq > 0) {
      linhas.push(`• Corno uterino esquerdo (${c.estadoEsq}): ${c.medidaEsq} cm`);
    }
    if (valDir > 0) {
      linhas.push(`• Corno uterino direito (${c.estadoDir}): ${c.medidaDir} cm`);
    }
    if (valCorpo > 0) {
      linhas.push(`• Corpo uterino: ${c.medidaCorpo} cm`);
    }

    if (linhas.length > 0) {
      txt += linhas.join('<br>');
    } else if (temAchadoAtivo) {
      txt = txt.replace(/<br>$/, '');
    }

    // Caixa de referência dinâmica
    const isAlerta = (valEsq > 0.80) || (valDir > 0.80);
    const classeRef = isAlerta ? 'ref-text alerta-vermelho' : 'ref-text';

    txt += `<div class="${classeRef}"><span>Ref Útero: (Cão P: Cornos 0,50cm - 0,80cm)</span></div>`;

    return txt;
  },

  renderCamposCustomizados: function() {
    const temAchadoAtivo = this.chipsSelecionados.some(chip => ['HEC', 'Parturicao', 'Piometra'].includes(chip));

    let html = `<div class="space-y-3">`;

    if (!temAchadoAtivo) {
      html += `
        <!-- ASPECTO DAS PAREDES E CONTEÚDO -->
        <div class="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block border-b border-slate-200 dark:border-zinc-700 pb-1">Aspecto Ultrassonográfico</span>
          
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Paredes Uterinas</label>
            <select onchange="PainelConfigurador.atualizarCampo('utero', 'paredes', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.paredes.map(opt => `<option value="${opt.value}" ${this.campos.paredes === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Conteúdo Luminal / Lesões</label>
            <select onchange="PainelConfigurador.atualizarCampo('utero', 'conteudoTipo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.conteudoTipo.map(opt => `<option value="${opt.value}" ${this.campos.conteudoTipo === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>

          ${this.campos.conteudoTipo !== 'sem' ? `
            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-zinc-700">
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Quantidade (Opcional)</label>
                <select onchange="PainelConfigurador.atualizarCampo('utero', 'qtdOpcional', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
                  ${this.options.qtdOpcional.map(opt => `<option value="${opt.value}" ${this.campos.qtdOpcional === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade Conteúdo</label>
                <select onchange="PainelConfigurador.atualizarCampo('utero', 'ecogenicidadeConteudo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
                  ${this.options.ecogenicidadeConteudo.map(opt => `<option value="${opt.value}" ${this.campos.ecogenicidadeConteudo === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // BIOMETRIA DOS CORNOS E CORPO
    html += `
      <div class="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
        <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block border-b border-slate-200 dark:border-zinc-700 pb-1">Biometria (Cornos e Corpo)</span>
        
        <!-- CORNO ESQUERDO -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Estado Corno Esq.</label>
            <select onchange="PainelConfigurador.atualizarCampo('utero', 'estadoEsq', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.estadoCorno.map(opt => `<option value="${opt.value}" ${this.campos.estadoEsq === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medida Corno Esq. (cm)</label>
            <input type="text" value="${this.campos.medidaEsq}" 
                   onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                   onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('utero', 'medidaEsq', '0,00')"
                   oninput="PainelConfigurador.atualizarCampo('utero', 'medidaEsq', this.value)" 
                   class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
          </div>
        </div>

        <!-- CORNO DIREITO -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Estado Corno Dir.</label>
            <select onchange="PainelConfigurador.atualizarCampo('utero', 'estadoDir', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.estadoCorno.map(opt => `<option value="${opt.value}" ${this.campos.estadoDir === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medida Corno Dir. (cm)</label>
            <input type="text" value="${this.campos.medidaDir}" 
                   onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                   onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('utero', 'medidaDir', '0,00')"
                   oninput="PainelConfigurador.atualizarCampo('utero', 'medidaDir', this.value)" 
                   class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
          </div>
        </div>

        <!-- CORPO UTERINO -->
        <div>
          <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medida Corpo Uterino (cm)</label>
          <input type="text" value="${this.campos.medidaCorpo}" 
                 onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                 onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('utero', 'medidaCorpo', '0,00')"
                 oninput="PainelConfigurador.atualizarCampo('utero', 'medidaCorpo', this.value)" 
                 class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
        </div>
      </div>
    `;

    // PAINEL ACHADO: HEC
    if (this.chipsSelecionados.includes('HEC')) {
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Hiperplasia Endometrial Cística (HEC)</span>
          
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Paredes</label>
              <select onchange="PainelConfigurador.atualizarCampo('utero', 'hecParedesTipo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
                ${this.options.hecParedesTipo.map(opt => `<option value="${opt.value}" ${this.campos.hecParedesTipo === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Conteúdo Luminal</label>
              <select onchange="PainelConfigurador.atualizarCampo('utero', 'hecConteudoTipo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
                ${this.options.hecConteudoTipo.map(opt => `<option value="${opt.value}" ${this.campos.hecConteudoTipo === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Maior Cisto Corno Esq. (cm)</label>
              <input type="text" value="${this.campos.hecMedidaEsq}" 
                     onfocus="if(this.value==='0,00')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('utero', 'hecMedidaEsq', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('utero', 'hecMedidaEsq', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Maior Cisto Corno Dir. (cm)</label>
              <input type="text" value="${this.campos.hecMedidaDir}" 
                     onfocus="if(this.value==='0,00')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('utero', 'hecMedidaDir', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('utero', 'hecMedidaDir', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
          </div>
        </div>
      `;
    }

    // PAINEL ACHADO: PIOMETRA / ALTERAÇÃO LUMINAL
    if (this.chipsSelecionados.includes('Piometra')) {
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Piometra / Alteração Luminal</span>
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Conteúdo Luminal</label>
            <select onchange="PainelConfigurador.atualizarCampo('utero', 'piometraConteudoTipo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs">
              ${this.options.piometraConteudoTipo.map(opt => `<option value="${opt.value}" ${this.campos.piometraConteudoTipo === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }
};