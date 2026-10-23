let refHtml = '';
      const jaPossuiRef = textoFinal && textoFinal.includes('ref-text');
      if (!jaPossuiRef) {
        if (idOrgao === 'estomago') {
          const med = parseFloat((orgao.campos.medida || '0').toString().replace(',', '.')) || 0;
          const lim = porte === 'Felino' ? 0.25 : (porte === 'Cão G' ? 0.40 : 0.30);
          const alertClass = (med > 0 && med > lim) ? 'is-alert alerta-vermelho' : '';
          const medFormatada = med > 0 ? med.toFixed(2).replace('.', ',') : '0,00';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_estomago', this)">Ref: (${porte || 'Cão P'}: até ${lim.toFixed(2).replace('.', ',')}cm - Medido: ${medFormatada}cm)</span>`;
        } else if (idOrgao === 'rins') {
          const valE = parseFloat((orgao.campos.medidaEsq || orgao.campos.rimeMedida || '0').toString().replace(',', '.')) || 0;
          const valD = parseFloat((orgao.campos.medidaDir || orgao.campos.rimdMedida || '0').toString().replace(',', '.')) || 0;
          const maxLim = porte === 'Felino' ? 4.3 : (porte === 'Cão G' ? 7.0 : (porte === 'Cão M' ? 5.5 : 4.0));
          const alertClass = (valE > maxLim || valD > maxLim) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_rins', this)">Ref Rins: (${porte || 'Cão P'} até ${maxLim.toFixed(1).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'vesicula_urinaria') {
          const med = parseFloat((orgao.campos.medidaParedes || orgao.campos.medida || '0').toString().replace(',', '.')) || 0;
          const lim = especie === 'Felino' ? 0.20 : 0.30;
          const alertClass = (med > 0 && med > lim) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_vesicula_urinaria', this)">Ref: (${especie || 'Canino'}: até ${lim.toFixed(2).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'pancreas') {
          const med = parseFloat((orgao.campos.medida || '0').toString().replace(',', '.')) || 0;
          const lim = especie === 'Felino' ? 0.8 : 1.0;
          const alertClass = (med > 0 && med > lim) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_pancreas', this)">Ref Pâncreas: (${especie || 'Canino'}: até ${lim.toFixed(1).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'adrenais') {
          const valE = parseFloat((orgao.campos.medidaEsq || orgao.campos.aeCaudal || '0').toString().replace(',', '.')) || 0;
          const valD = parseFloat((orgao.campos.medidaDir || orgao.campos.adCaudal || '0').toString().replace(',', '.')) || 0;
          const lim = porte === 'Felino' ? 0.45 : 0.58;
          const alertClass = (valE > lim || valD > lim) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_adrenais', this)">Ref Polo Caudal: (${porte || 'Cão P'}: até ${lim.toFixed(2).replace('.', ',')}cm)</span>`;
        } else if (idOrgao === 'ovarios') {
          const valE = parseFloat((orgao.campos.medidaEsq || orgao.campos.oeMedida || '0').toString().replace(',', '.')) || 0;
          const valD = parseFloat((orgao.campos.medidaDir || orgao.campos.odMedida || '0').toString().replace(',', '.')) || 0;
          const alertClass = (valE > 2.0 || valD > 2.0) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_ovarios', this)">Ref Ovários: (Até 2,0cm)</span>`;
        } else if (idOrgao === 'utero') {
          const valE = parseFloat((orgao.campos.medidaEsq || '0').toString().replace(',', '.')) || 0;
          const valD = parseFloat((orgao.campos.medidaDir || '0').toString().replace(',', '.')) || 0;
          const alertClass = (valE > 0.80 || valD > 0.80) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_utero', this)">Ref Útero: (0,50cm - 0,80cm)</span>`;
        } else if (idOrgao === 'prostata') {
          const val1 = parseFloat((orgao.campos.medida1 || orgao.campos.medida || '0').toString().replace(',', '.')) || 0;
          const alertClass = (val1 > 2.5) ? 'is-alert alerta-vermelho' : '';
          refHtml = `<span class="ref-text ${alertClass}" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('ref_prostata', this)">Ref Próstata: (Até 2,5cm)</span>`;
        }
      }
