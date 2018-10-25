<?php
// cURL in PHP
$pickedE = $_POST['pickedE'];

if($pickedE === '') { // Detect if any form field is empty
	echo json_encode('Please choose an exam');
}
else { // Send data using cURL
	$formData;
	$formData->pickedE = $pickedE;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/openCloseExam.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>