let $queensPerBoardSelector = $("#select-queens-list");
let $numOfSolutionSelector = $("#solutions-list");
let $queenIcon = $(".queen-icon");
let queensPerBoardValue;
let maxNumberAllowedQueens;
let arrayOfSolutionsNQueens;
let previouslyClickedQueenId;

/**
 * This executes once as soon as the page is ready and do three things:
 * 1.- obtains the currently selected value on the list of queens per board.
 * 2.- obtains the maximum number of queens allowed on a board, this number is defined having into consideration the
 *	   resources required to do the corresponding calculations.
 * 3.- calls another function in order query all possible solutions for a specified number of queens
 */
$(document).ready(function () {
	queensPerBoardValue = parseFloat($queensPerBoardSelector.val()); //The default value on first load is 8 queens
	// (standard
	// board)
	maxNumberAllowedQueens = obtainMaxNumOfQueens();
	
	queryAllSolutionsForNQueens(queensPerBoardValue); //async
});

/**
 * This is executed whenever the user selects a new value on the list containing all possible values for the
 * number of queens per board, it gets that new value and queries all possible solutions for the new number of
 * queens selected.
 */
$queensPerBoardSelector.on("change", function () {
	queensPerBoardValue = parseFloat($queensPerBoardSelector.val());
	
	queryAllSolutionsForNQueens(queensPerBoardValue);
});

/**
 * This is executed whenever the user selects a new solution on the list containing all possible values for the
 * already calculated solutions of a specific number of queens per board, it gets the new selected value and first
 * hides all already shown queen on the current board and then places all the queen on the board according to the
 * selected solution.
 */
$numOfSolutionSelector.on('change', function () {
	let selectedSolutionBoard = this.value.toString();
	
	hideAllQueens(queensPerBoardValue);
	hideAllCrossMarks(queensPerBoardValue);
	drawSolutionOnChessboard(arrayOfSolutionsNQueens[selectedSolutionBoard - 1]);//zero-based index
})

/**
 * This is executed every time the user clicks on a queen icon; it calculates the range of attack for that piece and
 * then toggles all cross mark-icons.
 */
$queenIcon.click(function () {
	let currentlyClickedQueenId = $(this).attr('id'); //e.g. board-3-square-2-1
	
	if (previouslyClickedQueenId !== currentlyClickedQueenId) {
		hideAllCrossMarks(queensPerBoardValue);
	}
	
	let clickedQueenCoordinates = currentlyClickedQueenId.match(/board-(\d+)-square-(\d+)-(\d+)/);
	let boardSize = clickedQueenCoordinates[1];//one-base index
	let queenRank = clickedQueenCoordinates[2] - 1;//zero-based index
	let queenFile = clickedQueenCoordinates[3] - 1;//zero-based index
	
	for (let currentRank = 0; currentRank < boardSize; currentRank++) {
		for (let currentFile = 0; currentFile < boardSize; currentFile++) {
			
			//If clicked queen is on current square -> skip to next square
			if (currentRank === queenRank && currentFile === queenFile) continue;
			
			let squareIsOnQueenRank = (queenRank === currentRank);
			let squareISOnQueenFile = (queenFile === currentFile);
			let squareIsOnQueenDiagonal =
				(Math.abs(queenRank - currentRank) === Math.abs(queenFile - currentFile));
			
			if (squareISOnQueenFile || squareIsOnQueenRank || squareIsOnQueenDiagonal) {
				let $crossMarkIcon =
					$("#board-" + boardSize + "-square-" + (currentRank + 1) + "-" + (currentFile + 1) + "-attack");
				let crossMarkDisplayValue = $crossMarkIcon.css("display");
				
				if (currentlyClickedQueenId === previouslyClickedQueenId && crossMarkDisplayValue === "block") {
					$crossMarkIcon.css("display", "none");
				} else {
					$crossMarkIcon.css("display", "block");
				}
			}
		}
	}
	previouslyClickedQueenId = currentlyClickedQueenId;
})

/**
 * This function takes the number of queens per board and makes an asynchronous GET request in order to bring an array
 * with all possible solutions to the n-queens problem, after that it calls multiple functions in order to update the
 * page to reflect the new selected board and their new solutions available.
 *
 * @param {number} queensPerBoardValue The number of queens per board. This number is selected by the user or set to
 * 8 by default on the first run.
 */
function queryAllSolutionsForNQueens(queensPerBoardValue) {
	//asynchronous
	$.get("/get-all-solutions", {numOfQueens: queensPerBoardValue}, function (obtainedArray) {
		arrayOfSolutionsNQueens = obtainedArray;
		
		let firstBoardSolution = arrayOfSolutionsNQueens[0];
		let numOfSolutionsFoundNQueens = arrayOfSolutionsNQueens.length;
		
		setNumSolutionsFoundLabel(numOfSolutionsFoundNQueens);
		resetNumOfSolutionSelector();
		populateNumOfSolutionSelector(numOfSolutionsFoundNQueens);
		adjustTileHeightAndWidth(queensPerBoardValue);
		showOnlySelectedBoard(queensPerBoardValue);
		hideAllQueens(queensPerBoardValue);
		hideAllCrossMarks(queensPerBoardValue);
		drawSolutionOnChessboard(firstBoardSolution);
	})
}

/**
 * This function obtains the maximum number of queens allowed, since this program can deal with many operations, it
 * must have a limit for how many queens we are going to calculate their solutions without causing the system to run
 * out resources. This maximum number is defined on the back end and reflected on an html list.
 *
 * @returns {number} The maximum number of queens allowed.
 */
