<?php
// cURL in PHP

$questionText = $_POST['prompt'];
$topic = $_POST['topic'];
$functionName = $_POST['functionName'];
$constraint = $_POST['constraint'];
$difficulty = $_POST['difficulty'];

$testCaseInput1 = $_POST['testCaseInput1'];
$testCaseOutput1 = $_POST['testCaseOutput1'];
$testCaseInput2 = $_POST['testCaseInput2'];
$testCaseOutput2 = $_POST['testCaseOutput2'];
$testCaseInput3 = $_POST['testCaseInput3'];
$testCaseOutput3 = $_POST['testCaseOutput3'];
$testCaseInput4 = $_POST['testCaseInput4'];
$testCaseOutput4 = $_POST['testCaseOutput4'];
$testCaseInput5 = $_POST['testCaseInput5'];
$testCaseOutput5 = $_POST['testCaseOutput5'];
$testCaseInput6 = $_POST['testCaseInput6'];
$testCaseOutput6 = $_POST['testCaseOutput6'];

if(empty($questionText) || empty($functionName) || !($difficulty === '1' || $difficulty === '2' || $difficulty === '3')) { // Detect if any form field is empty
	echo json_encode('empty');
}
else { // Send data using cURL
	$formData;
	$formData->questionText = $questionText;
	$formData->topic = $topic;
	$formData->functionName = $functionName;
	$formData->constraint = $constraint;
	$formData->difficulty = $difficulty;
	$formData->testCaseInput1 = $testCaseInput1;
	$formData->testCaseOutput1 = $testCaseOutput1;
	$formData->testCaseInput2 = $testCaseInput2;
	$formData->testCaseOutput2 = $testCaseOutput2;
	$formData->testCaseInput3 = $testCaseInput3;
	$formData->testCaseOutput3 = $testCaseOutput3;
	$formData->testCaseInput4 = $testCaseInput4;
	$formData->testCaseOutput4 = $testCaseOutput4;
	$formData->testCaseInput5 = $testCaseInput5;
	$formData->testCaseOutput5 = $testCaseOutput5;
	$formData->testCaseInput6 = $testCaseInput6;
	$formData->testCaseOutput6 = $testCaseOutput6;
	
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