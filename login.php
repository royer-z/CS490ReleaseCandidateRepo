<?php
session_start();
// https://web.njit.edu/~rvz2/login.php
// cURL in PHP

$username = $_POST['username'];
$password = $_POST['password'];


if($username === '' || $password === '') { // Detect if any form field is empty
	echo json_encode('empty');
}
else { // Send data using cURL
	$formData;
	$formData->username = $username;
	$formData->password = $password;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/login.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	
	$objResult = json_decode($cResult);
	if ($objResult->instructor == "false" && $objResult->loginSucceeded == "true"){
		$_SESSION['studentId'] = $objResult->studentId;
	}
	
	echo $cResult;
}
?>