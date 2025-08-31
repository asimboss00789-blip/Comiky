<?php
header('Content-Type: application/json');

// Optional server-side storage for favorites (file-based)
$file = 'favorites.json';
$favorites = [];

if(file_exists($file)){
    $favorites = json_decode(file_get_contents($file), true);
}

$action = $_GET['action'] ?? '';
$mangaId = $_GET['manga_id'] ?? '';

switch($action){
    case 'add':
        if($mangaId && !in_array($mangaId, $favorites)){
            $favorites[] = $mangaId;
            file_put_contents($file, json_encode($favorites));
        }
        break;
    case 'remove':
        if($mangaId){
            $favorites = array_filter($favorites, fn($id)=>$id!=$mangaId);
            file_put_contents($file, json_encode(array_values($favorites)));
        }
        break;
    case 'list':
    default:
        break;
}

echo json_encode(['status'=>true,'favorites'=>$favorites]);
