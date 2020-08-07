package com.project.nqueens.controller;

import com.project.nqueens.service.NQueensService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Controller - contains the necessary functionality to respond to requests made by the client and serves the
 * corresponding HTML pages according to a specific route.
 */
@Controller
public class NQueensController {
	
	final private NQueensService nQueensService;
	
	public NQueensController(NQueensService nQueensService) {
		this.nQueensService = nQueensService;
	}
	
	
	@GetMapping("/")
	public String homePage() {
		return "home";
	}
	
	@GetMapping("/chessboard")
	public String chessBoardPage(Model model) {
		int maxNumberOfQueens = 11;
		
		model.addAttribute("maxNumberOfQueens", maxNumberOfQueens);
		
		return "chessboard";
	}
	
	@GetMapping("/theory")
	public String theoryPage() {
		
		return "theory";
	}
	
	@GetMapping("/about")
	public String aboutPage() {
		
		return "about";
	}
	
	@ResponseBody
	@GetMapping("/get-all-solutions")
	public List<int[]> obtainAllSolutions(@RequestParam(name = "numOfQueens") Integer numOfQueens) {
		if (numOfQueens > 11) numOfQueens = 11;
		
		nQueensService.backtrackingApproach(numOfQueens);
		
		return nQueensService.backtrackingApproach(numOfQueens);
	}
}