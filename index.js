//these will contain final questions, options and answer
let questions = [];
let optionsForQuestion = [];
let answerIndex = [];
let currentAskingQuestion = 0;
let userAnswers=[];
let notEditable = false;


//these are for temporary use
let question;
let optionsContainer;
let options;
let availableOptions;
let answerContainer;



////////////////////////////////////////////////////////////////
/////////////Functions for Adding Question/////////////////////
//////////////////////////////////////////////////////

function getValuesAndtest(){
	question = document.getElementById("question").value;
	if(question ==""){
		alert("Question is empty");
		return 0;
	}
	optionsContainer = Array.from(document.querySelectorAll("input[name='answerField']"));
	options = optionsContainer.map(option => option.value)
	availableOptions = options.filter(option => option != "")
	answerContainer = document.querySelector("input[name='answer']:checked");
	if(availableOptions.length > 1){
		if(answerContainer){
			if(options[answerContainer.value] != ""){
				return 1;
			}else{
				alert("You chose empty option");
				return 0;
			}
		}else{
			alert("Please Choose answer");
			return 0;
		}
	}else{
		alert("Give atleast two options");
		return 0
	}
}

function save(){
	questions[currentAskingQuestion] = question;
	optionsForQuestion[currentAskingQuestion]=options;
	answerIndex[currentAskingQuestion] = answerContainer.value
}


function showOptions(){
	document.getElementById("question").value=questions[currentAskingQuestion];
	optionsContainer = Array.from(document.querySelectorAll("input[name='answerField']"));
	optionsContainer.forEach((option,i)=>{
		if(notEditable){
			option.setAttribute("readonly","");
		}
		option.value=optionsForQuestion[currentAskingQuestion][i]
	});

	answerContainer = document.querySelectorAll("input[name='answer']");
	
	if(notEditable){
		document.getElementById("question").setAttribute("readonly","");
		if(userAnswers.length > currentAskingQuestion){
			answerContainer[userAnswers[currentAskingQuestion]].checked=true;
		}
	}else{
		answerContainer[answerIndex[currentAskingQuestion]].checked=true;
	}

}

function addNext(){
	if(getValuesAndtest()){
		save();
		currentAskingQuestion +=1;
		if(questions.length == currentAskingQuestion){
			document.querySelector("form").reset();
		}else{
			showOptions();
		}
		// console.log(questions,optionsForQuestion,answerIndex);
	}	
}

function addPrevious(){
	if(currentAskingQuestion == 0){
		alert("No Questions Remaining!!")
		return;
	}
	// console.log(currentAskingQuestion,questions.length,getValuesAndtest())
	// if(!(questions.length == currentAskingQuestion)){
	if(document.getElementById("question").value != "" ){
		if(getValuesAndtest()){
		save();
		}else{
			return;
		}
	}
	currentAskingQuestion -=1;
	showOptions();
}



////////////////////////////////////////////////////////////////
/////////////Functions for Asking Question/////////////////////
//////////////////////////////////////////////////////

let questionNumber;
let totalquestions;
function startQuiz(){
	if(document.getElementById("question").value != "" ){
		if(getValuesAndtest()){
		save();
		}else{
			return;
		}
	}
	if(questions.length==0){
		alert("Add some questions first to begin");
		return;
	}
	//hiding start quiz button
	document.getElementById("startQuizBtn").style.display = "none"
	alert("Welcome to Quiz")
	let notice = document.getElementById("notice");
	notice.innerHTML = `
	Please Read Carefully before starting quiz
				<ul>
					<li>You can't go for next question without answering current question</li>
					<li>select the correct answer for asked question using circle button</li>
					<li>You can edit your previous answers</li>
					<li>If you refresh this page, every thing including questions will be lost.</li>
				</ul>
	`
	notEditable = true;
	//for clearing checked options if user start quiz before reaching last question
	answerContainer = document.querySelector("input[name='answer']:checked");
	if(answerContainer){
		answerContainer.checked=false;
	}
	document.getElementById("next").setAttribute("onclick","askNext()");
	document.getElementById("previous").setAttribute("onclick","askPrevious()");
	currentAskingQuestion = 0;

	questionNumber = document.getElementById("questionNumber");
	totalquestions = questions.length;
	questionNumber.innerHTML = `QN.(${currentAskingQuestion + 1} out of ${totalquestions})`
	showOptions();
}

function askNext(){

	if(getValuesAndtest()){
		userAnswers[currentAskingQuestion] = answerContainer.value;
		currentAskingQuestion +=1;
		questionNumber.innerHTML = `QN.(${currentAskingQuestion + 1} out of ${totalquestions})`
		if(userAnswers.length == currentAskingQuestion){
			document.querySelector("input[name='answer']:checked").checked=false;
		}
		if(questions.length == currentAskingQuestion){
			showResult();
		}else{
			showOptions();
		}
		// console.log(questions,optionsForQuestion,answerIndex);
	}	
}

function askPrevious(){
	if(currentAskingQuestion == 0){
		alert("No Questions Answered yet!!")
		return;
	}
	if(getValuesAndtest()){
		userAnswers[currentAskingQuestion] = answerContainer.value
		}else{
			return;
		}
	currentAskingQuestion -=1;
	questionNumber.innerHTML = `QN.(${currentAskingQuestion + 1} out of ${totalquestions})`
	showOptions();
}

function showResult(){
	let container = document.querySelector(".container")
	let correctAnswerCount = 0;
	for(let i =0; i<userAnswers.length; i++){
		if(userAnswers[i] == answerIndex[i]){
			correctAnswerCount +=1;
		}
	}
	let result=`
		<table>
			<tr>
				<th>Questions</th>
				<th>Correct Answer </th>
				<th> Your answer </th>
				<th> Point Obtained</th>
			</tr>
			${
				// for(i = 0; i < questions.length; i++)
				answerIndex.map((answer,i) => (
				
					`<tr><td><b>${questions[i]}</b></td>
					<td>${optionsForQuestion[i][answerIndex[i]]}</td>
					${(userAnswers[i] == answerIndex[i]) ?
						`<td><font color="green">${optionsForQuestion[i][answerIndex[i]]}</font></td>
						<td>1</td>` : `
						<td><font color="red">${optionsForQuestion[i][answerIndex[i]]}</font></td>
						<td>0</td>`
					}
					</tr>`))
				}
				<tr><td colspan="3"><center>Total Correct </center></td><td>${correctAnswerCount}</td></tr>
		</table>
		<br/>
		<button id="next"><a href="index.html">Start From Beginning</button>
	`
	container.innerHTML = result;
}