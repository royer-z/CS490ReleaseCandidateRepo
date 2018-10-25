<?php
// cURL in PHP
$examName = $_POST['examName'];
$questionIds = $_POST['pickedQ'];


if(count($questionIds) == 0) { // Detect if questions were selected
	echo json_encode('empty');
}
else if($examName == '') {
	echo json_encode('empty');
}
else { // Send data using cURL
	$formData;
	$formData->examName = $examName;
	$formData->questionIds = $questionIds;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/createExam.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>