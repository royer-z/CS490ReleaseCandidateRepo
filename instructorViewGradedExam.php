<?php
session_start();

// cURL in PHP
$examInfo = $_POST['examInfo'];

echo gettype($examInfo);
echo $examInfo;
/*
echo gettype($pickedGE);
echo $pickedGE;

$tempObj = json_decode($pickedGE);
echo gettype($tempObj);
echo print_r($tempObj);
$_SESSION['studentId'] = $tempObj->studentId;
*/
$_SESSION['studentId'] = $studentId;

if($examId === '' || $studentId === '') { // Detect if any form field is empty **********
	echo json_encode('empty');
}
else { // Send data using cURL
	$formData;
	//$formData->studentId = $tempObj->studentId;
	//$formData->examId = $tempObj->examId;
	$formData->studentId = $studentId;
	$formData->examId = $examId;
	
	$formDataJSON = json_encode($formData);
	// echo $formDataJSON;
	
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
	foreach ($objResult as $question) {
		array_push($qArray, $question->questionId);
	}
	
	$_SESSION['questionIds'] = $qArray;
	//echo "QIDS: ".print_r($_SESSION['questionIds']);
	
	echo $cResult;
}
?>