function obtainMaxNumOfQueens() {
	let maxNumAllowedQueens = 0;
	
	$("#select-queens-list > option").each(function () {
		let value = parseInt($(this).val());
		
		maxNumAllowedQueens = (value > maxNumAllowedQueens) ? value : maxNumAllowedQueens;
	})
	
	return maxNumAllowedQueens;
}

/**
 * This function receives the number of solutions found for the current number of queens selected and sets that value
 * into an HTML label for the user to see.
 *
 * @param {number} numOfSolutionsFoundNQueens The number of solutions found for the current number of queens selected.
 */
function setNumSolutionsFoundLabel(numOfSolutionsFoundNQueens) {
	$("#num-results-label").text(numOfSolutionsFoundNQueens);
}

/**
 * This function finds the HTML list with all the numbers of found solutions for a specific number of queens and
 * deletes all entries, so if a different amount of solutions is found then the list can be populated without
 * worrying about previous values existing on the list.
 */
function resetNumOfSolutionSelector() {
	$("#solutions-list option").each(function () {
		$(this).remove();
	})
}

/**
 * This function finds the HTML list and populates it with a list of numbers referencing all solutions found for
 * the current number of queens. If no solutions where found, then a placeholder value is added to indicate that
 * no solutions are available to be selected, but even so, the HTML list is disabled so the user can't try to select the
 * placeholder value.
 *
 * @param {number} numOfSolutionsFoundNQueens The number of solutions found for the current number of queens selected.
 */
function populateNumOfSolutionSelector(numOfSolutionsFoundNQueens) {
	if (numOfSolutionsFoundNQueens > 0) {
		$numOfSolutionSelector.attr("disabled", false);
		
		for (let currentSolution = 1; currentSolution <= numOfSolutionsFoundNQueens; currentSolution++) {
			$numOfSolutionSelector.append(new Option(currentSolution.toString(), currentSolution.toString()));
		}
		
	} else {
		$numOfSolutionSelector.append(new Option("----", ""));
		$numOfSolutionSelector.attr("disabled", true);
	}
}

/**
 * This function sets the width and line height of all HTML elements that contain the 'tile' class, this is
 * necessary in order to maintain a 1:1 aspect ratio on the currently presented board and with this the chessboard size
 * is going to be responsive.
 *
 * @param {number} queensPerBoardValue The number of queens per board. This number is selected by the user or set to
 * 8 by default on the first run.
 */
function adjustTileHeightAndWidth(queensPerBoardValue) {
	let $tileElement = $(".tile");
	let numOfRowsPlusLabels = queensPerBoardValue + 2;
	let numOfFilesPlusLabels = queensPerBoardValue + 2;
	
	$tileElement.css("line-height", "calc(100% / " + numOfRowsPlusLabels + ")");
	$tileElement.css("width", "calc(100% / " + numOfFilesPlusLabels + ")");
}

/**
 * This function hides every single board on the page and then it shows only the chessboard corresponding to the number
 * of selected queens.
 *
 * @param {number} queensPerBoardValue The number of queens per board. This number is selected by the user or set to
 * 8 by default on the first run.
 */
function showOnlySelectedBoard(queensPerBoardValue) {
	
	for (let currentBoard = 1; currentBoard <= maxNumberAllowedQueens; currentBoard++) {
		$("#board-" + currentBoard).css("display", "none");
	}
	
	$("#board-" + queensPerBoardValue).css("display", "block");
}

/**
 * This function hides every single queen icon on the current board, it does this in order to have a clean board
 * when a new solution is drawn.
 *
 * @param {number} queensPerBoardValue The number of queens per board. This number is selected by the user or set to
 * 8 by default on the first run.
 */
function hideAllQueens(queensPerBoardValue) {
	
	for (let currentRank = 1; currentRank <= queensPerBoardValue; currentRank++) {
		for (let currentFile = 1; currentFile <= queensPerBoardValue; currentFile++) {
			$("#board-" + queensPerBoardValue + "-square-" + currentRank + "-" + currentFile).css("display", "none");
		}
	}
}

/**
 * This function hides every single cross mark on the current board.
 *
 * @param {number} queensPerBoardValue The number of queens per board. This number is selected by the user or set to
 * 8 by default on the first run.
 */
function hideAllCrossMarks(queensPerBoardValue) {
	
	for (let currentRank = 1; currentRank <= queensPerBoardValue; currentRank++) {
		for (let currentFile = 1; currentFile <= queensPerBoardValue; currentFile++) {
			$("#board-" + queensPerBoardValue + "-square-" + currentRank + "-" + currentFile + "-attack")
				.css("display", "none");
		}
	}
}

/**
 * This function takes an array with the solution selected by the user for the current number of queens and shows
 * all pieces on their corresponding coordinates according to the array.
 *
 * @param arrayOfSolutionsNQueens The array containing the positions of all queens for the selected solution.
 */
function drawSolutionOnChessboard(arrayOfSolutionsNQueens) {
	for (let currentRank = 1; currentRank <= queensPerBoardValue; currentRank++) {
		let queenFilePosition = arrayOfSolutionsNQueens[currentRank - 1] + 1;
		
		$("#board-" + arrayOfSolutionsNQueens.length + "-square-" + currentRank + "-" + queenFilePosition)
			.css("display", "block");
	}
}