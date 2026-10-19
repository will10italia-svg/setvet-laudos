// js/orgaos/figado.js

if (!window.CONFIGURACAO_ORGAOS) {
  window.CONFIGURACAO_ORGAOS = {};
}

window.CONFIGURACAO_ORGAOS.figado = {
  id: 'figado',
  nome: 'Fígado',
  icone: '🩺',
  oculto: false,

  campos: {
    posicao: 'dentro dos limites do gradil costal',
    margens: 'afiladas',
    dimensoes: 'preservadas',
    ecotextura: 'homogênea',
    ecogenicidadeSelect: 'normal',
    arquitetura: 'preservada'
  },

  options: {
    posicao: [
      { value: 'dentro dos limites do gradil costal', label: 'dentro dos limites do gradil costal' },
      { value: 'ultrapassando os limites do gradil costal', label: 'ultrapassando os limites do gradil costal' }
    ],
    margens: [
      { value: 'afiladas', label: 'afiladas' },
      { value: 'abauladas', label: 'abauladas' }
    ],
    dimensoes: [
      { value: 'preservadas', label: 'preservadas' },
      { value: 'aumentadas (hepatomegalia)', label: 'aumentadas (hepatomegalia)' }
    ],
    ecotextura: [
      { value: 'homogênea', label: 'homogênea' },
      { value: 'heterogênea', label: 'heterogênea' }
    ],
    ecogenicidadeSelect: [
      { value: 'normal', label: 'dentro dos limites da normalidade' },
      { value: 'reduzida', label: 'reduzida' },
      { value: 'disc_reduzida', label: 'discretamente reduzida' },
      { value: 'int_reduzida', label: 'intensamente reduzida' },
      { value: 'elevada', label: 'elevada' },
      { value: 'disc_elevada', label: 'discretamente elevada' },
      { value: 'int_elevada', label: 'intensamente elevada' },
      { value: 'mista', label: 'mista' }
    ],
    arquitetura: [
      { value: 'preservada', label: 'preservadas quanto ao calibre e trajeto dos vasos' },
      { value: 'aumentada', label: 'aumentadas quanto ao calibre dos vasos e preservada quanto ao trajeto dos vasos' }
    ]
  },

  labels: {
    posicao: 'Posição',
    margens: 'Margens',
    dimensoes: 'Dimensões',
    ecotextura: 'Ecotextura',
    ecogenicidadeSelect: 'Ecogenicidade',
    arquitetura: 'Arquitetura Vascular'
  },

  chipsPatologias: [
    { id: 'hepatomegalia', rotulo: 'Hepatomegalia', texto: 'Fígado com dimensões aumentadas.' },
    { id: 'heterogeneo', texto: 'Ecotextura hepática heterogênea.' }
  ],
  chipsSelecionados: [],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    // Regras automáticas idênticas ao modelo original
    if (campo === 'posicao') {
      if (valor === 'ultrapassando os limites do gradil costal') {
        this.campos.dimensoes = 'aumentadas (hepatomegalia)';
        this.campos.margens = 'abauladas';
      }
    } else if (campo === 'dimensoes') {
      if (valor === 'aumentadas (hepatomegalia)') {
        this.campos.margens = 'abauladas';
      } else if (valor === 'preservadas') {
        this.campos.margens = 'afiladas';
      }
    }

    delete EstadoApp.textosEditadosManualmente['figado'];
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  gerarTexto: function(c) {
    // Textos complementares de ecogenicidade
    let textoEcogenicidadeObs = '';
    const ecoVal = c.ecogenicidadeSelect;
    if (ecoVal === 'reduzida' || ecoVal === 'disc_reduzida' || ecoVal === 'int_reduzida') {
      textoEcogenicidadeObs = ' (Sugestivo de toxemia e/ou congestão e/ou processo inflamatório)';
    } else if (ecoVal === 'elevada' || ecoVal === 'disc_elevada' || ecoVal === 'int_elevada') {
      textoEcogenicidadeObs = ' (Sugestivo de hepatopatia e/ou alteração metabólica e/ou infiltração gordurosa)';
    } else if (ecoVal === 'mista') {
      textoEcogenicidadeObs = ' (achado pode estar relacionado a hepatopatia inflamatória focal, infarto tecidual prévio, lesões expansivas lobares ou variações anatômicas de perfusão)';
    }

    // Texto complementar de arquitetura vascular
    let textoArqObs = '';
    if (c.arquitetura === 'aumentada') {
      textoArqObs = ' (achado pode estar relacionado a congestão passiva por insuficiência cardíaca direita, hipertensão portal ou obstrução ao fluxo venoso - como tromboses ou compressões por massas/neoplasias - à esclarecer, sugere-se correlacionar com demais exames à critério do clínico responsável)';
    }

    const ecoLabel = c.ecogenicidadeSelect === 'normal' ? 'dentro dos limites da normalidade' : c.ecogenicidadeSelect.replace('disc_', 'discretamente ').replace('int_', 'intensamente ');

    return `fígado ${c.posicao}, contornos definidos e regulares, margens ${c.margens}, dimensões ${c.dimensoes}, ecotextura ${c.ecotextura} e ecogenicidade ${ecoLabel}${textoEcogenicidadeObs}. Arquitetura vascular portal e intra-hepática ${c.arquitetura}${textoArqObs}.`;
  }
};