<?php
require_once 'ComickIo.php';

header('Content-Type: application/json');

$comick = new ComickIo();
$mangaList = $comick->getAllManga(); // adjust method name if needed

echo json_encode($mangaList);
