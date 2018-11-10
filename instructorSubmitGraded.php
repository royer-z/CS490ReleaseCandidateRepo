<?php
session_start();

// cURL in PHP
$newPoints = $_POST['newPoints'];
$comments = $_POST['comments'];
	
if(empty($newPoints) || empty($comments)) { // Detect if error
	echo json_encode('error');
}
else { // Send data using cURL
	$formData;
	$formData->studentId = $_SESSION['studentId'];
	$formData->questionIds = $_SESSION['questionIds'];
	$formData->adjustments = $newPoints;
	$formData->comments = $comments;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/submitAdjustmentsComments.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>