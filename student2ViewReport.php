<?php
session_start();

// cURL in PHP
$examId = $_POST['examId'];

if(empty($examId)) { // Detect if any form field is empty
	echo json_encode('empty');
}
else { // Send data using cURL
	$formData;
	$formData->studentId = $_SESSION['studentId'];
	$formData->examId = $examId;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/getExamGraded.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>