/*jshint esversion: 6 */
//"use strict"; // Avoids error message //Use in functions

var screenDisplay = document.getElementById('show');
var filterArray = new Array();
var filterArray2 = new Array();

document.getElementById('createQ').onchange = function() {
	"use strict"; // Avoids error message
	createQuestion();
};

document.getElementById('createE').onchange = function() {
	"use strict"; // Avoids error message
	createExam();
};

document.getElementById('releaseE').onchange = function() {
	"use strict"; // Avoids error message
	releaseExam();
};

document.getElementById('releaseG').onchange = function() {
	"use strict"; // Avoids error message
	releaseGrade();
};

function createQuestion() {
	"use strict"; // Avoids error message
	screenDisplay.innerHTML = "<div id='recentlyAddedQ'><h1>Added questions:</h1><div id='qListFilterHead'></div><div id='questionsListDiv'></div></div><div id='addQ'><h1>Add a question:</h1><form id='addQForm'><textarea form='addQForm' name='prompt' placeholder='Question' rows='5' cols='50'></textarea><br>Topic: <select name='topic'><option value='other'>other</option><option value='recursion'>recursion</option><option value='addition'>addition</option><option value='subtraction'>subtraction</option><option value='multiplication'>multiplication</option><option value='division'>division</option><option value='exponents'>exponents</option><option value='remainder'>remainder</option><option value='strings'>strings</option><option value='arrays'>arrays</option><option value='average'>average</option><option value='graphs'>graphs</option></select><br><input type='text' name='functionName' placeholder='Required function name'><br>Constraint: <select name='constraint'><option value='none'>none</option><option value='forLoop'>for loop</option><option value='whileLoop'>while loop</option><option value='recursion'>recursion</option></select><br><br>Difficulty:<br><input type='radio' name='difficulty' value='1'> Easy<br><input type='radio' name='difficulty' value='2'> Medium<br><input type='radio' name='difficulty' value='3'> Hard<br><br><input type='text' name='testCaseInput1' placeholder='Test case 1: input'><br><input type='text' name='testCaseOutput1' placeholder='Test case 1: output'><br><br><input type='text' name='testCaseInput2' placeholder='Test case 2: input'><br><input type='text' name='testCaseOutput2' placeholder='Test case 2: output'><br><br><input type='text' name='testCaseInput3' placeholder='Test case 3: input'><br><input type='text' name='testCaseOutput3' placeholder='Test case 3: output'><br><br><input type='text' name='testCaseInput4' placeholder='Test case 4: input'><br><input type='text' name='testCaseOutput4' placeholder='Test case 4: output'><br><br><input type='text' name='testCaseInput5' placeholder='Test case 5: input'><br><input type='text' name='testCaseOutput5' placeholder='Test case 5: output'><br><br><input type='text' name='testCaseInput6' placeholder='Test case 6: input'><br><input type='text' name='testCaseOutput6' placeholder='Test case 6: output'><br><br><button type='button' id='addQButton' onclick='submitQuestion()'>Create question</button>&nbsp;<button type='button' id='resetAQFormButton' onclick='resetAQForm()'>Reset form</button><p id='error'></p></form></div>";
	
	var qListFilterHead = document.getElementById('qListFilterHead');
	
	qListFilterHead.innerHTML += "<form id='qListFilterForm'>Filter by: <select onchange='filterList2(this.value)'><option value='none'>none</option><optgroup label='topic'><option value='other'>other</option><option value='recursion'>recursion</option><option value='addition'>addition</option><option value='subtraction'>subtraction</option><option value='multiplication'>multiplication</option><option value='division'>division</option><option value='exponents'>exponents</option><option value='remainder'>remainder</option><option value='strings'>strings</option><option value='arrays'>arrays</option><option value='average'>average</option><option value='graphs'>graphs</option></optgroup><optgroup label='difficulty'><option value='1'>easy</option><option value='2'>medium</option><option value='3'>hard</option></optgroup></select><button type='button' id='filterQLButton' onclick='getFiltered2()'>Filter</button><p id='filterError2'><p></form><p id='filterValues2'>Selected: </p><br>";
	
	var questionsListDiv = document.getElementById('questionsListDiv');
	var mainForm = document.getElementById('mainForm');
	var fData = new FormData(mainForm);

	fetch('instructorShowQ.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			error.innerHTML = "ERROR DISPLAYING QUESTIONS LIST";
		}
		else{
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				questionsListDiv.innerHTML += newData.questions[item].questionText+"<br>Question Id: "+newData.questions[item].questionId+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: ";
					
				if(newData.questions[item].difficulty === '1') {
					questionsListDiv.innerHTML += "Easy<br><br>";
				}
				else if(newData.questions[item].difficulty === '2') {
					questionsListDiv.innerHTML += "Medium<br><br>";
				}
				else if(newData.questions[item].difficulty === '3') {
					questionsListDiv.innerHTML += "Hard<br><br>";
				}
			}
		}
	});
}

