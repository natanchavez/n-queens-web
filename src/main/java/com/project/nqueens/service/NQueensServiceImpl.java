package com.project.nqueens.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service - contains the business logic used to calculate all possible solutions for the n-queens problem.
 */
@Service
public class NQueensServiceImpl implements NQueensService {
	private List<int[]> solutionsList;
	
	/**
	 * Gets the value of the solutions list variable.
	 *
	 * @return a list that contains the position of the queens in the board.
	 */
	private List<int[]> getSolutionsList() {
		return solutionsList;
	}
	
	/**
	 * Sets the value on the solutions list variable.
	 *
	 * @param solutionsList contains the solutions list containing all the valid boards already found.
	 */
	private void setSolutionsList(List<int[]> solutionsList) {
		this.solutionsList = solutionsList;
	}
	
	/**
	 * This method takes a backtracking approach to find all the solutions to the N-Queens problem, unlike the brute
	 * force approach, this algorithm can find more solutions in less time because it doesn't compute all the possible
	 * boards but only those with a valid solution. This method is used to initialize an array that is going to contain
	 * the valid positions of the queens in the board.
	 *
	 * @param chosenNumOfQueens contains the selected number of queens to be in the board.
	 * @return a list that contains the position of the queens in the board.
	 */
	@Override
	public List<int[]> backtrackingApproach(Integer chosenNumOfQueens) {
		setSolutionsList(new ArrayList<>());
		int[] solutionArray = new int[chosenNumOfQueens];
		
		findByRecursion(solutionArray, 0);
		return getSolutionsList();
	}
	
	/**
	 * This method serves as an entry point in the process of finding all valid solutions, by using recursion calls
	 * another method to do some validations or saves an already found valid board.
	 *
	 * @param solutionArray    contains the array that is going to hold the positions of the queens in the solution
	 *                         board.
	 * @param validQueensFound contains a valid position found in which the queen must be placed.
	 */
	public void findByRecursion(int[] solutionArray, int validQueensFound) {
		int numOfQueens = solutionArray.length;
		
		if (validQueensFound == numOfQueens) {
			saveValidSolution(solutionArray);
		} else {
			
			for (int currentIndex = 0; currentIndex < numOfQueens; currentIndex++) {
				solutionArray[validQueensFound] = currentIndex;
				
				if (isBoardValid(solutionArray, validQueensFound)) {
					findByRecursion(solutionArray, validQueensFound + 1);
				}
			}
		}
	}
	
	/**
	 * This method is used to check all conditions of a possible solution in order to determine whether is valid or
	 * not.
	 *
	 * @param solutionArray    contains the solution array containing the positions of the queens already validated.
	 * @param validQueensFound contains the position of a new queen so it can be validated before being added to the
	 *                         array.
	 * @return a boolean type that contains the result indicating if the new queen can be safely added to the solution
	 * board.
	 */
	public boolean isBoardValid(int[] solutionArray, int validQueensFound) {
		
		for (int currentIndex = 0; currentIndex < validQueensFound; currentIndex++) {
			
			if (solutionArray[currentIndex] == solutionArray[validQueensFound]) {
				return false;   // same column
			}
			if ((solutionArray[currentIndex] - solutionArray[validQueensFound]) == (validQueensFound - currentIndex)) {
				return false;   // same major diagonal
			}
			if ((solutionArray[validQueensFound] - solutionArray[currentIndex]) == (validQueensFound - currentIndex)) {
				return false;   // same minor diagonal
			}
		}
		
		return true;
	}
	
	/**
	 * This method is used only when valid solutions have been found and after that they are stored in an array list
	 * that can be accessed later by the controller.
	 *
	 * @param solutionArray contains an array with the valid positions of the queens in a board.
	 */
	public void saveValidSolution(int[] solutionArray) {
		int[] boardResult = new int[solutionArray.length];
		
		System.arraycopy(solutionArray, 0, boardResult, 0, solutionArray.length);
		getSolutionsList().add(boardResult);
	}
}
