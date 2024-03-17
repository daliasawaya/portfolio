<?php
session_start();
//all possible fruits to be guessed
$words = array(
    "APPLE", "BANANA", "ORANGE", "STRAWBERRY",
    "KIWI", "GRAPE", "PINEAPPLE", "WATERMELON",
    "BLUEBERRY", "MANGO", "GRAPEFRUIT", "AVOCADO",
    "PEAR", "CHERRY", "LEMON", "COCONUT", "GUAVA",
    "PAPAYA"
);

//setting up the leaderboard
$leaderboard = array();
function read_leaderboard()
{
    $GLOBALS['leaderboard'] = json_decode(file_get_contents(__DIR__ . '/leaderboard.json'), true);
}
read_leaderboard();

//initializes the word to be guessed
function init_guessed()
{
    $len = strlen($GLOBALS['words'][$_SESSION['w_i']]);
    $_SESSION['guess'] = '';
    for ($i = 0; $i < $len; $i++) 
        $_SESSION['guess'] .= '-';
}


//initializes the required items
function init_game()
{
    //the index of the word
    if (!isset($_SESSION['w_i']))
        $_SESSION['w_i'] = array_rand($GLOBALS['words']);

    //how many incorrect guesses the player had in this round
    if (!isset($_SESSION['incorrect']))
        $_SESSION['incorrect'] = 0;

    //how many times the player could guess correctly
    if (!isset($_SESSION['score']))
        $_SESSION['score'] = 0;

    //total games the user has played
    if (!isset($_SESSION['total']))
        $_SESSION['total'] = 0;

    if (!isset($_SESSION['guess']))
        init_guessed();
    if (!isset($_SESSION['guessed_chars'])) 
        $_SESSION['guessed_chars'] = '';
    if (isset($_SESSION['correct']))
        $_SESSION['correct'] = null;
}

init_game();

//would be called if the game is supposed to be reset
function reset_game()
{
    $_SESSION['correct'] = $GLOBALS['words'][$_SESSION['w_i']];
    $_SESSION['w_i'] = array_rand($GLOBALS['words']);
    $_SESSION['incorrect'] = 0;
    $_SESSION['guessed_chars'] = '';
    init_guessed();
}


//checks to see if the game is over
//if so, reset the game and update points
function check_over()
{
    if ($_SESSION['incorrect'] >= 6)
    {
        reset_game();
        $_SESSION['total']++;
    }
    else if ($_SESSION['guess'] === $GLOBALS['words'][$_SESSION['w_i']])
    {
        reset_game();
        $_SESSION['total']++;
        $_SESSION['score']++;
        $GLOBALS['leaderboard'][$_SESSION['username']] = $_SESSION['score'];
        file_put_contents(__DIR__ .'/leaderboard.json', json_encode($GLOBALS['leaderboard']));
    }
}

//recreates the word after each guess
function rebuild_guess($g)
{
    $guess = '';
    $wrd = $GLOBALS['words'][$_SESSION['w_i']];
    for ($i = 0; $i < strlen($_SESSION['guess']); $i++)
    {
        if ($g == $wrd[$i]) $guess .= $g;
        else
        $guess .= $_SESSION['guess'][$i];
    }
    return $guess;
}

//called for making a guess
function guess_word()
{
    $json_res = file_get_contents('php://input');
    $json_data = json_decode($json_res, true);

    //error handling and making sure the same character would not be requested twice
    if (!isset($json_data['guess'])) {
        get_stats();
    }
    if (strpos($json_data['guess'], $_SESSION['guessed_chars'])) {
        get_stats();
    }

    $guess = rebuild_guess($json_data['guess']);

    $_SESSION['guessed_chars'] .= $json_data['guess'];
    
    //this means the guess was wrong
    if ($guess === $_SESSION['guess']) {
        $_SESSION['incorrect']++;
        check_over();
    } else {
        $_SESSION['guess'] = $guess;
        check_over();
    }
    

    get_stats();
}

//provides the stats of the game as a response
function get_stats()
{
    session_commit();
    header('Content-Type:application/json');
    echo json_encode(array(
        'guess' => $_SESSION['guess'],
        'incorrect' => $_SESSION['incorrect'],
        'total' => $_SESSION['total'],
        'score' => $_SESSION['score'],
        'guessed_chars' => $_SESSION['guessed_chars'],
        'correct' => $_SESSION['correct'],
        'username' => $_SESSION['username']
    ));
    exit();
}

//get the corresponding images, css sheets, or js files
if (
    substr($_SERVER['REQUEST_URI'], 0, 7) == '/images' ||
    substr($_SERVER['REQUEST_URI'], 0, 5) == '/css/' ||
    substr($_SERVER['REQUEST_URI'], 0, 4) == '/js/'
) {
    require __DIR__ . '/../Client' . $_SERVER['REQUEST_URI'];
    exit();
}

//logs in
function runLogin() {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $json_res = file_get_contents('php://input');
        $json_data = json_decode($json_res, true);
        $username = $json_data['username'];
        //if not currently in server, the name is valid
        
        if (!isset($GLOBALS['leaderboard'][$username])) {
            $_SESSION['username'] = $json_data['username'];
            $GLOBALS['leaderboard'][$json_data['username']] = 0;
            file_put_contents(__DIR__ . '/leaderboard.json', json_encode($GLOBALS['leaderboard']));
            echo json_encode(array(
                'type' => 'success',
                'message' => 'success'
            ));
        } else {
            echo json_encode(array(
                'type' => 'error',
                'message' => 'Username is in use'
            ));
        }
        exit();
    }
}

//gives all of the scores
function get_all_scores()
{
    echo json_encode($GLOBALS['leaderboard']);
    exit();
}

//handling each request
switch ($_SERVER['REQUEST_URI'])
{
    case '/guess': //should be a post request for guessing the word
        guess_word();
        break;
    case '/stats': //should be a get request to provide the stats
        get_stats();
        break;
    case '/': //should provide index.html
        if (!isset($_SESSION['username'])) {
            header('Location:/login');
            die();
        }
        require __DIR__ . '/../Client/index.html';
        break;
    case '/login':
        if (isset($_SESSION['username'])) {
            header('Location:/');
            die();
        }
        runLogin();
        require __DIR__ . '/../Client/login.html';
        break;
    case '/leaderboard': //shows the top 10 highest scores
        require __DIR__ . '/../Client/leaderboard.html';
        break;
    case '/tops': //gives scores in JSON format
        get_all_scores();
        break;
    default:    //should display the request is invalid
        require __DIR__ . '/../Client/404.html';
        break;
}