function resetAQForm() {
	"use strict"; // Avoids error message
	document.getElementById('addQForm').reset();
}

var allQuestions; // Tim's solution
function createExam() {
	"use strict"; // Avoids error message
	screenDisplay.innerHTML = "<div id='examDraft'><h1>Draft of exam:</h1><div id='examDraftDiv'></div></div><div id='availableQ'><h1>Available questions:</h1><div id='filterHead'></div><form id='selectQForm'></form></div>";
	
	var filterHead = document.getElementById('filterHead');
	var selectQForm = document.getElementById('selectQForm');
	
	filterHead.innerHTML += "<form id='filterForm'>Filter by: <select onchange='filterList(this.value)'><option value='none'>none</option><optgroup label='topic'><option value='other'>other</option><option value='recursion'>recursion</option><option value='addition'>addition</option><option value='subtraction'>subtraction</option><option value='multiplication'>multiplication</option><option value='division'>division</option><option value='exponents'>exponents</option><option value='remainder'>remainder</option><option value='strings'>strings</option><option value='arrays'>arrays</option><option value='average'>average</option><option value='graphs'>graphs</option></optgroup><optgroup label='difficulty'><option value='1'>easy</option><option value='2'>medium</option><option value='3'>hard</option></optgroup></select><button type='button' id='filterQButton' onclick='getFiltered()'>Filter</button><p id='filterError'><p></form><p id='filterValues'>Selected: </p><br>";
	
	// Fetch all questions and display
	var mainForm = document.getElementById('mainForm');
	var fData = new FormData(mainForm);
	
	fetch('instructorCreateE.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			selectQForm.innerHTML = "ERROR";
		}
		else{
			allQuestions = newData.questions; // Tim's solution
			console.log(allQuestions[0]);
			
			selectQForm.innerHTML += "<input type='text' oninput='refreshExamDraft()' name='examName' id='examName' placeholder='Exam name'><br><br>";
			
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				selectQForm.innerHTML += "<input type='checkbox' onchange='refreshExamDraft()' id='"+newData.questions[item].questionId+"' name='pickedQ[]' value="+newData.questions[item].questionId+">"+newData.questions[item].questionText+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: ";
				
				if(newData.questions[item].difficulty === '1') {
					selectQForm.innerHTML += "Easy<br>";
				}
				else if(newData.questions[item].difficulty === '2') {
					selectQForm.innerHTML += "Medium<br>";
				}
				else if(newData.questions[item].difficulty === '3') {
					selectQForm.innerHTML += "Hard<br>";
				}
				
				selectQForm.innerHTML += "<input type='text' oninput='refreshExamDraft()' name='questionPoints[]' placeholder='Points worth'><br><br>";
			}
			
			selectQForm.innerHTML += "<br><button type='button' id='checkedQButton' onclick='addAllChecked()'>Create Exam</button><p id='examError'>Result:<p><br>";
		}
	});
}

