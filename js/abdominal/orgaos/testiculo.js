window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.testiculos = {
  id: 'testiculos',
  nome: 'Testículos',
  icone: '🧬',
  oculto: false,

  campos: {
    simetria: 'simétricos',
    medidaE: '0,00',
    medidaD: '0,00',
    parenquima: 'homogêneo',
    linhaMediastinal: 'preservada',
    sugestaoMediastinal: '',

    // Configurações Achado: Nódulo
    noduloLado: 'esquerdo',
    noduloCompE: '0,00',
    noduloEspE: '0,00',
    noduloCompD: '0,00',
    noduloEspD: '0,00',

    // Configurações Achado: Ectópico
    ectopicoRegiao: 'inguinal',
    ectopicoLado: 'esquerda',
    ectopicoCompE: '0,00',
    ectopicoEspE: '0,00',
    ectopicoCompD: '0,00',
    ectopicoEspD: '0,00',

    // Configurações Achado: Cisto
    cistoLado: 'esquerdo',
    cistoDiamE: '0,00',
    cistoDiamD: '0,00',

    // Configurações Achado: Fibrose
    fibroseLado: 'esquerdo',
    fibroseCompE: '0,00',
    fibroseEspE: '0,00',
    fibroseCompD: '0,00',
    fibroseEspD: '0,00',

    // Configurações Achado: Neoplasia
    neoplasiaLado: 'esquerdo',
    neoplasiaCompE: '0,00',
    neoplasiaEspE: '0,00',
    neoplasiaCompD: '0,00',
    neoplasiaEspD: '0,00',

    // Configurações Achado: Hidrocele
    hidroceleConteudo: 'homogêneo/de alta celularidade'
  },

  options: {
    simetria: [
      { value: 'simétricos', label: 'simétricos' },
      { value: 'assimétricos', label: 'assimétricos' }
    ],
    parenquima: [
      { value: 'homogêneo', label: 'homogêneo' },
      { value: 'heterogêneo as custas de pontos hiperecogênicos entremeados', label: 'heterogêneo (pontos hiperecogênicos entremeados)' }
    ],
    linhaMediastinal: [
      { value: 'preservada', label: 'preservada' },
      { value: 'discreta perda', label: 'discreta perda' },
      { value: 'perda total', label: 'perda total' }
    ],
    sugestaoMediastinal: [
      { value: '', label: '[Nenhum sugestivo]' },
      { value: '(Sugestivo de degeneração senil)', label: '(Sugestivo de degeneração senil)' },
      { value: '(Sugestivo de pontos de fibrose)', label: '(Sugestivo de pontos de fibrose)' },
      { value: '(Sugestivo de degeneração senil, associada a pontos de fibrose)', label: '(Sugestivo de degeneração senil e fibrose)' }
    ],
    ladoOpcoes: [
      { value: 'esquerdo', label: 'esquerdo' },
      { value: 'direito', label: 'direito' },
      { value: 'esquerdo e direito', label: 'esquerdo e direito' }
    ],
    ectopicoLadoOpcoes: [
      { value: 'esquerda', label: 'esquerda' },
      { value: 'direita', label: 'direita' },
      { value: 'esquerda e direita', label: 'esquerda e direita' }
    ],
    ectopicoRegiaoOpcoes: [
      { value: 'inguinal/abdominal', label: 'inguinal/abdominal' },
      { value: 'inguinal', label: 'inguinal' },
      { value: 'abdominal', label: 'abdominal' }
    ],
    hidroceleConteudoOpcoes: [
      { value: 'homogêneo/de alta celularidade', label: 'homogêneo/de alta celularidade' },
      { value: 'homogêneo', label: 'homogêneo' },
      { value: 'de alta celularidade', label: 'de alta celularidade' }
    ]
  },

  labels: {
    medidaE: 'Medida Esquerdo (cm)',
    medidaD: 'Medida Direito (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { id: 'Nodulo', rotulo: 'Nódulo Neoplásico', texto: '' },
    { id: 'Ectopico', rotulo: 'Ectópico', texto: '' },
    { id: 'Cisto', rotulo: 'Cisto', texto: '' },
    { id: 'Fibrose', rotulo: 'Fibrose', texto: '' },
    { id: 'Neoplasia', rotulo: 'Neoplasia', texto: '' },
    { id: 'Hidrocele', rotulo: 'Hidrocele', texto: '' }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;
    
    if (campo === 'medidaE' || campo === 'medidaD') {
      this.verificarSimetria();
    }

    // Se mudar a seleção de lado para algum achado, força re-renderizar para abrir/fechar as medidas do lado oposto
    if (['noduloLado', 'ectopicoLado', 'cistoLado', 'fibroseLado', 'neoplasiaLado'].includes(campo)) {
      PainelConfigurador.renderizar();
    }
  },

  verificarSimetria: function() {
    const valE = parseFloat((this.campos.medidaE || '0').replace(',', '.')) || 0;
    const valD = parseFloat((this.campos.medidaD || '0').replace(',', '.')) || 0;

    if (valE > 0 && valD > 0) {
      const menor = Math.min(valE, valD);
      const maior = Math.max(valE, valD);
      const dif = ((maior - menor) / menor) * 100;
      this.campos.simetria = dif > 10 ? 'assimétricos' : 'simétricos';
    } else {
      this.campos.simetria = 'simétricos';
    }
  },

  gerarTexto: function(c) {
    let txt = `tópicos e ${c.simetria}<br>`;
    txt += `• Esquerdo (E): ${c.medidaE} cm de comprimento<br>`;
    txt += `• Direito (D): ${c.medidaD} cm de comprimento<br>`;
    txt += `apresentando parênquima ${c.parenquima}, com ${c.linhaMediastinal} de definição de linha mediastinal`;
    if (c.sugestaoMediastinal) {
      txt += ` ${c.sugestaoMediastinal}`;
    }
    txt += `.`;
    return txt;
  },

  gerarTextoAchado: function(chipId, c) {
    if (chipId === 'Nodulo') {
      const isPlural = c.noduloLado === 'esquerdo e direito';
      const termoEst = isPlural ? 'estruturas' : 'estrutura';
      const termoHipo = isPlural ? 'hipoecogênicas' : 'hipoecogênica';
      const termoOrg = isPlural ? 'testículos' : 'testículo';
      
      let medidas = '';
      if (isPlural) {
        medidas = `esquerdo: ${c.noduloCompE} cm x ${c.noduloEspE} cm e direito: ${c.noduloCompD} cm x ${c.noduloEspD} cm, respectivamente`;
      } else {
        medidas = `${c.noduloCompE} cm x ${c.noduloEspE} cm`;
      }

      return `Nota-se ${termoEst} arredondada, de contornos definidos e regulares, ${termoHipo} e homogênea, localizada em ${termoOrg} ${c.noduloLado} e medindo cerca de ${medidas} (Pode estar relacionado a nódulo hiperplásico).`;
    }

    if (chipId === 'Ectopico') {
      const isPlural = c.ectopicoLado === 'esquerda e direita';
      const termoEst = isPlural ? 'estruturas' : 'estrutura';
      const termoHipo = isPlural ? 'hipoecogênicas' : 'hipoecogênica';
      const termoReg = isPlural ? 'regiões' : 'região';

      let medidas = '';
      if (isPlural) {
        medidas = `esquerda: ${c.ectopicoCompE} cm x ${c.ectopicoEspE} cm e direita: ${c.ectopicoCompD} cm x ${c.ectopicoEspD} cm, respectivamente`;
      } else {
        medidas = `${c.ectopicoCompE} cm x ${c.ectopicoEspE} cm`;
      }

      return `Visibiliza-se presença de ${termoEst} ovalada, de contornos definidos e regulares, ${termoHipo}, homogênea e com linha hiperecogênica central, localizada em ${termoReg} ${c.ectopicoRegiao} ${c.ectopicoLado} e medindo cerca de ${medidas} (Sugestivo de testículo ectópico).`;
    }

    if (chipId === 'Cisto') {
      const isPlural = c.cistoLado === 'esquerdo e direito';
      const termoEst = isPlural ? 'estruturas' : 'estrutura';
      const termoAnec = isPlural ? 'anecogênicas' : 'anecogênica';
      const termoOrg = isPlural ? 'testículos' : 'testículo';

      let medidas = '';
      if (isPlural) {
        medidas = `esquerdo: ${c.cistoDiamE} cm e direito: ${c.cistoDiamD} cm, respectivamente`;
      } else {
        medidas = `${c.cistoDiamE} cm`;
      }

      return `Nota-se ${termoEst} arredondada, de paredes finas e regulares, ${termoAnec} e homogênea, localizada em ${termoOrg} ${c.cistoLado} e medindo cerca de ${medidas} de diâmetro (Compatível com cisto testicular).`;
    }

    if (chipId === 'Fibrose') {
      const isPlural = c.fibroseLado === 'esquerdo e direito';
      const termoEst = isPlural ? 'estruturas' : 'estrutura';
      const termoEco = isPlural ? 'ecogênicas' : 'ecogênica';
      const termoOrg = isPlural ? 'testículos' : 'testículo';

      let medidas = '';
      if (isPlural) {
        medidas = `esquerdo: ${c.fibroseCompE} cm x ${c.fibroseEspE} cm e direito: ${c.fibroseCompD} cm x ${c.fibroseEspD} cm, respectivamente`;
      } else {
        medidas = `${c.fibroseCompE} cm x ${c.fibroseEspE} cm`;
      }

      return `Nota-se ${termoEst} arredondada, de contornos definidos e regulares, ${termoEco} e homogênea, localizada em ${termoOrg} ${c.fibroseLado} e medindo cerca de ${medidas} (Pode estar relacionado a área de fibrose).`;
    }

    if (chipId === 'Neoplasia') {
      const isPlural = c.neoplasiaLado === 'esquerdo e direito';
      const termoEst = isPlural ? 'estruturas' : 'estrutura';
      const termoOrg = isPlural ? 'testículos' : 'testículo';

      let medidas = '';
      if (isPlural) {
        medidas = `esquerdo: ${c.neoplasiaCompE} cm x ${c.neoplasiaEspE} cm e direito: ${c.neoplasiaCompD} cm x ${c.neoplasiaEspD} cm, respectivamente`;
      } else {
        medidas = `${c.neoplasiaCompE} cm x ${c.neoplasiaEspE} cm`;
      }

      return `Evidencia-se ${termoEst} tendendo a arredondada, de contornos definidos e regulares, ecogenicidade mista, ecotextura heterogênea e perda da definição da linha mediastinal, localizada em ${termoOrg} ${c.neoplasiaLado} e medindo cerca de ${medidas}, com aumento da vascularização ao modo Doppler colorido (Pode estar relacionado a processo neoplásico).`;
    }

    if (chipId === 'Hidrocele') {
      return `Nota-se presença de conteúdo anecogênico (líquido) livre ${c.hidroceleConteudo} em bolsa escrotal (Pode estar relacionado a hidrocele, hematocele ou piocele).`;
    }

    return '';
  },

  renderCamposCustomizados: function() {
    let html = `
      <div class="space-y-3">
        <!-- SIMETRIA E MEDIDAS -->
        <div class="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-zinc-700 pb-1">
            <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Biometria e Simetria</span>
            <span class="text-[10px] font-semibold text-slate-500 uppercase">${this.campos.simetria}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">Esquerdo (E) (cm)</label>
              <input type="text" value="${this.campos.medidaE}" 
                     onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'medidaE', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('testiculos', 'medidaE', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">Direito (D) (cm)</label>
              <input type="text" value="${this.campos.medidaD}" 
                     onfocus="if(this.value==='0,00'||this.value==='0')this.value=''" 
                     onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'medidaD', '0,00')"
                     oninput="PainelConfigurador.atualizarCampo('testiculos', 'medidaD', this.value)" 
                     class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
          </div>
        </div>

        <!-- PARÊNQUIMA -->
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Parênquima</label>
          <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'parenquima', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.parenquima.map(opt => `<option value="${opt.value}" ${this.campos.parenquima === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>

        <!-- LINHA MEDIASTINAL -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Linha Mediastinal</label>
            <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'linhaMediastinal', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
              ${this.options.linhaMediastinal.map(opt => `<option value="${opt.value}" ${this.campos.linhaMediastinal === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sugestão Mediastinal</label>
            <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'sugestaoMediastinal', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs dark:text-zinc-200">
              ${this.options.sugestaoMediastinal.map(opt => `<option value="${opt.value}" ${this.campos.sugestaoMediastinal === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
    `;

    // CONFIGURAÇÃO DINÂMICA DE ACHADOS
    if (this.chipsSelecionados.includes('Nodulo')) {
      const isPlural = this.campos.noduloLado === 'esquerdo e direito';
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Nódulo Neoplásico</span>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
            <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'noduloLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.ladoOpcoes.map(opt => `<option value="${opt.value}" ${this.campos.noduloLado === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Comp. Esq (cm)' : 'Comp. (cm)'}</label>
              <input type="text" value="${this.campos.noduloCompE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'noduloCompE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'noduloCompE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Esp. Esq (cm)' : 'Esp. (cm)'}</label>
              <input type="text" value="${this.campos.noduloEspE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'noduloEspE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'noduloEspE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
          </div>
          ${isPlural ? `
            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/50">
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Comp. Dir (cm)</label>
                <input type="text" value="${this.campos.noduloCompD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'noduloCompD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'noduloCompD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Esp. Dir (cm)</label>
                <input type="text" value="${this.campos.noduloEspD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'noduloEspD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'noduloEspD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (this.chipsSelecionados.includes('Ectopico')) {
      const isPlural = this.campos.ectopicoLado === 'esquerda e direita';
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Testículo Ectópico</span>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Região</label>
              <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'ectopicoRegiao', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
                ${this.options.ectopicoRegiaoOpcoes.map(opt => `<option value="${opt.value}" ${this.campos.ectopicoRegiao === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
              <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'ectopicoLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
                ${this.options.ectopicoLadoOpcoes.map(opt => `<option value="${opt.value}" ${this.campos.ectopicoLado === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Comp. Esq (cm)' : 'Comp. (cm)'}</label>
              <input type="text" value="${this.campos.ectopicoCompE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'ectopicoCompE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'ectopicoCompE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Esp. Esq (cm)' : 'Esp. (cm)'}</label>
              <input type="text" value="${this.campos.ectopicoEspE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'ectopicoEspE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'ectopicoEspE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
          </div>
          ${isPlural ? `
            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/50">
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Comp. Dir (cm)</label>
                <input type="text" value="${this.campos.ectopicoCompD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'ectopicoCompD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'ectopicoCompD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Esp. Dir (cm)</label>
                <input type="text" value="${this.campos.ectopicoEspD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'ectopicoEspD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'ectopicoEspD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (this.chipsSelecionados.includes('Cisto')) {
      const isPlural = this.campos.cistoLado === 'esquerdo e direito';
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Cisto Testicular</span>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
            <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'cistoLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.ladoOpcoes.map(opt => `<option value="${opt.value}" ${this.campos.cistoLado === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Diâmetro Esq (cm)' : 'Diâmetro (cm)'}</label>
              <input type="text" value="${this.campos.cistoDiamE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'cistoDiamE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'cistoDiamE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            ${isPlural ? `
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Diâmetro Dir (cm)</label>
                <input type="text" value="${this.campos.cistoDiamD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'cistoDiamD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'cistoDiamD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    if (this.chipsSelecionados.includes('Fibrose')) {
      const isPlural = this.campos.fibroseLado === 'esquerdo e direito';
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Fibrose Testicular</span>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
            <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'fibroseLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.ladoOpcoes.map(opt => `<option value="${opt.value}" ${this.campos.fibroseLado === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Comp. Esq (cm)' : 'Comp. (cm)'}</label>
              <input type="text" value="${this.campos.fibroseCompE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'fibroseCompE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'fibroseCompE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Esp. Esq (cm)' : 'Esp. (cm)'}</label>
              <input type="text" value="${this.campos.fibroseEspE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'fibroseEspE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'fibroseEspE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
          </div>
          ${isPlural ? `
            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/50">
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Comp. Dir (cm)</label>
                <input type="text" value="${this.campos.fibroseCompD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'fibroseCompD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'fibroseCompD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Esp. Dir (cm)</label>
                <input type="text" value="${this.campos.fibroseEspD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'fibroseEspD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'fibroseEspD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (this.chipsSelecionados.includes('Neoplasia')) {
      const isPlural = this.campos.neoplasiaLado === 'esquerdo e direito';
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Processo Neoplásico</span>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
            <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.ladoOpcoes.map(opt => `<option value="${opt.value}" ${this.campos.neoplasiaLado === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Comp. Esq (cm)' : 'Comp. (cm)'}</label>
              <input type="text" value="${this.campos.neoplasiaCompE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaCompE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaCompE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
            <div>
              <label class="block text-[9px] font-bold text-slate-500 uppercase">${isPlural ? 'Esp. Esq (cm)' : 'Esp. (cm)'}</label>
              <input type="text" value="${this.campos.neoplasiaEspE}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaEspE', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaEspE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
            </div>
          </div>
          ${isPlural ? `
            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/50">
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Comp. Dir (cm)</label>
                <input type="text" value="${this.campos.neoplasiaCompD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaCompD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaCompD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-500 uppercase">Esp. Dir (cm)</label>
                <input type="text" value="${this.campos.neoplasiaEspD}" onfocus="if(this.value==='0,00')this.value=''" onblur="if(this.value.trim()==='')PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaEspD', '0,00')" oninput="PainelConfigurador.atualizarCampo('testiculos', 'neoplasiaEspD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono">
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (this.chipsSelecionados.includes('Hidrocele')) {
      html += `
        <div class="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 mt-3">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block border-b border-emerald-200 dark:border-emerald-800 pb-1">Hidrocele / Coleção Líquida</span>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Conteúdo Líquido</label>
            <select onchange="PainelConfigurador.atualizarCampo('testiculos', 'hidroceleConteudo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold">
              ${this.options.hidroceleConteudoOpcoes.map(opt => `<option value="${opt.value}" ${this.campos.hidroceleConteudo === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
        </div>
      `;
    }

    return html;
  }
};