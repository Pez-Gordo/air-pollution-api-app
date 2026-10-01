<?php

declare(strict_types=1);

const OPENWEATHER_URL =
    'https://api.openweathermap.org/data/2.5/air_pollution';

const OPENWEATHER_KEY_FILE =
    '/etc/air-pollution-api-app/api-key';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function fail(int $status, string $message): never
{
    http_response_code($status);

    echo json_encode([
        'status' => [
            'code' => $status,
            'name' => 'error',
            'description' => $message,
        ],
    ]);

    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Method not allowed.');
}

$lat = filter_input(INPUT_POST, 'lat', FILTER_VALIDATE_FLOAT);
$lon = filter_input(INPUT_POST, 'lon', FILTER_VALIDATE_FLOAT);

if ($lat === false || $lat === null || $lat < -90 || $lat > 90) {
    fail(400, 'Invalid latitude.');
}

if ($lon === false || $lon === null || $lon < -180 || $lon > 180) {
    fail(400, 'Invalid longitude.');
}

$apiKey = @file_get_contents(OPENWEATHER_KEY_FILE);

if ($apiKey === false || trim($apiKey) === '') {
    fail(500, 'API configuration unavailable.');
}

$query = http_build_query([
    'lat' => $lat,
    'lon' => $lon,
    'appid' => trim($apiKey),
]);

$ch = curl_init(OPENWEATHER_URL . '?' . $query);

if ($ch === false) {
    fail(500, 'Unable to initialise API request.');
}

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
    ],
]);

$result = curl_exec($ch);

if ($result === false) {
    curl_close($ch);
    fail(502, 'OpenWeather is unavailable.');
}

$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

curl_close($ch);

if ($status < 200 || $status >= 300) {
    fail(502, 'OpenWeather returned an HTTP error.');
}

if (
    !is_string($contentType) ||
    stripos($contentType, 'application/json') === false
) {
    fail(502, 'Unexpected OpenWeather response.');
}

$decoded = json_decode($result, true);

if (
    !is_array($decoded) ||
    !isset($decoded['coord']) ||
    !isset($decoded['list'][0]['components'])
) {
    fail(502, 'Invalid OpenWeather response.');
}

echo json_encode([
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'success',
    ],
    'pollutionData' => $decoded,
]);
