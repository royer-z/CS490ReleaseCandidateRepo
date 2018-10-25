<?php
// cURL in PHP
$question = $_POST['prompt'];
$topic = $_POST['topic'];
$parameter1 = $_POST['parameter1'];
$parameter2 = $_POST['parameter2'];
$output = $_POST['output'];
$functionName = $_POST['functionName'];
$difficulty = $_POST['difficulty'];


if($question === '' || $topic === '' || $parameters === '' || $output === '' || $functionName === '' || !($difficulty === '1' || $difficulty === '2' || $difficulty === '3')) { // Detect if any form field is empty
	echo json_encode('empty');
}
else { // Send data using cURL
	$formData;
	$formData->questionText = $question;
	$formData->topic = $topic;
	$formData->testCaseInput1 = $parameter1;
	$formData->testCaseInput2 = $parameter2;
	$formData->testCaseOutput = $output;
	$formData->functionName = $functionName;
	$formData->difficulty = $difficulty;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/createQuestion.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>