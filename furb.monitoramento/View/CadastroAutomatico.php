<?php ob_start(); ?>
<script>
$(function(){
	
	$.post(path_consulta, "{}", function (data){
		console.log(data);
		var total = Object.keys(data).length;
		var contador = 0;
		$(".status").html("Procurando... Verificados 0 de " + total);
		for(var key in data) {
			conectar(key, function(sucesso, ip) {
				var mac = data[ip];
				if(sucesso) {
					addAoGrid(mac, ip);
				}
				contador++;
				$(".status").html("Procurando... Verificados " + contador + " de " + total);
				if(contador == total){
					$(".status").html("Busca finalizada");
				}
			});
		}
	}, "json");
});
/*
function jaCadastrado(mac) {
	var dados = {};
	dados["operacao"] = "buscar";
	dados["macaddress"] = mac;
	
	$.post(path_cadastro, JSON.stringify(dados), function (data){
		if(Object.keys(data).length > 0) {
		}
	}, 'json');
}
*/
function cadastrar(mac) {
	var dados = {};
	dados["operacao"] = "cadastrar";
	dados["macaddress"] = mac;
	dados["localizacao"] = "";
	dados["observacao"] = "";
	
	$.post(path_cadastro, JSON.stringify(dados), function (data){
		var botao = document.querySelector("#" + mac.macToId() + " button");
		var celula = botao.parentElement;
		if(data.status == 1) {
			celula.innerHTML = montarBotaoRemover(mac);
		} else {
			celula.innerHTML = data.mensagem;
		}
	}, 'json');
}

function remover(mac) {
	var dados = {};
	dados["operacao"] = "excluir";
	dados["macaddress"] = mac;
	
	$.post(path_cadastro, JSON.stringify(dados), function (data){
		var botao = document.querySelector("#" + mac.macToId() + " button");
		var celula = botao.parentElement;
		if(data.status == 1) {
			celula.innerHTML = montarBotaoCadastrar(mac);
		} else {
			celula.innerHTML = data.mensagem;
		}
	}, 'json');
}

function montarBotaoCadastrar(mac) {
	return "<button class='comando cadastrar' onClick='cadastrar(\"" + mac + "\")'>Cadastrar</button>";
}

function montarBotaoRemover(mac) {
	return "<button class='comando excluir' onClick='remover(\"" + mac + "\")'>Remover</button>";
}

function addAoGrid(mac, ip) {
	var dados = {};
	dados["operacao"] = "buscar";
	dados["macaddress"] = mac;
	
	$.post(path_cadastro, JSON.stringify(dados), function (data){
			var linhas = "";
			linhas += "<tr class='dispositivo' id='" + mac.macToId() + "'>";
			if(Object.keys(data).length == 0) {
				linhas += "<td>" + montarBotaoCadastrar(mac) + "</td>"
			} else {
				linhas += "<td>" + montarBotaoRemover(mac) + "</td>"
			}
			linhas += "<td>" + mac + "</td>";
			linhas += "<td>" + ip + "</td>";
			linhas += "</tr>";
			$("#DispositivosEncontratos").append(linhas);
	}, 'json');
}

</script>

<div class="status"></div>
<table class='tabela' style="width: 100%" id="DispositivosEncontratos">
	<tr>
		<th>Comando</th>
		<th>Mac Address</th>
		<th>ip</th>
	</tr>
</table>
<br>
<div id="EspStatus"></div>

<?php
	$pagemaincontent = ob_get_contents();
	ob_end_clean();
	$titulo = "Cadastro automático";
	include("master.php");
?>