<?php
	class Conexao {
		public static function Abrir() {
			// definições de host, database, usuário e senha 
			$host = "localhost"; 
			$db = "furb_monitoramento"; 
			$user = "gsabel"; 
			$pass = "329019"; 
			// conecta ao banco de dados 
			$conn = new mysqli($host, $user, $pass, $db); 
			if ($conn->connect_error) {
				die("Conexão falhou: " . $conn->connect_error);
			} 			
			return $conn;
		}
	}
?>