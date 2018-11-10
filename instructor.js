/*jshint esversion: 6 */
//"use strict"; // Avoids error message //Use in functions

var screenDisplay = document.getElementById('show');

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
	screenDisplay.innerHTML = "<div id='recentlyAddedQ'><h1>Added questions:</h1><div id='questionsListDiv'></div><form id='deleteQForm'></form></div><div id='addQ'><h1>Add a question:</h1><form id='addQForm'><textarea form='addQForm' name='prompt' placeholder='Question'></textarea><br><input type='text' name='topic' placeholder='Topic'><br><input type='text' name='parameter1' placeholder='Required parameter 1'><br><input type='text' name='parameter2' placeholder='Required parameter 2'><br><input type='text' name='output' placeholder='Required output'><br><input type='text' name='functionName' placeholder='Required function name'><br><input type='radio' name='difficulty' value='1'> Easy<br><input type='radio' name='difficulty' value='2'> Medium<br><input type='radio' name='difficulty' value='3'> Hard<br><br><button type='button' id='addQButton' onclick='submitQuestion()'>Add</button>&nbsp;<button type='button' id='resetAQFormButton' onclick='resetAQForm()'>Reset</button><p id='error'></p></form></div>";
	
	var deleteQForm = document.getElementById('deleteQForm');
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
				deleteQForm.innerHTML += "<input type='radio' name='pickedDQ' value="+newData.questions[item].questionId+">"+"Prompt: "+newData.questions[item].questionText+"<br>Question ID: "+newData.questions[item].questionId+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: "+newData.questions[item].difficulty+"<br><br>";
			}
			deleteQForm.innerHTML += "<button type='button' id='deleteQButton' onclick='deleteQuestion()'>Delete</button><p id='deleteQResult'>Result: </p>";
		}
	});
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

function resetAQForm() {
	"use strict"; // Avoids error message
	document.getElementById('addQForm').reset();
}

var allQuestions; // Tim's solution
function createExam() {
	"use strict"; // Avoids error message
	screenDisplay.innerHTML = "<div id='examDraft'><h1>Draft of exam:</h1><div id='examDraftDiv'></div></div><div id='availableQ'><h1>Available questions:</h1><form id='selectQForm'></form></div>";
	
	var selectQForm = document.getElementById('selectQForm');
	
	// Fetch all questions and display in 
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
			
			selectQForm.innerHTML += "<input type='text' oninput='refreshExamDraft()' name='examName' id='examName' placeholder='Exam name'><br><br>";
			
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				selectQForm.innerHTML += "<input type='checkbox' onchange='refreshExamDraft()' id='"+newData.questions[item].questionId+"' name='pickedQ[]' value="+newData.questions[item].questionId+">"+newData.questions[item].questionText+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: "+newData.questions[item].difficulty+"<br><input type='text' oninput='refreshExamDraft()' name='questionPoints[]' placeholder='Points worth'><br><br>";
			}
			selectQForm.innerHTML += "<br><button type='button' id='checkedQButton' onclick='addAllChecked()'>Create Exam</button><p id='examError'><p><br>";
		}
	});
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
			examDraftDiv.innerHTML += allQuestions[questionId].questionText+"<br>Required function name: "+allQuestions[questionId].functionName+"<br>Topic: "+allQuestions[questionId].topic+"<br>Difficulty: "+allQuestions[questionId].difficulty+"<br>Points: ";
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
	screenDisplay.innerHTML = "<div><h1>Select a graded exam to release:</h1><br><div id='gradedExamsDiv'><form id='selectGEForm'></form><p id='gError'>Result:</p></div></div>";
	
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
					console.log(newData.questions[0].questionId);
					var item;
					var qArray = newData.questions;
					console.log("ArrayQ:",qArray[0]);
					for (item = 0; item < newData.questions.length; item++) {
						questionsListDiv.innerHTML += newData.questions[item].questionText+"<br>Question ID: "+newData.questions[item].questionId+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: "+newData.questions[item].difficulty+"<br><br>";
					}
					
				}
			});
			
			/*
			questionsListDiv.innerHTML += newData.questionText+"<br>";
			questionsListDiv.innerHTML += newData.topic+"<br>";
			// questionListDiv.innerHTML += newData.questionId+"<br>;"
			
			if(newData.difficulty === '1') {
				questionsListDiv.innerHTML += "Easy<br><br>";
			}
			else if(newData.difficulty === '2') {
				questionsListDiv.innerHTML += "Medium<br><br>";
			}
			else if(newData.difficulty === '3') {
				questionsListDiv.innerHTML += "Hard<br><br>";
			}
			*/
		}
	});
	
}

function addAllChecked() {
	"use strict"; // Avoids error message
	
	var error = document.getElementById('examError');
	var onlyExamDraftForm = document.getElementById('selectQForm');

	var examDraftDiv = document.getElementById('examDraftDiv');
	
	var fData = new FormData(onlyExamDraftForm);
	
	fetch('instructorSubmitExam.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			error.innerHTML = "Please fill in all fields.";
		}
		else{
			error.innerHTML = "Exam Created!";
		}
	});
}

function submitDraft() {
	"use strict"; // Avoids error message
	
	var onlyExamDraftForm = document.getElementById('selectQForm');
	var fData = new FormData(onlyExamDraftForm);
	var result = document.getElementById('createExamResult');
	
	fetch('instructorSubmitExam.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'Blank exam name!') {
			result.innerHTML = "Blank exam name!";
		}
		else{
			result.innerHTML = "Exam created!";
		}
	});
} // Unused. May be deleted or used as reference

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
	var gradedExamsDiv = document.getElementById('gradedExamsDiv');
	
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
			gradedExamsDiv.innerHTML = "";
			if (newData.gradeReleased === "false") {
				var item;
				for (item = 0; item < newData.questions.length; item++) {
					gradedExamsDiv.innerHTML += "<strong>Question:</strong> "+newData.questions[item].questionText+"<br><strong>Answer:</strong>"+newData.questions[item].answerText+"<br><strong>Total points:</strong>"+newData.questions[item].grade+"<br>";
					var iter;
					for (iter = 0; iter < newData.questions[item].pointBreakdown.length; iter++) {
						gradedExamsDiv.innerHTML += "<form id='adjustmentForm'><strong>Points:</strong> "+newData.questions[item].pointBreakdown[iter].points+"<br>"+"<strong>Reason:</strong> "+newData.questions[item].pointBreakdown[iter].reason+"<br><input type='text' name='newPoints[]' placeholder='New score'><br><input type='text' name='comments[]' placeholder='Add comment'><br>";
					}
				}
				gradedExamsDiv.innerHTML += "<button type='button' id='submitAdjustmentsButton' onclick='submitExamAdjustments()'>Submit Adjustments</button></form><br><p id='submitAdjustmentsResult'></p>";
			}
			else {
				gradedExamsDiv.innerHTML = "NO EXAM GRADES TO RELEASE";
			}
		}
	});
}

function submitExamAdjustments() {
	"use strict"; // Avoids error message
	var submitAdjustmentsResult = document.getElementById('submitAdjustmentsResult');
	
	var onlyAdjustmentForm = document.getElementById('adjustmentForm');
	var fData = new FormData(onlyAdjustmentForm);
	
	fetch('instructorSubmitGraded.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			submitAdjustmentsResult.innerHTML = "ERROR";
		}
		else{
			submitAdjustmentsResult.innerHTML = "EXAM SUBMITTED!";
		}
	}); 
}