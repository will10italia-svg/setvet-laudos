// js/abdominal/painel.ab.js
const ModuloPainelPaciente = {
  renderizarFicha: function(paciente, idAnimal, tutor, especie, raca, sexo, textoStatusRepro, idadeAnos, idadeMeses, porte, requisitante, clinica) {
    
    // 1. Monta os valores base vindos dos inputs do painel esquerdo
    let racaBase = '';
    if (especie || raca) {
      racaBase = `${especie || ''} ${raca ? '- ' + raca : ''}`.trim();
    }

    let sexoBase = '';
    if (sexo) {
      sexoBase = `${sexo}${textoStatusRepro ? ' (' + textoStatusRepro + ')' : ''}`;
    }

    let idadePorteBase = '';
    const anosStr = idadeAnos ? `${idadeAnos}a ` : '';
    const mesesStr = (idadeMeses !== undefined && idadeMeses !== '') ? `${idadeMeses}m` : '';
    const parteIdade = `${anosStr}${mesesStr}`.trim();
    
    if (parteIdade && porte) {
      idadePorteBase = `${parteIdade} / ${porte}`;
    } else {
      idadePorteBase = parteIdade || porte || '';
    }

    // 2. Define prioridade: se o usuário digitou no painel esquerdo, usa ele. Se o campo esquerdo estiver vazio, permite edição manual à direita.
    const safePaciente = paciente !== '' ? paciente : (EstadoApp.textosEditadosManualmente['p_paciente'] || '');
    const safeId = idAnimal !== '' ? idAnimal : (EstadoApp.textosEditadosManualmente['p_id'] || '');
    const safeTutor = tutor !== '' ? tutor : (EstadoApp.textosEditadosManualmente['p_tutor'] || '');
    const safeRacaFinal = racaBase !== '' ? racaBase : (EstadoApp.textosEditadosManualmente['p_raca'] || '');
    const safeSexoFinal = sexoBase !== '' ? sexoBase : (EstadoApp.textosEditadosManualmente['p_sexo'] || '');
    const safeIdadeFinal = idadePorteBase !== '' ? idadePorteBase : (EstadoApp.textosEditadosManualmente['p_idade'] || '');
    const safeReq = requisitante !== '' ? requisitante : (EstadoApp.textosEditadosManualmente['p_req'] || '');
    const safeClinica = clinica !== '' ? clinica : (EstadoApp.textosEditadosManualmente['p_clinica'] || '');
    const safeData = EstadoApp.textosEditadosManualmente['hdr_data'] || '';

    return `
      <div>
        <div class="laudo-header">
          <div>
            <div class="text-2xl font-extrabold text-vet-600 dark:text-emerald-400 leading-none">Setvet</div>
            <div class="text-[10px] font-bold tracking-widest text-slate-400 mt-1 uppercase">MEDICINA VETERINÁRIA DIAGNÓSTICA</div>
          </div>
          <div class="text-right">
            <h2 class="text-base font-bold">Laudo Ultrassonográfico</h2>
            <div class="text-xs text-slate-500 font-medium"><b>Data:</b> <span contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('hdr_data', this)">${safeData}</span></div>
          </div>
        </div>
        <div class="patient-card-clean">
          <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-xs">
            <div><span class="card-label">PACIENTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_paciente', this)">${safePaciente}</span></div>
            <div><span class="card-label">ID / PRONTUÁRIO:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_id', this)">${safeId}</span></div>
            <div><span class="card-label">TUTOR:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_tutor', this)">${safeTutor}</span></div>
            <div><span class="card-label">ESPÉCIE / RAÇA:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_raca', this)">${safeRacaFinal}</span></div>
            <div><span class="card-label">SEXO / REPRO:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_sexo', this)">${safeSexoFinal}</span></div>
            <div><span class="card-label">IDADE / PORTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_idade', this)">${safeIdadeFinal}</span></div>
            <div><span class="card-label">REQUISITANTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_req', this)">${safeReq}</span></div>
            <div><span class="card-label">CLÍNICA PARCEIRA:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_clinica', this)">${safeClinica}</span></div>
            <div></div>
          </div>
        </div>
      </div>
    `;
  }
};
