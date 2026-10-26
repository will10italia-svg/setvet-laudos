// js/abdominal/orgaos/prostata.js

window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.prostata = {
  id: 'prostata',
  nome: 'Próstata',
  icone: '🔵',
  oculto: false,

  campos: {
    posicao: 'em posição tópica (região pélvica/abdominal caudal)',
    simetria: 'simétrica',
    contornos: 'regulares',
    ecogenicidade: 'homogênea',
    ecotextura: 'fina e homogênea',
    medida1: '0,00',
    medida2: '0,00'
  },

  options: {
    posicao: [
      { value: 'em posição tópica (região pélvica/abdominal caudal)', label: 'em posição tópica (pélvica/abdominal caudal)' },
      { value: 'deslocada cranial e/or ventralmente', label: 'deslocada cranial e/ou ventralmente' }
    ],
    simetria: [
      { value: 'simétrica', label: 'simétrica' },
      { value: 'assimétrica', label: 'assimétrica' }
    ],
    contornos: [
      { value: 'regulares', label: 'regulares' },
      { value: 'irregulares', label: 'irregulares' }
    ],
    ecogenicidade: [
      { value: 'homogênea', label: 'homogênea' },
      { value: 'heterogênea', label: 'heterogênea' }
    ],
    ecotextura: [
      { value: 'fina e homogênea', label: 'fina e homogênea' },
      { value: 'grosseira e heterogênea', label: 'grosseira e heterogênea' }
    ]
  },

  labels: {
    medida1: 'Comprimento / Diâmetro 1 (cm)',
    medida2: 'Altura / Diâmetro 2 (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { id: 'HBP', rotulo: 'Hiperplasia Prostática Benigna (HPB)', texto: '' },
    { id: 'Prostatite', rotulo: 'Prostatite / Abscesso', texto: '' },
    { id: 'Cisto', rotulo: 'Cisto Prostático / Paraprostático', texto: '' }
  ],

  obterLimiteReferencia: function() {
    const elPorte = document.getElementById('p-porte');
    const porteVal = elPorte ? elPorte.value : 'Cão P';

    let limiteMax = 2.5; // Cão P: 2,0 a 2,5 cm
    if (porteVal === 'Cão M') limiteMax = 3.5; // Cão M: 3,0 a 3,5 cm
    else if (porteVal === 'Cão G') limiteMax = 4.5; // Cão G: 4,0 a 4,5 cm

    return { porte: porteVal, limite: limiteMax };
  },

  gerarTexto: function(c) {
    let txt = `apresentando dimensões preservadas, ${c.posicao}, ${c.simetria}, de contornos ${c.contornos}, ecogenicidade ${c.ecogenicidade} e ecotextura ${c.ecotextura}, sem evidências de cistos ou mineralizações intraparenquimatosas visibilizadas:<br>`;

    const m1 = parseFloat((c.medida1 || '0').replace(',', '.')) || 0;
    const m2 = parseFloat((c.medida2 || '0').replace(',', '.')) || 0;

    let linhas = [];
    if (m1 > 0) linhas.push(`• Diâmetro longitudinal: ${c.medida1} cm`);
    if (m2 > 0) linhas.push(`• Diâmetro transverso / altura: ${c.medida2} cm`);

    if (linhas.length > 0) {
      txt += linhas.join('<br>');
    }

    return txt;
  },

  renderCamposCustomizados: function() {
    const ref = this.obterLimiteReferencia();
    let html = `<div class="space-y-3">
      <div class="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-zinc-700 pb-1">
          <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Biometria da Próstata</span>
          <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">(Ref: ${ref.porte} até ${ref.limite.toFixed(1).replace('.', ',')}cm)</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medida 1 (cm)</label>
            <input type="text" value="${this.campos.medida1}" oninput="PainelConfigurador.atualizarCampo('prostata', 'medida1', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono font-bold text-emerald-600">
          </div>
          <div>
            <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medida 2 (cm)</label>
            <input type="text" value="${this.campos.medida2}" oninput="PainelConfigurador.atualizarCampo('prostata', 'medida2', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs text-center font-mono font-bold text-emerald-600">
          </div>
        </div>
      </div>
    </div>`;
    return html;
  }
};
