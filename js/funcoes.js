// inicialização de variáveis
{
    var tarefas = []
    var diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]
    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    var pontosDia = 0

    var taskDefault = `
    [{
        "id": "1",
        "tarefa": "Cuidar do pet",
        "peso": "5"
    },
    {
        "id": "2",
        "tarefa": "Guardar os brinquedos",
        "peso": "2"
    },
    {
        "id": "3",
        "tarefa": "Respeitar os pais",
        "peso": "7"
    }]
    `;
}

class Tarefa {
    constructor(id, tarefa, peso) {
        this.id = id;
        this.tarefa = tarefa;
        this.peso = peso;
    }
}

// preenche modal com a lista de tarefas
function lerTarefas() {

    dados = JSON.parse(tarefas)

    for (let i = 0; i < dados.length; i++) {

        $(`input[id="tarefa_nam${i}"]`).val(dados[i].tarefa)
        $(`input[id="tarefa_val${i}"]`).val(dados[i].peso)

    }
}

// grava tarefas do modal no storage
function salvarTarefas() {
    let _confirm = confirm("Ao definir novas tarefas, o progresso atual será perdido, tem certeza que deseja continuar?")

    if (_confirm) {

        dados = []

        for (let i = 0; i < 8; i++) {

            dados.push(new Tarefa(i, $(`input[id = "tarefa_nam${i}"]`).val(), $(`input[id = "tarefa_val${i}"]`).val()))

            // $(`input[id = "tarefa_nam${i}"]`).val()
            // $(`input[id = "tarefa_val${i}"]`).val()

            // obtém valor de pontos por dia
            if($(`input[id = "tarefa_val${i}"]`).val() !== ""){
                pontosDia += parseInt($(`input[id = "tarefa_val${i}"]`).val())
            }
        }

        // setando os valores no Storage
        localStorage.setItem("__tarefas__", JSON.stringify(dados))
        alert("Redefinido com sucesso!")
    }
    $("#modalRegistro").modal("hide")
}

// popula calendário
function carregaTabela() {

    var conteudo = `<table class='table'><tr> 
        <th>${diasSemana[0]}</th>
        <th>${diasSemana[1]}</th>
        <th>${diasSemana[2]}</th>
        <th>${diasSemana[3]}</th>
        <th>${diasSemana[4]}</th>
        <th>${diasSemana[5]}</th>
        <th>${diasSemana[6]}</th>
        </tr>
        `;

    if ($(mes_analisado).val() == "") {

        document.getElementById('mes_nome').innerHTML = "Selecione um mês"
        return false
    } else {
        // Armazena a data ao rodar pela primeira vez
        localStorage.setItem("__mes_analisado__", $(mes_analisado).val());
    }

    let ultimoDiaTela = getUltimoDiaTela()

    // Pega o primeiro dia da semana (DOM / SEG / ...)
    let diaSemana = new Date($(mes_analisado).val().substring(0, 8) + '01').getUTCDay()

    let cont = 0; //conta as semanas

    for (let i = 1; i <= ultimoDiaTela; i++) {

        if (cont == 0) {
            conteudo += "<tr>"
        } else if (cont == 7) {
            conteudo += "</tr>"
            cont = 0
        }

        if (i == 1) {
            switch (diaSemana) {
                case 0:
                    conteudo += `<td>${i}</td>`
                    cont += 1
                    break;
                case 1:
                    conteudo += `<td></td><td>${i}</td>`
                    cont += 2
                    break;
                case 2:
                    conteudo += `<td></td><td></td><td>${i}</td>`
                    cont += 3
                    break;
                case 3:
                    conteudo += `<td></td><td></td><td></td><td>${i}</td>`
                    cont += 4
                    break;
                case 4:
                    conteudo += `<td></td><td></td><td></td><td></td><td>${i}</td>`
                    cont += 5
                    break;
                case 5:
                    conteudo += `<td></td><td></td><td></td><td></td><td></td><td>${i}</td>`
                    cont += 6
                    break;
                case 6:
                    conteudo += `<td></td><td></td><td></td><td></td><td></td><td></td><td>${i}</td>`
                    cont += 7
                    break;
            }
            continue;
        } else {
            conteudo += `<td>${i}</td>` //onclick=''
        }

        cont++
    }

    conteudo += "</table>";

    document.getElementById("conteudoJSON").innerHTML = conteudo;
}

// obtém ultimo dia do mês / nome do mês vigente
function getUltimoDiaTela() {

    // Obtém o último dia do mês
    let lastday = function (y, m) {
        return new Date(y, m, 0).getDate()
    }

    let mesAnalisado = document.getElementById(mes_analisado)

    // define na tela o nome do mês de acordo com a posição no array
    document.getElementById('mes_nome').innerHTML = meses[
        new Date($(mes_analisado).val()).getUTCMonth()
    ]

    return lastday(
        $(mes_analisado).val().substring(0, 4),
        $(mes_analisado).val().substring(5, 7)
    )
}

// busca dados no storage
function lerStorage() {
    // Recebe dados do armazenamento local
    $(mes_analisado).val(localStorage.getItem("__mes_analisado__"))

    tarefas = localStorage.getItem("__tarefas__");
    if (tarefas == null) {
        localStorage.setItem("__tarefas__", taskDefault)
        document.location.reload(true);
    }

    // dados = JSON.parse(localStorage.getItem("__dados__"))
}

window.onload = lerStorage(), carregaTabela(); // carrega a tabela junto com a página