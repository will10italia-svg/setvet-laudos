// js/abdominal/orgaos/utero.js

window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.utero = {
  id: 'utero',
  nome: 'Útero',
  icone: '🧬',
  oculto: false,

  campos: {
    paredes: 'normoespessas e regulares',
    conteudoTipo: 'sem',
    qtdOpcional: '',
    ecogenicidadeConteudo: 'anecogênico e homogêneo',
    estadoEsq: 'normal',
    medidaEsq: '0,00',
    estadoDir: 'normal',
    medidaDir: '0,00',
    medidaCorpo: '0,00',
    hecParedesTipo: 'espessadas',
    hecConteudoTipo: 'anecogênico e homogêneo',
    hecMedidaEsq: '0,0',
    hecMedidaDir: '0,0',
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

  obterLimiteReferencia: function() {
    const elPorte = document.getElementById('p-porte');
    const porteVal = elPorte ? elPorte.value : 'Cão P';

    let limiteMax = 0.80;
    if (porteVal === 'Cão M') limiteMax = 1.00;
    else if (porteVal === 'Cão G') limiteMax = 1.30;
    else if (porteVal === 'Felino') limiteMax = 0.50;

    return { porte: porteVal, limite: limiteMax };
  },

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;
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
        txt += `preenchido por ${qtd}conteúdo ${c.ecogenicidadeConteudo} (Sugestivo de processo inflamatório/infeccioso)`;
      } else if (c.conteudoTipo === 'dilatado_por') {
        const qtd = c.qtdOpcional ? `${c.qtdOpcional} ` : '';
        txt += `dilatado por ${qtd}conteúdo ${c.ecogenicidadeConteudo}`;
      }
      txt += `:<br>`;
    }

    if (this.chipsSelecionados.includes('HEC')) {
      txt += `de dimensões aumentadas e paredes ${c.hecParedesTipo}, dilatado por conteúdo ${c.hecConteudoTipo}, presença de estruturas císticas intramurais.<br>`;
    }

    if (this.chipsSelecionados.includes('Parturicao')) {
      txt += `de dimensões aumentadas, paredes espessas, de contornos irregulares e preenchido por moderada quantidade de conteúdo intraluminal (Compatível com parturição recente).<br>`;
    }

    if (this.chipsSelecionados.includes('Piometra')) {
      txt += `de dimensões aumentadas e paredes espessadas, dilatado por conteúdo ${c.piometraConteudoTipo}.<br>`;
    }

    const valEsq = parseFloat((c.medidaEsq || '0').replace(',', '.')) || 0;
    const valDir = parseFloat((c.medidaDir || '0').replace(',', '.')) || 0;
    const valCorpo = parseFloat((c.medidaCorpo || '0').replace(',', '.')) || 0;

    let linhas = [];
    if (valEsq > 0) linhas.push(`• Corno uterino esquerdo (${c.estadoEsq}): ${c.medidaEsq} cm`);
    if (valDir > 0) linhas.push(`• Corno uterino direito (${c.estadoDir}): ${c.medidaDir} cm`);
    if (valCorpo > 0) linhas.push(`• Corpo uterino: ${c.medidaCorpo} cm`);

    if (linhas.length > 0) {
      txt += linhas.join('<br>');
    } else if (temAchadoAtivo) {
      txt = txt.replace(/<br>$/, '');
    }

    return txt;
  },

  renderCamposCustomizados: function() {
    const ref = this.obterLimiteReferencia();
    let html = `<div class="space-y-3">
      <div class="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-zinc-700 pb-1">
          <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Biometria (Cornos e Corpo)</span>
          <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">(Ref: ${ref.porte} até ${ref.limite.toFixed(2).replace('.', ',')}cm)</span>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Estado Corno Esq.</label>
            <select onchange="PainelConfigurador.atualizarCampo('utero', 'estadoEsq', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.estadoCorno.map(opt => `<option value="${opt.value}" ${this.campos.estadoEsq === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medida Corno Esq. (cm)</label>
            <input type="text" value="${this.campos.medidaEsq}" oninput="PainelConfigurador.atualizarCampo('utero', 'medidaEsq', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono font-bold text-emerald-600">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Estado Corno Dir.</label>
            <select onchange="PainelConfigurador.atualizarCampo('utero', 'estadoDir', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.estadoCorno.map(opt => `<option value="${opt.value}" ${this.campos.estadoDir === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medida Corno Dir. (cm)</label>
            <input type="text" value="${this.campos.medidaDir}" oninput="PainelConfigurador.atualizarCampo('utero', 'medidaDir', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono font-bold text-emerald-600">
          </div>
        </div>

        <div>
          <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medida Corpo Uterino (cm)</label>
          <input type="text" value="${this.campos.medidaCorpo}" oninput="PainelConfigurador.atualizarCampo('utero', 'medidaCorpo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
        </div>
      </div>
    </div>`;
    return html;
  }
};