function getFiltered() {
	var selectQForm = document.getElementById('selectQForm');
	
	var filterError = document.getElementById('filterError');
	var filterForm = document.getElementById('filterForm');
	
	if (filterForm.lastChild.nodeName === "INPUT") {
		filterForm.removeChild(filterForm.lastChild);
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'filterInput');
		input.setAttribute('value', filterArray);
		filterForm.appendChild(input);
	}
	else {
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'filterInput');
		input.setAttribute('value', filterArray);
		filterForm.appendChild(input);
	}
	
	var fData = new FormData(filterForm);
	
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+"P2:"+pair[1]);
	}
	
	fetch('instructorRequestFilter.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			filterError.innerHTML = "EMPTY";
		}
		else{
			selectQForm.innerHTML = "";
			selectQForm.innerHTML += "<input type='text' oninput='refreshExamDraft()' name='examName' id='examName' placeholder='Exam name'><br><br>";
			
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				selectQForm.innerHTML += "<input type='checkbox' onchange='refreshExamDraft()' id='"+newData.questions[item].questionId+"' name='pickedQ[]' value="+newData.questions[item].questionId+">"+newData.questions[item].questionText+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: ";
				
				if(newData.questions[item].difficulty === '1') {
					selectQForm.innerHTML += "Easy<br>";
				}
				else if(newData.questions[item].difficulty === '2') {
					selectQForm.innerHTML += "Medium<br>";
				}
				else if(newData.questions[item].difficulty === '3') {
					selectQForm.innerHTML += "Hard<br>";
				}
				
				selectQForm.innerHTML += "<input type='text' oninput='refreshExamDraft()' name='questionPoints[]' placeholder='Points worth'><br><br>";
			}
			
			selectQForm.innerHTML += "<br><button type='button' id='checkedQButton' onclick='addAllChecked()'>Create Exam</button><p id='examError'><p><br>";
		}
	});
	
}

function getFiltered2() {
	var questionsListDiv = document.getElementById('questionsListDiv');
	var qListFilterForm = document.getElementById('qListFilterForm');
	var filterError2 = document.getElementById('filterError2');
	
	if (qListFilterForm.lastChild.nodeName === "INPUT") {
		qListFilterForm.removeChild(qListFilterForm.lastChild);
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'filterInput');
		input.setAttribute('value', filterArray2);
		qListFilterForm.appendChild(input);
	}
	else {
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'filterInput');
		input.setAttribute('value', filterArray2);
		qListFilterForm.appendChild(input);
	}
	
	var fData = new FormData(qListFilterForm);
	
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+"P2:"+pair[1]);
	}
	
	fetch('instructorRequestFilter.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			filterError2.innerHTML = "EMPTY";
		}
		else{
			questionsListDiv.innerHTML = "";
			
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				questionsListDiv.innerHTML += newData.questions[item].questionText+"<br>Question Id: "+newData.questions[item].questionId+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: ";
					
				if(newData.questions[item].difficulty === '1') {
					questionsListDiv.innerHTML += "Easy<br><br>";
				}
				else if(newData.questions[item].difficulty === '2') {
					questionsListDiv.innerHTML += "Medium<br><br>";
				}
				else if(newData.questions[item].difficulty === '3') {
					questionsListDiv.innerHTML += "Hard<br><br>";
				}
			}
		}
	});
}

function filterList(option) {
	"use strict"; // Avoids error message
	var filterValues = document.getElementById('filterValues');
	
	if (option === 'none') {
		filterValues.innerHTML = "Selected: ";
		filterArray = [];
	}
	else {
		if (filterArray.length === 0) {
			filterValues.innerHTML += option;
			filterArray.push(option);
			console.log("ADDED:"+option);
			console.log("AFTERADD:"+filterArray);
		}
		else {
			filterValues.innerHTML += ", "+option;
			filterArray.push(option);
			console.log("ADDED:"+option);
			console.log("AFTERADD:"+filterArray);
		}
	}
}

function filterList2(option) {
	"use strict"; // Avoids error message
	var filterValues2 = document.getElementById('filterValues2');
	
	if (option === 'none') {
		filterValues2.innerHTML = "Selected: ";
		filterArray2 = [];
	}
	else {
		if (filterArray2.length === 0) {
			filterValues2.innerHTML += option;
			filterArray2.push(option);
			console.log("ADDED:"+option);
			console.log("AFTERADD:"+filterArray2);
		}
		else {
			filterValues2.innerHTML += ", "+option;
			filterArray2.push(option);
			console.log("ADDED:"+option);
			console.log("AFTERADD:"+filterArray2);
		}
	}
}

