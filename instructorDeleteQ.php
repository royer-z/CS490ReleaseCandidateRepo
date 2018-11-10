<?php
// cURL in PHP
$questionId = $_POST['pickedDQ'];

if(empty($question)) { // Detect if any form field is empty
	echo json_encode('empty');
}
else { // Send data using cURL
	$formData;
	$formData->questionId = $questionId;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, ""); // Middle may need to create a php to handle deletions
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>