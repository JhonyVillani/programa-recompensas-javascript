// inicialização de variáveis
{
    var url = ""
    var tarefas = [] //recebe o json da lista de tarefas
    var dados = [] //recebe a lista de tarefas (até 8)
    var historico = [] //recebe todas as tarefas do mês
    var contTarefas = 0 //contador para auxílio no modal
    var diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]
    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    var pontosDia = [0, 0] //tarefas, pontos

    var taskDefault = `
    [{
        "id": "1",
        "tarefa": "Cuidar do pet",
        "peso": "10"
    },
    {
        "id": "2",
        "tarefa": "Organizar o quarto",
        "peso": "5"
    },
    {
        "id": "3",
        "tarefa": "Organizar a cozinha",
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

class Historico {
    constructor(id, tarefa, peso, status) {
        this.id = id;
        this.tarefa = tarefa;
        this.peso = peso;
        this.status = status;
    }
}

// preenche modal com a lista de tarefas
function lerTarefas() {

    for (let i = 0; i < dados.length; i++) {

        $(`input[id="tarefa_nam${i}"]`).val(dados[i].tarefa)
        $(`input[id="tarefa_val${i}"]`).val(dados[i].peso)

    }
}

// grava tarefas do modal no storage
function salvarTarefas() {
    let _confirm = confirm("Ao definir novas tarefas, o progresso atual será perdido, tem certeza que deseja continuar?")

    if (_confirm) {

        dados = [] // limpando campos
        pontosDia = [0, 0]

        for (let i = 0; i < 8; i++) {

            dados.push(new Tarefa(i, $(`input[id = "tarefa_nam${i}"]`).val(), $(`input[id = "tarefa_val${i}"]`).val()))

            // obtém valor de pontos por dia
            if ($(`input[id = "tarefa_val${i}"]`).val() !== "") {
                // console.log(pontosDia)
                // console.log(parseInt($(`input[id = "tarefa_val${i}"]`).val()))
                pontosDia[0]++
                pontosDia[1] += parseInt($(`input[id = "tarefa_val${i}"]`).val())
            }

        }

        // setando os valores no Storage
        localStorage.setItem("__tarefas__", JSON.stringify(dados))
        localStorage.setItem("__pontos_dia__", JSON.stringify(pontosDia))

        dados = [] // limpando campos

        // limpa cache do histórico
        localStorage.removeItem("__historico__");

        document.location.reload(true);

        alert("Redefinido com sucesso!")
    }
    $("#modalRegistro").modal("hide")
}

// popula calendário
function carregaTabela() {

    // carrega a recompensa
    if (url !== null) {

        let html = `
        <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox"> 
            <img id="small" async src="${url}" alt="Recompensa">
        </a>
        `;

        document.getElementById("recompensaUrl").innerHTML = html;
    }

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

    if ($(mes_analisado).val() == "" || localStorage.getItem("__pontos_dia__") == null) {

        document.getElementById('mes_nome').innerHTML = "Defina as tarefas e depois selecione um mês"
        // document.getElementById('mes_nome').innerHTML = localStorage.getItem("__pontos_dia__") == null
        return false
    } else {
        // Armazena a data ao rodar pela primeira vez
        localStorage.setItem("__mes_analisado__", $(mes_analisado).val());
    }

    let ultimoDiaTela = getUltimoDiaTela()

    // Pega o primeiro dia da semana (DOM / SEG / ...)
    let diaSemana = new Date($(mes_analisado).val().substring(0, 8) + '01').getUTCDay()

    let cont = 0; //conta as semanas

    carregaHistorico(ultimoDiaTela)

    // carrega tabela de histórico      
    let histTabResume = [];
    historico.reduce(function (res, value) {
        if (!res[value.id]) {
            res[value.id] = {
                id: value.id,
                status: 0
            };
            histTabResume.push(res[value.id])
        }
        res[value.id].status += value.status;
        return res;
    }, {});

    for (let i = 1, styleCell; i <= ultimoDiaTela; i++) {

        if (histTabResume[i - 1].status == pontosDia[0]) {
            styleCell = `class="tableCellOk"`
        } else if (i < new Date().getDate()) { //marca os dias passados
            styleCell = `class="tableCellAgo"`
        } else if (i == new Date().getDate()) {
            styleCell = `class="tableCellToday"`
        } else {
            styleCell = ""
        }

        // eventos ao clicar no calendário
        let eventosBtn = `<td data-toggle="modal" data-target="#modalTarefas" 
            onclick="getTarefa(${i})" ${styleCell}>${i} 
            <p id="corTarefa">${histTabResume[i - 1].status}/${pontosDia[0]}</p></td>`

        if (cont == 0) {
            conteudo += "<tr>"
        } else if (cont == 7) {
            conteudo += "</tr>"
            cont = 0
        }

        if (i == 1) {
            switch (diaSemana) {
                case 0:
                    conteudo += eventosBtn
                    cont += 1
                    break;
                case 1:
                    conteudo += `<td></td>
                    ${eventosBtn}`
                    cont += 2
                    break;
                case 2:
                    conteudo += `<td></td><td></td>
                    ${eventosBtn}`
                    cont += 3
                    break;
                case 3:
                    conteudo += `<td></td><td></td><td></td>
                    ${eventosBtn}`
                    cont += 4
                    break;
                case 4:
                    conteudo += `<td></td><td></td><td></td><td></td>
                    ${eventosBtn}`
                    cont += 5
                    break;
                case 5:
                    conteudo += `<td></td><td></td><td></td><td></td><td></td>
                    ${eventosBtn}`
                    cont += 6
                    break;
                case 6:
                    conteudo += `<td></td><td></td><td></td><td></td><td></td><td></td>
                    ${eventosBtn}`
                    cont += 7
                    break;
            }
            continue;
        } else {
            conteudo += `${eventosBtn}`
        }

        cont++
    }

    conteudo += "</table>";

    document.getElementById("conteudoJSON").innerHTML = conteudo;

    carregaPontos()
}

function carregaHistorico(diasDoMes) {
    // verifica se há histórico
    historico = JSON.parse(localStorage.getItem("__historico__"))

    // cadastra histórico
    if (historico == null) {
        if (tarefas == null) {
            alert("Defina tarefas")
            return false
        }

        historico = []

        for (let i = 1; i <= diasDoMes; i++) {
            for (let j = 0; j < dados.length; j++) {

                if (dados[j].tarefa == "") {
                    continue
                } else {
                    historico.push(new Historico(i, dados[j].tarefa, dados[j].peso, 0))
                }
            }
        }

        // armazenando o histórico
        localStorage.setItem("__historico__", JSON.stringify(historico))
    }
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

// exibe a lista de tarefas no modal
function getTarefa(id) {

    let html = "<ul>"

    for (var value in historico) {

        if (historico[value].id == id) {

            // html += `<li>${historico[value].tarefa} <input id="task_id${contTarefas++}" name="task_nam" type="checkbox" value="1" /></li>`

            if (historico[value].status == 0) {
                html += `<li>${historico[value].tarefa} <input id="task_id${contTarefas++}" name="task_nam" type="checkbox" value="0" /></li>`
            } else {
                html += `<li>${historico[value].tarefa} <input id="task_id${contTarefas++}" name="task_nam" type="checkbox" checked value="1" /></li>`
            }

        }
    }

    html += "</ul>"

    contTarefas = 0

    document.getElementById("conteudoHistorico").innerHTML = html;
    document.getElementById("btnSalvarTask").setAttribute('onClick', 'setTarefa(' + id + ')');
}

// grava as tarefas diárias no storage
function setTarefa(id) {

    let markedCheckbox = document.getElementsByName('task_nam');

    let checked = []
    for (let i = 0; i < markedCheckbox.length; i++) {
        if (markedCheckbox[i].checked) {
            checked.push(1)
        } else {
            checked.push(0)
        }
    }

    let cnt = 0
    for (var value in historico) {

        if (historico[value].id == id) {
            historico[value].status = checked[cnt++]
        }
    }
    localStorage.setItem("__historico__", JSON.stringify(historico))
    $("#modalTarefas").modal("hide")
    carregaTabela()
}

// botão marcar todos checkbox's
function btnMarcarTodas() {
    let markedCheckbox = document.getElementsByName('task_nam');

    for (let i = 0; i < markedCheckbox.length; i++) {
        markedCheckbox[i].checked = true
    }
}

// busca dados no storage
function lerStorage() {
    // Recebe dados do armazenamento local
    $(mes_analisado).val(localStorage.getItem("__mes_analisado__"))

    pontosDia = JSON.parse(localStorage.getItem("__pontos_dia__"));
    if (pontosDia == null) {
        pontosDia = [0, 0]
    }

    tarefas = localStorage.getItem("__tarefas__");
    if (tarefas == null) {
        localStorage.setItem("__tarefas__", taskDefault)
        document.location.reload(true);
    }

    dados = JSON.parse(tarefas)

    url = JSON.parse(localStorage.getItem("__recompensa_url__"))

}

// exclui todos os dados da página
function limparStorage() {

    let _confirm = confirm("Deseja excluir todas as informações?")

    if (_confirm) {

        localStorage.clear();
        document.location.reload(true);
    }
}

// define a imagem da recompensa
function setRecompensa() {

    url = $(recompensa_url).val();

    localStorage.setItem("__recompensa_url__", JSON.stringify(url))
    $("#modalRecompensa").modal("hide")

    document.location.reload(true);

}

// busca pontuação atual
function carregaPontos() {

    let pontos = 0
    let pontosTotais = getUltimoDiaTela() * pontosDia[1]

    for (let i = 0; i < historico.length; i++) {
        if (historico[i].status == 1) {
            pontos += parseInt(historico[i].peso)
        }
    }

    let html = `
        <p>${pontos} - \(${Math.round(pontos/pontosTotais*100)}%)</p>
    `;

    document.getElementById("pontuacao").innerHTML = html;

    // barra
    html = `
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
            aria-valuenow="${Math.round(pontos/pontosTotais*100)}" aria-valuemin="0" aria-valuemax="100" 
            style="width: ${Math.round(pontos/pontosTotais*100)}%"></div>
        </div>
    `;

    document.getElementById("progresso").innerHTML = html
}

// lightbox
$(document).ready(function () {
    var $lightbox = $('#lightbox');

    $('[data-target="#lightbox"]').on('click', function (event) {
        var $img = $(this).find('img'),
            src = $img.attr('src'),
            alt = $img.attr('alt'),
            css = {
                'maxWidth': $(window).width() - 100,
                'maxHeight': $(window).height() - 100
            };

        $lightbox.find('.close').addClass('hidden');
        $lightbox.find('img').attr('src', src);
        $lightbox.find('img').attr('alt', alt);
        $lightbox.find('img').css(css);
    });

    $lightbox.on('shown.bs.modal', function (e) {
        var $img = $lightbox.find('img');

        $lightbox.find('.modal-dialog').css({
            'width': $img.width()
        });
        $lightbox.find('.close').removeClass('hidden');
    });
});

window.onload = lerStorage(), carregaTabela(); // carrega a tabela junto com a página