<?php
header('Content-Type: application/json');
require 'ComickIo.php';

$comick = new ComickIo();

// Pagination support
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$perPage = isset($_GET['per_page']) ? intval($_GET['per_page']) : 20;

// Fetch manga list (you may need to adjust method according to ComickIo.php)
$mangaList = $comick->getMangaList($page);

// Slice results for pagination
$start = ($page - 1) * $perPage;
$paginated = array_slice($mangaList, $start, $perPage);

echo json_encode([
    'status' => true,
    'page' => $page,
    'per_page' => $perPage,
    'data' => $paginated
]);
