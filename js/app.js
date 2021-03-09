
// Adiciona um evento listener ao botão do form
const botao = document.querySelector('button');
botao.addEventListener('click', (evento) => {
      evento.preventDefault();
      const tbody = document.querySelector('tbody');
      // Reseta os valores da tabela
      tbody.innerHTML = "";
      // Seleciona os valores inseridos no form e os insere em um objeto
      const valoresInseridos = {
            valorTotalInserido: parseFloat(document.querySelector('#valor-total').value),
            prazoEmAnosInserido: parseFloat(document.querySelector('#prazo-anos').value),
            jurosAoAnoInserido: parseFloat(document.querySelector('#juros-ano').value.replace(/,/g, '.'))
      }
      const objValoresParaODOM = new valoresParaODOM(valoresInseridos.valorTotalInserido, valoresInseridos.prazoEmAnosInserido, valoresInseridos.jurosAoAnoInserido);
      if (objValoresParaODOM.jurosPagos[0] === undefined) {
            alert('Valor total ou juros mensais incorretos. Favor reinserir os dados.');
      } else {
            document.querySelector('#prazo-em-meses').value = objValoresParaODOM.prazoEmMeses;
            document.querySelector('#juros-ao-mes').value = objValoresParaODOM.jurosAoMes;
            document.querySelector('#juros-acumulados').value = (objValoresParaODOM.jurosAcumulados.toFixed(2));
            for (i = 0; i < 5; i++) {
                  let valorTotalAtual =   parseFloat(objValoresParaODOM.amortizacao) + parseFloat(objValoresParaODOM.jurosPagos[i]);
                  tbody.innerHTML += `<tr>
                                          <td>${i+1}</td>
                                          <td>${(objValoresParaODOM.amortizacao).toFixed(2)}</td>
                                          <td>${(objValoresParaODOM.jurosPagos[i]).toFixed(2)}</td>
                                          <td>${(valorTotalAtual).toFixed(2)}</td>
                                      </tr>`
            };
      };
});
// Gera os valores que serão inseridos no DOM e os reune em um objeto
class valoresParaODOM {
      constructor(valorTotal, prazoAnos, jurosAno) {
            this.prazoEmMeses = calcularPrazoEmMeses(prazoAnos);
            this.jurosAoMes = calcularTaxaDeJurosMensal(jurosAno);
            this.amortizacao = calcularAmortizacao(valorTotal, this.prazoEmMeses);
            this.jurosPagos = calcularJurosPagos(valorTotal, this.prazoEmMeses, this.jurosAoMes, this.amortizacao);
            this.jurosAcumulados = calcularJurosAcumulados(this.jurosPagos);
      };
};
// Declaração de funções
// Converte prazo de anos para meses
function calcularPrazoEmMeses(prazoEmAnos = 1) {
      return prazoEmAnos * 12;
};
// Converte taxa de juros anual para mensal
function calcularTaxaDeJurosMensal(taxaDeJurosAnual = 1) {
      return Math.pow((1 + parseFloat(taxaDeJurosAnual)), 1/12) - 1;
};
// Calcula a amortização
function calcularAmortizacao(valorTotalDoFinanciamento = 1, prazoEmMeses = 1) {
      return valorTotalDoFinanciamento / prazoEmMeses;
};
// Calcula todos os juros pagos por mês e os retorna em uma array
function calcularJurosPagos(valorTotalDoFinanciamento = 1, prazoEmMeses = 1, jurosMensais = 1, valorDaAmortizacao = 1) {
      let saldoDevedorParcial = 0,
          valoresCalculados = [];
      for (i = 0; i < prazoEmMeses; i++) {
            saldoDevedorParcial = valorTotalDoFinanciamento - (valorDaAmortizacao * i);
            valoresCalculados.push((saldoDevedorParcial * jurosMensais));
      }
      return valoresCalculados;
};
// Reduz uma array de valores pagos para gerar os juros acumulados
function calcularJurosAcumulados(valoresDeJurosPagos = []) {
      if (valoresDeJurosPagos[0] != undefined) {
            let calculoDeJurosAcumulados = valoresDeJurosPagos.reduce(function(total, numero) {
                  total = parseFloat(total);
                  return total + parseFloat(numero);
            });
            return calculoDeJurosAcumulados;
      }
};