<?php

require_once(dirname(__FILE__)."/autoload.php");
require_once("php/jsonwrapper/jsonwrapper.php");
date_default_timezone_set("Europe/Berlin");
header("Content-type: application/json");

ini_set('display_errors','on');
/**
 * TODO move this code
 */
LudoDB::setUser('dhtmlgds');
LudoDB::setPassword('General15g');
LudoDB::setHost('localhost');
LudoDB::setDb('DHTML_CHESS');

LudoDBRegistry::set('FILE_UPLOAD_PATH', 'tmp/');
LudoDBRegistry::set('DEVELOP_MODE', true);
LudoDB::enableLogging();

// For static(No db) installations
ChessRegistry::setPgnFolder("pgn");
ChessRegistry::setCacheFolder("cache"); // Path to cache

$request = array('request' => isset($_GET['request']) ? $_GET['request'] : $_POST['request']);

if(isset($_POST['data'])){
    $request['data'] = isset($_POST['data']) ? $_POST['data'] : null;
}

if(isset($_POST['arguments'])){
    $request['arguments'] = $_POST['arguments'];
}

$handler = new LudoDBRequestHandler();


echo $handler->handle($request);


