<?php
require_once 'ComickIo.php';

header('Content-Type: application/json');

if (!isset($_GET['chapter_id'])) {
    echo json_encode([]);
    exit;
}

$comick = new ComickIo();
$pages = $comick->getPages($_GET['chapter_id']); // adjust method name

echo json_encode($pages);
