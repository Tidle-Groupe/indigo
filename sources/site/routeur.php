<?php
$url = '';
if(isset($_GET['url'])) {
    $url = htmlspecialchars($_GET['url']);
}