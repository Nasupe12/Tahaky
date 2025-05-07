<?php
$tahak = $_POST['tahak'] ?? 'Neznámý';
$jmeno = $_POST['jmeno'] ?? 'Nezadáno';
$datum = date("d.m.Y H:i");

$zprava = "Žádost o vytištění:\nTahák: $tahak\nŽadatel: $jmeno\nČas: $datum";

// Odeslání e-mailu na specifikovaný e-mail
mail("oliverpirner@seznam.cz", "Žádost o tisk taháku", $zprava);

echo "Žádost byla úspěšně odeslána!";
?>