function refreshExamDraft() {
	"use strict"; // Avoids error message
	var examDraftDiv = document.getElementById('examDraftDiv');
	var selectQForm = document.getElementById('selectQForm');
	
	examDraftDiv.innerHTML = ""; // Tim's solution
	
	var fData = new FormData(selectQForm); 
	
	for (var pair of fData.entries()) {
		if (pair[0] == "examName") {
			examDraftDiv.innerHTML += "<strong>"+pair[1]+"</strong>"+"<br><br>";
		}
		if (pair[0] == "pickedQ[]") { // Tim's solution
			var questionId = parseInt(pair[1]) -1;
			
			examDraftDiv.innerHTML += allQuestions[questionId].questionText+"<br>Required function name: "+allQuestions[questionId].functionName+"<br>Topic: "+allQuestions[questionId].topic+"<br>Difficulty: ";
			
			if(allQuestions[questionId].difficulty === '1') {
				examDraftDiv.innerHTML += "Easy<br>";
			}
			else if(allQuestions[questionId].difficulty === '2') {
				examDraftDiv.innerHTML += "Medium<br>";
			}
			else if(allQuestions[questionId].difficulty === '3') {
				examDraftDiv.innerHTML += "Hard<br>";
			}
			
			examDraftDiv.innerHTML += "Points: ";
		}
		if (pair[0] == "questionPoints[]") {
				examDraftDiv.innerHTML += pair[1]+"<br><br>";
		}
	}
}

function releaseExam() {
	"use strict"; // Avoids error message
	screenDisplay.innerHTML = "<div id='releaseExamDiv'><h1>Select an exam to release to students:</h1><br><div id='allExamsDiv'><form id='selectEForm'></form></div></div>";
	
	var allExamsDiv = document.getElementById('allExamsDiv');
	var mainForm = document.getElementById('mainForm');
	var fData = new FormData(mainForm);
	
	fetch('instructorReleaseExam.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			allExamsDiv.innerHTML = "ERROR GETTING LIST OF EXAMS";
		}
		else{
			var item;
			var eArray = newData.exams;
			for (item = 0; item < newData.exams.length; item++) {
				selectEForm.innerHTML += "<input type='radio' name='pickedE' value="+newData.exams[item].examId+">"+newData.exams[item].examName+"<br>";
				//<input type='hidden' name='examID' value="+newData.exams[item].examId+">
			}
			selectEForm.innerHTML += "<br><button type='button' id='radioEButton' onclick='releaseRadioExam()'>Release Exam</button><br><p id='radioResult'></p>";
		}
	});
}

function releaseGrade() {
	"use strict"; // Avoids error message
	screenDisplay.innerHTML = "<div><h1>Select a graded exam to release:</h1><br><div id='gradedExamsDiv'><form id='selectGEForm'></form><p id='gError'>Result:</p><br></div></div>";
	
	var gradedExamsDiv = document.getElementById('gradedExamsDiv');
	var gError = document.getElementById('gError');
	var selectGEForm = document.getElementById('selectGEForm');
	
	var mainForm = document.getElementById('mainForm');
	var fData = new FormData(mainForm);
	fetch('instructorReleaseGrade.php', { // Get (middle) graded unreleased (grade) exams
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			gError.innerHTML = "ERROR GETTING EXAMS";
		}
		else{
			//console.log(newData.examInstances);
			var item;
			for (item = 0; item < newData.examInstances.length; item++) {
				if (newData.examInstances[item].gradeReleased === "false") {
					var examAndStudentId = [newData.examInstances[item].studentId, newData.examInstances[item].examId];
					
					selectGEForm.innerHTML += "<input type='radio' name='examInfo' value="+examAndStudentId+"><br>"+"Exam: "+newData.examInstances[item].examName+"<br>Student: "+newData.examInstances[item].studentId+"<br><br>";
				}
			}
			selectGEForm.innerHTML += "<button type='button' id='radioAdjustEButton' onclick='radioAdjustExam()'>View/Adjust Exam</button><br><p id='radioGradedResult'></p>";
		}
	});
}

