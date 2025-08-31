<?php
require_once 'ComickIo.php';

header('Content-Type: application/json');

if (!isset($_GET['manga_id'])) {
    echo json_encode([]);
    exit;
}

$comick = new ComickIo();
$chapters = $comick->getChapters($_GET['manga_id']); // adjust method name

echo json_encode($chapters);
