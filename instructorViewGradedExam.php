<?php
session_start();

// cURL in PHP
$examInfo = $_POST['examInfo'];

$examInfo = explode(',', $examInfo);
$studentId = $examInfo[0];
$examId = $examInfo[1];

$_SESSION['studentId'] = $studentId;

if(empty($examId) || empty($studentId)) {
	echo json_encode('empty');
}
else { // Send data using cURL
	$formData;
	$formData->studentId = $studentId;
	$formData->examId = $examId;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/getExamGraded.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	
	// Extract questionIds from $cResult
	$objResult = json_decode($cResult);
	$qArray = array();
	foreach ($objResult->questions as $question) {
		array_push($qArray, $question->questionId);
	}
	
	/*
	echo "QARRAY: ";
	print_r($qArray);
	*/
	$_SESSION['questionIds'] = $qArray;
	/*
	echo "SES QIDS: ";
	print_r($_SESSION['questionIds']);
	*/
	echo $cResult;
}
?>