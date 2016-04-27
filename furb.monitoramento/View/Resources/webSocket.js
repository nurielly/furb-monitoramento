var CONNECTING = 0 // The connection is not yet open.
var OPEN = 1 // The connection is open and ready to communicate.
var CLOSING = 2 // The connection is in the process of closing.
var CLOSED = 3 // The connection is closed or couldn't be opened.

function WebSocketManager(onConnect, onMessage, onDisconect, onError) {

	var sockets = {};

	function getSocket(ip) {
		if (ip in sockets) {
			var socket = sockets[ip];
			if (socket.readyState == OPEN) {
				return socket;
			} else if (socket.readyState == CLOSED) {
				onDisconect(null, socket);
				socket.log("IP " + ip
						+ " está com problema na conexão. Status: CLOSED");
			} else if (socket.readyState == CLOSING) {
				onDisconect(null, socket);
				socket.log("IP " + ip
						+ " está com problema na conexão. Status: CLOSING");
			} else if (socket.readyState == CONNECTING) {
				socket.log("IP " + ip + " está abrindo conexão.");
			}
		} else {
			console.log("IP " + ip + " não está conectado");
		}
		return false;
	}

	this.consultarSensor = function(ip) {
		if (socket = getSocket(ip)) {
			socket.send(JSON.stringify({
				URL : '/mod-io2',
				Method : 'GET',
				Data : {}
			}));
		}
	}

	this.setRelay = function(ip, status) {
		if (socket = getSocket(ip)) {
			socket.send(JSON.stringify({
				URL : '/relay',
				Method : 'POST',
				Data : {
					Relay : status
				}
			}));
		}
	}

	this.desligar = function(ip, status) {
		if (socket = getSocket(ip)) {
			socket.send(JSON.stringify({
				URL : '/mod-io2',
				Method : 'POST',
				Data : {
					GPIO2 : 1
				}
			}));

			setTimeout(function() {
				socket.send(JSON.stringify({
					URL : '/mod-io2',
					Method : 'POST',
					Data : {
						GPIO2 : 0
					}
				}));
			}, 5000);
		}
	}

	this.conectar = function(ip, macAddress) {
		var abrindoConexao = false;

		var socket = new WebSocket('ws://' + ip + '/events');
		socket.macAddress = macAddress;
		socket.ip = ip;

		if (document.getElementById(ip) == null) {
			$("#EspStatus")
					.append(
							"<div class='EspStatus'><div>IP:" + ip
									+ "<div><div class='EspLog' id='" + ip
									+ "'></div>");
		}

		socket.log = function(msg, tipo) {
			document.getElementById(ip).innerHTML += '<div class="' + tipo
					+ '">' + msg + '  Data: ' + getHora() + '</div>';
		};

		socket.onopen = function() {
			abrindoConexao = true;
			this.send(JSON.stringify({
				User : 'olimex',
				Password : 'olimex'
			}));
		};

		socket.onmessage = function(event) {
			try {
				var mensagem = JSON.parse(event.data);
				if (abrindoConexao
						&& mensagem.Status == "Authorization success") {
					sockets[ip] = socket;
					socket.log(JSON.stringify(mensagem, null, 4), "Sucesso");
					onConnect(true, socket);
					abrindoConexao = false;
				} else {
					// socket.log(JSON.stringify(mensagem, null, 4),
					// "Normal");
					socket.log("Mensagem: " + JSON.stringify(mensagem),
							"Normal");
					onMessage(event, socket);
				}
			} catch (e) {
				console.log(e.message);
			}
		};

		socket.onerror = function(event) {
			if (abrindoConexao) {
				// onConnect(false, socket);
			} else {
				onError(event, socket);
			}
			socket.log('WebSocket ERROR', "Erro");
			console.log(event);
		};

		socket.onclose = function(event) {
			if (abrindoConexao) {
				onConnect(false, socket);
				abrindoConexao = false;
			} else {
				onDisconect(event, socket);
			}
			var msg = "close - " + event.code + ': '
					+ (event.reason ? event.reason : 'WebSocket error');
			socket.log(msg, event.reason ? "" : "Erro")
			console.log(event);
		};

		return socket;
	};
}
