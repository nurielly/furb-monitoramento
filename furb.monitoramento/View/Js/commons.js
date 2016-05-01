var path_configuracoes = "../Controller/ConfiguracoesController.php";
var path_cadastro = "../Controller/Cadastro.php";
var path_consulta = "../Controller/ConsultarEsp.php"
	
String.prototype.remover = function(caracter) {
    var target = this;
    return target.replace(new RegExp(caracter, 'g'), "");
};

//Transforma o macAddress em um ID
String.prototype.macToId = function() {
    var target = this;
    return "mac-" + target.replace(new RegExp(":", 'g'), "");
};

function getHora() {
	var d = new Date();
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

function exibirMensagem(mensagem, status) {
	$("#mensagensSistema").fadeIn();
	$("#mensagensSistema").html(mensagem);
	if(status == 1) {
		$("#mensagensSistema").attr("class", "ok");
	} else if (status == 0){
		$("#mensagensSistema").attr("class", "erro");
	}
}