function submitQuestion() {
	"use strict"; // Avoids error message
	
	var error = document.getElementById('error');
	var onlyAddQForm = document.getElementById('addQForm');
	var questionsListDiv = document.getElementById('questionsListDiv');
	
	var fData = new FormData(onlyAddQForm);
	
	fetch('instructorAddQ.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			error.innerHTML = "Please fill in all fields.";
		}
		else{
			var mainForm = document.getElementById('mainForm');
			var fData = new FormData(mainForm);

			fetch('instructorShowQ.php', {
				method: 'POST',
				body: fData
			})
			.then( res => res.json()) // Once we have a response
			.then (newData => { // Data from response ^
				if(newData === 'error') {
					error.innerHTML = "ERROR DISPLAYING QUESTIONS LIST";
				}
				else{
					questionsListDiv.innerHTML = ""; // Refresh Added Questions Div
					var item;
					for (item = 0; item < newData.questions.length; item++) {
						questionsListDiv.innerHTML += newData.questions[item].questionText+"<br>Question Id: "+newData.questions[item].questionId+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: ";
						
						if(newData.questions[item].difficulty === '1') {
							questionsListDiv.innerHTML += "Easy<br><br>";
						}
						else if(newData.questions[item].difficulty === '2') {
							questionsListDiv.innerHTML += "Medium<br><br>";
						}
						else if(newData.questions[item].difficulty === '3') {
							questionsListDiv.innerHTML += "Hard<br><br>";
						}
					}
					
				}
			});
		}
	});
	
}

function addAllChecked() {
	"use strict"; // Avoids error message
	
	var error = document.getElementById('examError');
	var onlyExamDraftForm = document.getElementById('selectQForm');

	var examDraftDiv = document.getElementById('examDraftDiv');
	
	var fData = new FormData(onlyExamDraftForm);
	
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+"P2:"+pair[1]);
	}
	
	fetch('instructorSubmitExam.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			error.innerHTML = "Please fill in all fields.";
		}
		else {
			error.innerHTML = "Exam Created!";
		}
	});
}

function releaseRadioExam() {
	"use strict"; // Avoids error message
	var onlyReleaseExamForm = document.getElementById('selectEForm');
	var fData = new FormData(onlyReleaseExamForm);
	var radioResult = document.getElementById('radioResult');
	
	for (var value of fData.values()) {
		console.log("Here!");
		console.log("fData: "+value);
	}
	
	fetch('instructorSubmitRelease.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'Please choose an exam') {
			radioResult.innerHTML = "Please fill in all fields.";
		}
		else{ 
			radioResult.innerHTML = "Exam released!";
		}
	});
}

function radioAdjustExam() {
	"use strict"; // Avoids error message
	var onlyReleaseGradedExamForm = document.getElementById('selectGEForm');
	var fData = new FormData(onlyReleaseGradedExamForm);
	var radioGradedResult = document.getElementById('radioGradedResult');
	
	for (var pair of fData.entries()) { // Test this to see if examId and studentId transfer over
		console.log("P1:"+pair[0]+",P2:"+pair[1]);
	}
	
	fetch('instructorViewGradedExam.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		console.log("Focus:"+newData.questions);
		if(newData === 'empty') {
			radioGradedResult.innerHTML = "Please choose an exam.";
		}
		else{ 
			onlyReleaseGradedExamForm.innerHTML = "";
			if (newData.gradeReleased === "false") {
				var item;
				for (item = 0; item < newData.questions.length; item++) {
					onlyReleaseGradedExamForm.innerHTML += "<strong>Question:</strong> "+newData.questions[item].questionText+"<br><strong>Answer:</strong>"+newData.questions[item].answerText+"<br><strong>Total points:</strong>"+newData.questions[item].grade+"<br>";
					var iter;
					for (iter = 0; iter < newData.questions[item].pointBreakdown.length; iter++) {
						onlyReleaseGradedExamForm.innerHTML += "<strong>Points:</strong> "+newData.questions[item].pointBreakdown[iter].points+"<br>"+"<strong>Reason:</strong> "+newData.questions[item].pointBreakdown[iter].reason+"<br>";
					}
					onlyReleaseGradedExamForm.innerHTML += "<input type='text' name='adjustments[]' placeholder='Adjustment'><br><input type='text' name='adjustmentReasons[]' placeholder='Adjustment reason'><br><input type='text' name='comments[]' placeholder='Comment'><br>";
				}
				onlyReleaseGradedExamForm.innerHTML += "<br><br><button type='button' id='submitAdjustmentsButton' onclick='submitExamAdjustments()'>Submit Adjustments</button></form><br><p id='submitAdjustmentsResult'>Result:</p><br>";
			}
			else {
				onlyReleaseGradedExamForm.innerHTML = "NO EXAM GRADES TO RELEASE";
			}
		}
	});
}

