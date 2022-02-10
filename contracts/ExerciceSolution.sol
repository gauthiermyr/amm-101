pragma solidity ^0.6.0;

import "./IExerciceSolution.sol";
import "./utils/IUniswapV2Pair.sol";
import "./utils/IUniswapV2Router02.sol";
import "./utils/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ExerciceSolution is IExerciceSolution
{

	IUniswapV2Pair pair;
	IUniswapV2Router02 routeur;
	IERC20 token;
	IERC20 weth;
	IERC20 dummy;

	constructor () public {
		pair = IUniswapV2Pair(0x790b99Ca603A446baa1813f51bfA6d5FA9D96220);
		routeur = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
		token = IERC20(0x11B63b3dD9ED5Ba7511dDBfc2096DD146c3Ad8B2);
		weth = IERC20(0xc778417E063141139Fce010982780140Aa0cD5Ab);
		dummy = IERC20(0xbc3b69d1abD5A39f55a9Ba50C7a2aDd933952123);
		token.approve(address(routeur), 1000000 ether);
		dummy.approve(address(routeur), 1000000 ether);
		weth.approve(address(routeur), 1000000 ether);
		pair.approve(address(routeur), 1000000 ether);
	}

	function addLiquidity() override external
	{
		routeur.addLiquidity(address(token), address(weth), 1000 ether, 0.001 ether, 1, 1, address(this), block.timestamp + 50);
	}

	function withdrawLiquidity() override external 
	{
		routeur.removeLiquidity(address(token), address(weth), pair.balanceOf(address(this)), 1, 1, address(this), block.timestamp + 50);

	}

	function swapYourTokenForDummyToken() override external
	{
		address[] memory path = new address[](2);
		path[0] = address(token);
		path[1] = address(dummy);
		routeur.swapExactTokensForTokens(10 ether, 0.0000001 ether, path, address(this), block.timestamp + 50);
	}

	function swapYourTokenForEth() override external
	{	
		address[] memory path = new address[](2);
		path[1] = address(weth);
		path[0] = address(token);
		routeur.swapExactTokensForTokens(10 ether, 0.0000001 ether, path, address(this), block.timestamp + 50);
	}
}
