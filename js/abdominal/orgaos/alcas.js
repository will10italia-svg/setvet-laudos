// js/orgaos/intestino.js

if (!window.CONFIGURACAO_ORGAOS) {
  window.CONFIGURACAO_ORGAOS = {};
}

window.CONFIGURACAO_ORGAOS.intestino = {
  id: 'intestino',
  nome: 'Alças Intestinais',
  icone: '🌀',
  oculto: false,

  opcoesConteudo: [
    "fecal / gasoso",
    "predominantemente fecal",
    "fecal",
    "fecal / pastoso",
    "fecal / gasoso / pastoso",
    "pastoso",
    "pastoso / gasoso"
  ],

  campos: {
    padrao: 'com padrão em camadas mantido',
    peristaltismo: true,
    conteudoGeralAtivo: false,
    conteudoGeralVal: 'fecal / gasoso',

    // Segmentos
    duodenoEspessura: 'preservada',
    duodenoMedida: '0,00',
    duodenoConteudo: 'fecal / gasoso',

    jejunoEspessura: 'preservada',
    jejunoMedida: '0,00',
    jejunoConteudo: 'fecal / gasoso',

    colondEspessura: 'preservada',
    colondMedida: '0,00',
    colondConteudo: 'fecal / gasoso',

    colonaEspessura: 'preservada',
    colonaMedida: '0,00',
    colonaConteudo: 'fecal / gasoso',

    colontEspessura: 'preservada',
    colontMedida: '0,00',
    colontConteudo: 'fecal / gasoso',

    ileoEspessura: 'preservada',
    ileoMedida: '0,00',
    ileoConteudo: 'fecal / gasoso',

    // Achados Adicionais
    sombreamentoAtivo: false,
    sombreamentoLocal: 'cólon',

    intussuscepcaoAtivo: false,
    intussuscepcaoRegiao: '[região]',
    intussuscepcaoMed1: '0,00',
    intussuscepcaoMed2: '0,00',

    espessamentoAtivo: false,
    espessamentoSegmento: '[segmento]',
    espessamentoMed1: '0,00',
    espessamentoMed2: '0,00',

    corpoEstranhoAtivo: false,
    corpoEstranhoPlural: false,
    corpoEstranhoMedida: '0,00',

    ceLinearAtivo: false,
    ceLinearSegmento: '[segmento]',
    ceLinearMedida: '0,00'
  },

  labels: {
    padrao: 'Padrão Geral das Alças'
  },

  chipsPatologias: [
    { id: 'sombreamento', rotulo: 'Sombreamento em Cólon', texto: 'Conteúdo formador de sombreamento acústico posterior em cólon.' },
    { id: 'intussuscepcao', rotulo: 'Intussuscepção', texto: 'Imagem sugestiva de intussuscepção intestinal.' },
    { id: 'espessamento', rotulo: 'Espessamento Focal', texto: 'Espessamento focal de parede intestinal.' },
    { id: 'corpoEstranho', rotulo: 'Corpo Estranho', texto: 'Estrutura formadora de sombreamento acústico intraluminal.' },
    { id: 'ceLinear', rotulo: 'Corpo Estranho Linear', texto: 'Plissamento de alça por estrutura linear intraluminal.' }
  ],
  chipsSelecionados: [],

  onInit: function() {
    this.atualizarVisibilidadeCampos();
  },

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;
    delete EstadoApp.textosEditadosManualmente['intestino'];
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  toggleAchadoOption: function(achadoId) {
    const propMap = {
      sombreamento: 'sombreamentoAtivo',
      intussuscepcao: 'intussuscepcaoAtivo',
      espessamento: 'espessamentoAtivo',
      corpoEstranho: 'corpoEstranhoAtivo',
      ceLinear: 'ceLinearAtivo'
    };

    const prop = propMap[achadoId];
    if (prop) {
      this.campos[prop] = !this.campos[prop];
      if (this.campos[prop]) {
        if (!this.chipsSelecionados.includes(achadoId)) this.chipsSelecionados.push(achadoId);
      } else {
        const idx = this.chipsSelecionados.indexOf(achadoId);
        if (idx >= 0) this.chipsSelecionados.splice(idx, 1);
      }
    }

    delete EstadoApp.textosEditadosManualmente['intestino'];
    PainelConfigurador.renderizar();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  aplicarConteudoGeral: function(valor) {
    this.campos.conteudoGeralVal = valor;
    if (this.campos.conteudoGeralAtivo) {
      this.campos.duodenoConteudo = valor;
      this.campos.jejunoConteudo = valor;
      this.campos.colondConteudo = valor;
      this.campos.colonaConteudo = valor;
      this.campos.colontConteudo = valor;
      this.campos.ileoConteudo = valor;
    }
    delete EstadoApp.textosEditadosManualmente['intestino'];
    PainelConfigurador.renderizar();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  toggleConteudoGeralCheck: function(checked) {
    this.campos.conteudoGeralAtivo = checked;
    if (checked) {
      this.aplicarConteudoGeral(this.campos.conteudoGeralVal);
    } else {
      delete EstadoApp.textosEditadosManualmente['intestino'];
      PainelConfigurador.renderizar();
      AppInterface.marcarComoRascunho();
      MotorLaudo.atualizarPaginasLaudo();
    }
  },

  atualizarVisibilidadeCampos: function() {
    // Sincronizar checkboxes de achados com chipsSelecionados
    ['sombreamento', 'intussuscepcao', 'espessamento', 'corpoEstranho', 'ceLinear'].forEach(id => {
      const propMap = {
        sombreamento: 'sombreamentoAtivo',
        intussuscepcao: 'intussuscepcaoAtivo',
        espessamento: 'espessamentoAtivo',
        corpoEstranho: 'corpoEstranhoAtivo',
        ceLinear: 'ceLinearAtivo'
      };
      const isAtivo = this.campos[propMap[id]];
      if (isAtivo && !this.chipsSelecionados.includes(id)) {
        this.chipsSelecionados.push(id);
      } else if (!isAtivo) {
        const idx = this.chipsSelecionados.indexOf(id);
        if (idx >= 0) this.chipsSelecionados.splice(idx, 1);
      }
    });
  },

  renderCamposCustomizados: function() {
    let html = `
      <div class="space-y-3">
        <!-- Padrão Geral e Peristaltismo -->
        <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Padrão Geral em Camadas:</label>
            <select onchange="CONFIGURACAO_ORGAOS.intestino.campos.padrao = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
              <option value="com padrão em camadas mantido" ${this.campos.padrao === 'com padrão em camadas mantido' ? 'selected' : ''}>com padrão em camadas mantido</option>
              <option value="com alguns segmentos de aspecto corrugado e camada muscular mais evidente" ${this.campos.padrao.includes('aspecto corrugado e camada muscular mais evidente') ? 'selected' : ''}>com alguns segmentos de aspecto corrugado e camada muscular mais evidente</option>
              <option value="com alguns segmentos de aspecto levemente corrugado e camada muscular discretamente evidente" ${this.campos.padrao.includes('levemente corrugado') ? 'selected' : ''}>com alguns segmentos de aspecto levemente corrugado e camada muscular discretamente evidente</option>
            </select>
          </div>

          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer pt-1">
            <input type="checkbox" ${this.campos.peristaltismo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.intestino.campos.peristaltismo = this.checked; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="accent-emerald-600 w-4 h-4 rounded">
            <span>Peristaltismo evolutivo presente</span>
          </label>
        </div>

        <!-- Conteúdo Geral Reutilizável -->
        <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
            <input type="checkbox" ${this.campos.conteudoGeralAtivo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.intestino.toggleConteudoGeralCheck(this.checked)" class="accent-emerald-600 w-4 h-4 rounded">
            <span>Conteúdo Geral (Aplicar mesmo conteúdo a todas as alças)</span>
          </label>
          ${this.campos.conteudoGeralAtivo ? `
            <select onchange="CONFIGURACAO_ORGAOS.intestino.aplicarConteudoGeral(this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
              ${this.opcoesConteudo.map(opt => `<option value="${opt}" ${this.campos.conteudoGeralVal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>
          ` : ''}
        </div>

        <!-- Segmentos Intestinais -->
        <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
          <label class="block text-[10px] font-bold text-slate-500 uppercase">Medidas e Conteúdo dos Segmentos:</label>
          
          ${this.renderLinhaSegmento('Duodeno', 'duodeno', '0,51')}
          ${this.renderLinhaSegmento('Jejuno', 'jejuno', '0,20 a 0,40')}
          ${this.renderLinhaSegmento('Cólon Descendente', 'colond', '0,30')}
          ${this.renderLinhaSegmento('Cólon Ascendente', 'colona', '0,30')}
          ${this.renderLinhaSegmento('Cólon Transverso', 'colont', '0,30')}
          ${this.renderLinhaSegmento('Íleo', 'ileo', '0,28')}
        </div>

        <!-- Achados Adicionais Checkboxes / Modais -->
        <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Achados Adicionais:</label>
          
          <div class="space-y-2 text-xs">
            <!-- Sombreamento em Cólon -->
            <div class="border-b border-slate-200 dark:border-zinc-700 pb-2">
              <label class="flex items-center gap-2 font-bold cursor-pointer dark:text-zinc-200">
                <input type="checkbox" ${this.campos.sombreamentoAtivo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.intestino.toggleAchadoOption('sombreamento')" class="accent-emerald-600 w-3.5 h-3.5 rounded">
                <span>Sombreamento em Cólon</span>
              </label>
              ${this.campos.sombreamentoAtivo ? `
                <div class="mt-1 pl-5">
                  <select onchange="CONFIGURACAO_ORGAOS.intestino.campos.sombreamentoLocal = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-xs">
                    <option value="cólon" ${this.campos.sombreamentoLocal === 'cólon' ? 'selected' : ''}>cólon</option>
                    <option value="cólon descendente" ${this.campos.sombreamentoLocal === 'cólon descendente' ? 'selected' : ''}>cólon descendente</option>
                    <option value="cólon transverso" ${this.campos.sombreamentoLocal === 'cólon transverso' ? 'selected' : ''}>cólon transverso</option>
                    <option value="cólon ascendente" ${this.campos.sombreamentoLocal === 'cólon ascendente' ? 'selected' : ''}>cólon ascendente</option>
                  </select>
                </div>
              ` : ''}
            </div>

            <!-- Intussuscepção -->
            <div class="border-b border-slate-200 dark:border-zinc-700 pb-2">
              <label class="flex items-center gap-2 font-bold cursor-pointer dark:text-zinc-200">
                <input type="checkbox" ${this.campos.intussuscepcaoAtivo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.intestino.toggleAchadoOption('intussuscepcao')" class="accent-emerald-600 w-3.5 h-3.5 rounded">
                <span>Intussuscepção</span>
              </label>
              ${this.campos.intussuscepcaoAtivo ? `
                <div class="mt-1 pl-5 space-y-1">
                  <input type="text" value="${this.campos.intussuscepcaoRegiao}" placeholder="Região" oninput="CONFIGURACAO_ORGAOS.intestino.campos.intussuscepcaoRegiao = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-xs">
                  <div class="flex items-center gap-1">
                    <input type="text" value="${this.campos.intussuscepcaoMed1}" oninput="CONFIGURACAO_ORGAOS.intestino.campos.intussuscepcaoMed1 = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
                    <input type="text" value="${this.campos.intussuscepcaoMed2}" oninput="CONFIGURACAO_ORGAOS.intestino.campos.intussuscepcaoMed2 = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Espessamento Focal -->
            <div class="border-b border-slate-200 dark:border-zinc-700 pb-2">
              <label class="flex items-center gap-2 font-bold cursor-pointer dark:text-zinc-200">
                <input type="checkbox" ${this.campos.espessamentoAtivo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.intestino.toggleAchadoOption('espessamento')" class="accent-emerald-600 w-3.5 h-3.5 rounded">
                <span>Espessamento Focal</span>
              </label>
              ${this.campos.espessamentoAtivo ? `
                <div class="mt-1 pl-5 space-y-1">
                  <input type="text" value="${this.campos.espessamentoSegmento}" placeholder="Segmento" oninput="CONFIGURACAO_ORGAOS.intestino.campos.espessamentoSegmento = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-xs">
                  <div class="flex items-center gap-1">
                    <input type="text" value="${this.campos.espessamentoMed1}" oninput="CONFIGURACAO_ORGAOS.intestino.campos.espessamentoMed1 = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
                    <input type="text" value="${this.campos.espessamentoMed2}" oninput="CONFIGURACAO_ORGAOS.intestino.campos.espessamentoMed2 = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Corpo Estranho -->
            <div class="border-b border-slate-200 dark:border-zinc-700 pb-2">
              <label class="flex items-center gap-2 font-bold cursor-pointer dark:text-zinc-200">
                <input type="checkbox" ${this.campos.corpoEstranhoAtivo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.intestino.toggleAchadoOption('corpoEstranho')" class="accent-emerald-600 w-3.5 h-3.5 rounded">
                <span>Corpo Estranho (Sombreamento)</span>
              </label>
              ${this.campos.corpoEstranhoAtivo ? `
                <div class="mt-1 pl-5 space-y-1">
                  <div class="flex items-center gap-2">
                    <input type="text" value="${this.campos.corpoEstranhoMedida}" oninput="CONFIGURACAO_ORGAOS.intestino.campos.corpoEstranhoMedida = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
                    <select onchange="CONFIGURACAO_ORGAOS.intestino.campos.corpoEstranhoPlural = (this.value === 'plural'); delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-xs">
                      <option value="singular" ${!this.campos.corpoEstranhoPlural ? 'selected' : ''}>Singular (corpo estranho)</option>
                      <option value="plural" ${this.campos.corpoEstranhoPlural ? 'selected' : ''}>Plural (corpos estranhos)</option>
                    </select>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Corpo Estranho Linear -->
            <div>
              <label class="flex items-center gap-2 font-bold cursor-pointer dark:text-zinc-200">
                <input type="checkbox" ${this.campos.ceLinearAtivo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.intestino.toggleAchadoOption('ceLinear')" class="accent-emerald-600 w-3.5 h-3.5 rounded">
                <span>Corpo Estranho Linear</span>
              </label>
              ${this.campos.ceLinearAtivo ? `
                <div class="mt-1 pl-5 space-y-1">
                  <input type="text" value="${this.campos.ceLinearSegmento}" placeholder="Segmento" oninput="CONFIGURACAO_ORGAOS.intestino.campos.ceLinearSegmento = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-xs">
                  <div class="flex items-center gap-1">
                    <input type="text" value="${this.campos.ceLinearMedida}" oninput="CONFIGURACAO_ORGAOS.intestino.campos.ceLinearMedida = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm de comprimento
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    return html;
  },

  renderLinhaSegmento: function(rotulo, keyPrefix, refText) {
    const espVal = this.campos[`${keyPrefix}Espessura`];
    const medVal = this.campos[`${keyPrefix}Medida`];
    const contVal = this.campos[`${keyPrefix}Conteudo`];
    const desabilitadoConteudo = this.campos.conteudoGeralAtivo;

    return `
      <div class="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700 space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-700 dark:text-zinc-200">&bull; ${rotulo}:</span>
          <span class="text-[10px] text-slate-400 font-mono">(Ref: ${refText}cm)</span>
        </div>
        <div class="flex flex-wrap items-center gap-1.5 text-xs">
          <select onchange="CONFIGURACAO_ORGAOS.intestino.campos['${keyPrefix}Espessura'] = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded p-1 text-[11px]">
            <option value="preservada" ${espVal === 'preservada' ? 'selected' : ''}>preservada</option>
            <option value="aumentada" ${espVal === 'aumentada' ? 'selected' : ''}>aumentada</option>
          </select>

          <input type="text" value="${medVal}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.intestino.campos['${keyPrefix}Medida'] = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="w-14 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold text-[11px]"> cm

          <select ${desabilitadoConteudo ? 'disabled' : ''} onchange="CONFIGURACAO_ORGAOS.intestino.campos['${keyPrefix}Conteudo'] = this.value; delete EstadoApp.textosEditadosManualmente['intestino']; MotorLaudo.atualizarPaginasLaudo();" class="flex-1 min-w-[120px] bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded p-1 text-[11px] ${desabilitadoConteudo ? 'opacity-50' : ''}">
            ${this.opcoesConteudo.map(opt => `<option value="${opt}" ${contVal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  },

  gerarTexto: function(c) {
    let textoComplementarPadrao = '';
    if (c.padrao && c.padrao.includes('corrugado')) {
      textoComplementarPadrao = ' (Sugestivo de processo inflamatório intestinal, tendo como diagnóstico diferencial a Doença Inflamatória Intestinal, não descartando a possibilidade de processo infiltrativo neoplásico)';
    }

    let pPeristaltismo = '';
    if (c.peristaltismo) {
      pPeristaltismo = '<p style="margin-top: 0.4rem;">• peristaltismo evolutivo nos segmentos passíveis de serem visibilizados.</p>';
    }

    let txt = `fígado de distribuição topográfica habitual, ${c.padrao}${textoComplementarPadrao} e ecogenicidade dentro dos limites da normalidade, com:\n`;
    txt = `de distribuição topográfica habitual, ${c.padrao}${textoComplementarPadrao} e ecogenicidade dentro dos limites da normalidade, com:\n`;

    txt += `• duodeno: com espessura ${c.duodenoEspessura} mensurando ${c.duodenoMedida} cm, preenchido por conteúdo ${c.duodenoConteudo}\n`;
    txt += `• jejuno: com espessura ${c.jejunoEspessura} mensurando ${c.jejunoMedida} cm, preenchido por conteúdo ${c.jejunoConteudo}\n`;
    txt += `• cólon descendente: com espessura ${c.colondEspessura} mensurando ${c.colondMedida} cm, preenchido por conteúdo ${c.colondConteudo}\n`;
    txt += `• cólon ascendente: com espessura ${c.colonaEspessura} mensurando ${c.colonaMedida} cm, preenchido por conteúdo ${c.colonaConteudo}\n`;
    txt += `• cólon transverso: com espessura ${c.colontEspessura} mensurando ${c.colontMedida} cm, preenchido por conteúdo ${c.colontConteudo}\n`;
    txt += `• íleo: com espessura ${c.ileoEspessura} mensurando ${c.ileoMedida} cm, preenchido por conteúdo ${c.ileoConteudo}`;

    if (c.peristaltismo) {
      txt += `\n• peristaltismo evolutivo nos segmentos passíveis de serem visibilizados.`;
    }

    // Anexar Achados Adicionais
    if (c.sombreamentoAtivo) {
      txt += `\nEm ${c.sombreamentoLocal} nota-se conteúdo formador de sombreamento acústico posterior, sem dilatação/alteração de segmentos anteriores (Sugestivo de conteúdo fecal acumulado/ressecado, não descartando-se totalmente a possibilidade de corpo estranho intestinal – sugere-se acompanhamento sonográfico e/ou radiográfico à critério do clínico responsável).`;
    }

    if (c.intussuscepcaoAtivo) {
      txt += `\nEm região ${c.intussuscepcaoRegiao}, visibiliza-se segmento intestinal com aspecto de múltiplas camadas, caracterizado por imagem de anéis concêntricos no corte longitudinal e imagem em alvo no corte transversal, medindo em seu todo cerca de ${c.intussuscepcaoMed1} cm x ${c.intussuscepcaoMed2} cm (Relacionado a intussuscepção).`;
    }

    if (c.espessamentoAtivo) {
      txt += `\nNota-se segmento intestinal ${c.espessamentoSegmento} espessamento focal de parede com perda da estratificação parietal, medindo cerca de ${c.espessamentoMed1} cm x ${c.espessamentoMed2} cm (Pode estar relacionado a processo infiltrativo neoplásico).`;
    }

    if (c.corpoEstranhoAtivo) {
      const termoEstrutura = c.corpoEstranhoPlural ? 'estruturas' : 'estrutura';
      const termoConclusao = c.corpoEstranhoPlural ? '(Sugestivos de corpos estranhos intestinais)' : '(Sugestivo de corpo estranho intestinal)';
      txt += `\nNota-se presença de ${termoEstrutura} formadora de sombreamento acústico posterior, medindo cerca de ${c.corpoEstranhoMedida} cm de comprimento, associado a acúmulo de conteúdo líquido particulado intraluminal anteriormente à estrutura supracitada ${termoConclusao}.`;
    }

    if (c.ceLinearAtivo) {
      txt += `\nEm segmento intestinal ${c.ceLinearSegmento}, evidencia-se plissamento de alça secundário à presença de estrutura linear e hiperecogênica intraluminal, não formadora de sombreamento acústico posterior, medindo cerca de ${c.ceLinearMedida} cm de comprimento (Relacionado a corpo estranho linear).`;
    }

    return txt;
  }
};