<?php
header('Content-Type: application/json');
require 'ComickIo.php';

$comick = new ComickIo();

// This would check latest chapters for all stored manga
// Here we assume a list of manga IDs is stored in 'favorites.json'
$mangaFile = 'favorites.json';
$updates = [];

if(file_exists($mangaFile)){
    $mangaList = json_decode(file_get_contents($mangaFile), true);
    foreach($mangaList as $mangaId){
        $chapters = $comick->getComicChapters($mangaId);
        $lastChapter = end($chapters);
        $updates[] = ['manga_id'=>$mangaId,'latest_chapter'=>$lastChapter];
    }
}

echo json_encode([
    'status'=>true,
    'updates'=>$updates
]);