function submitExamAdjustments() {
	"use strict"; // Avoids error message
	var onlyReleaseGradedExamForm = document.getElementById('selectGEForm');
	var submitAdjustmentsResult = document.getElementById('submitAdjustmentsResult');
	
	var fData = new FormData(onlyReleaseGradedExamForm);
	console.log(fData);
	
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+",P2:"+pair[1]);
	}
	
	fetch('instructorSubmitGraded.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			submitAdjustmentsResult.innerHTML = "EMPTY, DID NOT SUBMIT";
		}
		else{
			submitAdjustmentsResult.innerHTML = "EXAM SUBMITTED!";
		}
	}); 
}

// Unused
/*
function addTestCase() {
	"use strict"; // Avoids error message
	
	var addQForm = document.getElementById('addQForm');
	
	var br = document.createElement("BR");
	addQForm.appendChild(br);
	
	var input = document.createElement("INPUT");
	input.setAttribute('type', 'text');
	input.setAttribute('name', 'testCaseInput[]');
	input.setAttribute('placeholder', 'Test case input');
    addQForm.appendChild(input);
	
	var br = document.createElement("BR");
	addQForm.appendChild(br);
	
	var input = document.createElement("INPUT");
	input.setAttribute('type', 'text');
	input.setAttribute('name', 'testCaseOutput[]');
	input.setAttribute('placeholder', 'Test case output');
    addQForm.appendChild(input);
}

function delTestCase() {
	"use strict"; // Avoids error message
	
	var addQForm = document.getElementById('addQForm');
	
	var i = 0;
	for (i; i < 4; i++) {
		console.log("LAST:"+addQForm.lastChild.nodeName);
		if (addQForm.lastChild.nodeName !== "#text") {
			addQForm.removeChild(addQForm.lastChild);
		}
	}
}

function deleteQuestion() {
	"use strict"; // Avoids error message
	
	var deleteQForm = document.getElementById('deleteQForm');
	var deleteQResult = document.getElementById('deleteQResult');
	var fData = new FormData(deleteQForm);
	
	// Check the if the form data is correct
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+" "+"P2:"+pair[1]);
	}
	
	fetch('instructorDeleteQ.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			deleteQResult.innerHTML = "Please select a question to delete.";
		}
		else{
			deleteQResult.innerHTML = "Successfully deleted";
			// Refresh questions list
			var mainForm = document.getElementById('mainForm');
			var fData = new FormData(mainForm);

			fetch('instructorShowQ.php', {
				method: 'POST',
				body: fData
			})
			.then( res => res.json()) // Once we have a response
			.then (newData => { // Data from response ^
				if(newData === 'error') {
					error.innerHTML = "ERROR DISPLAYING QUESTIONS LIST";
				}
				else{
					deleteQForm.innerHTML = ""; // Refresh Added Questions Div
					var item;
					for (item = 0; item < newData.questions.length; item++) {
						deleteQForm.innerHTML += "<input type='radio' name='pickedDQ' value="+newData.questions[item].questionId+">"+"Prompt: "+newData.questions[item].questionText+"<br>Question ID: "+newData.questions[item].questionId+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: "+newData.questions[item].difficulty+"<br><br>";
					}
					deleteQForm.innerHTML += "<button type='button' id='deleteQButton' onclick='deleteQuestion()'>Delete</button><p id='deleteQResult'>Result: </p>";
				}
			});
		}
	});
}
*/