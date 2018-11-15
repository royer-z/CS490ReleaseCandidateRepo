<?php
// cURL in PHP
$filterInput= $_POST['filterInput'];

if(empty($filterInput)) {
	$formData;
	$formData->action = $filterInput;
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/getQuestionList.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
else { // Send data using cURL
	$formData;

	if (strpos($filterInput, ',') !== FALSE) {
		$filterInput = explode(',', $filterInput);
		$topic = $filterInput[0];
		$difficulty = $filterInput[1];
		if (strpos($difficulty, ' ')) {
			$difficulty = explode(' ', $difficulty);
			$difficulty = $difficulty[1];
		}
		$formData->topic = $topic;
		$formData->difficulty = $difficulty;
	}
	else {
		if ($filterInput === '1' || $filterInput === '2' || $filterInput === '3') {
			$formData->difficulty = $filterInput;
		}
		else {
			$formData->topic = $filterInput;
		}
		
	}
	
	$formDataJSON = json_encode($formData);
	
	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/getQuestionList.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>