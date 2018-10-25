<?php
// cURL in PHP
$pickedGE = $_POST['pickedGE'];

if($pickedGE === '') { // Detect if any form field is empty
	echo json_encode('Please choose an exam');
}
else { // Send data using cURL
	$formData;
	$formData->pickedGE = $pickedGE;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/releaseGrade.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>