<?php
header('Content-Type: application/json');
require 'ComickIo.php';

$comick = new ComickIo();

if(!isset($_GET['manga_id'])){
    echo json_encode(['status'=>false,'message'=>'Manga ID required']);
    exit;
}

$mangaId = $_GET['manga_id'];
$chapters = $comick->getComicChapters($mangaId);

echo json_encode([
    'status'=>true,
    'manga_id'=>$mangaId,
    'chapters'=>$chapters
]);
