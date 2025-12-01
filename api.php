<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Data files
$votesFile = __DIR__ . '/data/votes.json';
$historyFile = __DIR__ . '/data/history.json';
$resetFile = __DIR__ . '/data/lastReset.json';

// Ensure data directory exists
if (!file_exists(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}

// Initialize files if they don't exist
if (!file_exists($votesFile)) {
    file_put_contents($votesFile, json_encode([]));
}
if (!file_exists($historyFile)) {
    file_put_contents($historyFile, json_encode([]));
}
if (!file_exists($resetFile)) {
    file_put_contents($resetFile, json_encode(['lastReset' => null]));
}

$action = $_GET['action'] ?? '';

// GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    switch ($action) {
        case 'getVotes':
            $votes = json_decode(file_get_contents($votesFile), true);
            echo json_encode($votes);
            break;

        case 'getHistory':
            $history = json_decode(file_get_contents($historyFile), true);
            echo json_encode($history);
            break;

        case 'getLastReset':
            $reset = json_decode(file_get_contents($resetFile), true);
            echo json_encode($reset);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
}

// POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($action) {
        case 'addVote':
            $votes = json_decode(file_get_contents($votesFile), true);

            // Check if voter already exists
            $found = false;
            foreach ($votes as $i => $vote) {
                if (strtolower($vote['name']) === strtolower($input['name'])) {
                    $votes[$i] = $input;
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $votes[] = $input;
            }

            file_put_contents($votesFile, json_encode($votes));
            echo json_encode(['success' => true]);
            break;

        case 'clearVotes':
            if ($input['password'] !== 'milk') {
                http_response_code(403);
                echo json_encode(['error' => 'Invalid password']);
                break;
            }

            file_put_contents($votesFile, json_encode([]));
            echo json_encode(['success' => true]);
            break;

        case 'addHistory':
            $history = json_decode(file_get_contents($historyFile), true);
            $history[] = $input;

            // Keep only last 12 weeks
            if (count($history) > 12) {
                array_shift($history);
            }

            file_put_contents($historyFile, json_encode($history));
            echo json_encode(['success' => true]);
            break;

        case 'setLastReset':
            file_put_contents($resetFile, json_encode(['lastReset' => $input['lastReset']]));
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
}
?>
