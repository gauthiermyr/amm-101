const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20 = artifacts.require("DummyToken.sol"); 
var evaluator = artifacts.require("Evaluator.sol");
var MyERC20 = artifacts.require("MyERC20.sol");
var Exercice = artifacts.require("ExerciceSolution.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await SwapAndProvideValidate(deployer, network, accounts); 
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await doEx(deployer, network, accounts); 
		await deployRecap(deployer, network, accounts); 
    });
};

async function SwapAndProvideValidate(deployer, network, accounts) {
	Evaluator = await evaluator.at('0x89a2Faa44066e94CE6B6D82927b0bbbb8709eEd7');
	await Evaluator.ex1_showIHaveTokens();
	await Evaluator.ex2_showIProvidedLiquidity();
}

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.at('0xc2269af51350796aF4F6D52e4736Db3A885F28D6')
	uniswapV2FactoryAddress = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"
	wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab"
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.at('0x89a2Faa44066e94CE6B6D82927b0bbbb8709eEd7')
	Solution = await Exercice.new();
	await Evaluator.submitExercice(Solution.address);
}

async function doEx(deployer, network, accounts) {
	await Evaluator.ex6a_getTickerAndSupply();
	const ticker = await Evaluator.readTicker(accounts[0]);
	const supply = await Evaluator.readSupply(accounts[0]);

	mytoken = await ERC20.new("MyToken", ticker, supply);
	await Evaluator.submitErc20(mytoken.address);
	await Evaluator.ex6b_testErc20TickerAndSupply();
	await Evaluator.ex7_tokenIsTradableOnUniswap();

	weth = await ERC20.at(wethAddress);
	await mytoken.transfer(Solution.address, web3.utils.toWei('10', 'ether'));
	
	await Evaluator.ex8_contractCanSwapVsEth();
	
	await mytoken.transfer(Solution.address, web3.utils.toWei('10', 'ether'));
	await Evaluator.ex9_contractCanSwapVsDummyToken();

	await weth.transfer(Solution.address, web3.utils.toWei('0.001', 'ether'));
	await mytoken.transfer(Solution.address, web3.utils.toWei('1000', 'ether'));
	await Evaluator.ex10_contractCanProvideLiquidity();

	await Evaluator.ex11_contractCanWithdrawLiquidity();
}


async function deployRecap(deployer, network, accounts) {
	const bal = await TDToken.balanceOf(accounts[0]);
	console.log(bal.toString());
}


