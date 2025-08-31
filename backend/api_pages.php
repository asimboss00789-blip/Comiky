<?php
header('Content-Type: application/json');
require 'ComickIo.php';

$comick = new ComickIo();

if(!isset($_GET['chapter_id'])){
    echo json_encode(['status'=>false,'message'=>'Chapter ID required']);
    exit;
}

$chapterId = $_GET['chapter_id'];
$pages = $comick->getComicChapter($chapterId);

echo json_encode([
    'status'=>true,
    'chapter_id'=>$chapterId,
    'pages'=>$pages
]);
