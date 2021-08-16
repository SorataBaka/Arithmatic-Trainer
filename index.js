const prompt = require('prompt-sync')({sigint: true});
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv')

const arithmaticTrainer = async() => {
  var correctAnswers = []
  var wrongAnswers = []
  
  var amount;
  var leftSideMax;
  var rightSideMax;
  var addition;
  var subtraction;
  var multiplication;
  const initialization = async() => {
    const amountFunc = () => {
      amount = prompt('Please provide the amount of equations you want to solve: ')
      console.clear()
      if(!amount || amount < 0){
        console.log("Invalid argument!")
        return amountFunc()
      }
      return leftSideMaxFunc()
    }
    const leftSideMaxFunc = () => {
      leftSideMax = prompt("Please provide the max value of the left side of the equation: ")
      console.clear()
      if(!leftSideMax || leftSideMax < 0){
        console.log("Invalid argument!")
        return leftSideMaxFunc()
      }
      return rightSideMaxFunc()
    }
    const rightSideMaxFunc = () => {
      rightSideMax = prompt("Please provide the max value of the right side of the equation: ")
      console.clear()
      if(!rightSideMax || rightSideMax < 0){
        console.log("Invalid argument!")
        return rightSideMaxFunc()
      }
      return additionFunc()
    }
    const additionFunc = () => {
      addition = prompt("Do you want to add addition to the equation? [y / n] ")
      console.clear()
      if(!addition){
        console.log("Invalid argument!")
        return additionFunc()
      }
      return subtractionFunc()
    }
    const subtractionFunc = () => {
      subtraction = prompt("Do you want to add subtraction to the equation? [y / n] ")
      console.clear()
      if(!subtraction){
        console.log("Invalid argument!")
        return subtractionFunc()
      }
      return multiplicationFunc()
    }
    const multiplicationFunc = () => {
      multiplication = prompt("Do you want to add multiplication to the equation? [y / n] ")
      console.clear()
      if(!multiplication){
        console.log("Invalid argument!")
        return multiplicationFunc()
      }
      return readyFunc()
    }
    const readyFunc = () => {
      ready = prompt("Are you ready to start? Press any key to proceed!")
      generateEquation()
    }
    amountFunc()
  }
  
  const generateEquation = async() => {
    var methodArray = [];  
    if(addition.toLowerCase() == "y"){
      methodArray.push("+")
    }
    if(subtraction.toLowerCase() == "y"){
      methodArray.push("-")
    }
    if(multiplication.toLowerCase() == "y"){
      methodArray.push("x")
    }
    const leftNumber = Math.floor(Math.random() * leftSideMax)
    const rightNumber = Math.floor(Math.random() * rightSideMax)
    const method = methodArray[Math.floor(Math.random() * methodArray.length)]
    const string = `${leftNumber} ${method} ${rightNumber} = `
    var correctAnswer;
    if(method == "+"){
      correctAnswer = leftNumber + rightNumber
    }
    if(method == "-"){
      correctAnswer = leftNumber - rightNumber
    }
    if(method == "x"){
      correctAnswer = leftNumber * rightNumber
    }
  
    const answer = prompt(string)
    if(answer == correctAnswer){
      correctAnswers.push({equation: string+correctAnswer, yourAnswer: answer})
    }else{
      wrongAnswers.push({equation: string+correctAnswer, yourAnswer: answer})
    }
    console.clear()
    if(correctAnswers.length + wrongAnswers.length == amount){
      const fileName = Math.floor(Date.now()/1000)
      const JSONOutput = [correctAnswers, wrongAnswers]
      fs.writeFileSync(`./History/${fileName}.JSON`, JSON.stringify(JSONOutput))
      return console.log(`Congrats! You have finished ${amount} questions with ${correctAnswers.length} correct and ${wrongAnswers.length} wrong answers.`)
    }else{
      generateEquation()
  
    }
  }
  initialization()
}

const equationGenerator = async() => {
  //Fill this with the amount of problems needed, the max number for the left side of the field and the right side of the field
  var totalAmount = prompt("Please enter the amount of equation you want : ")
  console.clear()
  var maxNumber1 = prompt("Please provide the max value of the left side of the equation: ")
  console.clear()
  var maxNumber2 = prompt("Please provide the max value of the right side of the equation: ")
  console.clear()

  //Change the states to true if you want the methods to be included in the problems
  var addition = true
  var subtraction = false
  var multiplication = false
  var distribution = false

  var methodArray = [];

  if(addition == true){
    methodArray.push(" + ")
  }
  if(subtraction == true){
    methodArray.push(" - ")
  }
  if(multiplication == true){
    methodArray.push(" X ")
  }
  if(distribution == true){
    methodArray.push(" : ")
  }

  const generationFunction = async() => {
    //Generates a random number for the left and right side of the field and prints out a string
    const randomNumber1 = Math.floor(Math.random() * maxNumber1)
    const randomNumber2 = Math.floor(Math.random() * maxNumber2)
    const method = methodArray[Math.floor(Math.random() * methodArray.length)]

    const addition = `${randomNumber1} ${method} ${randomNumber2} = |....|`
    return addition
  }
  const mainFunction = async() => {
    //Problems equal to the amount of numbers in totalAmount
    var problemList = []
    for(i = 1; i < totalAmount+1; i++){
      const Problem = await generationFunction()
      const Number = i
      problemList.push({Number , Problem})
    }
    
    return problemList
  }

  const printFunction = async() => {
    //Prints out a JSON data.
    const problemArray = await mainFunction()
    const csv = new ObjectsToCsv(problemArray)
    await csv.toDisk("./EquationOutput/output.csv")
    fs.writeFileSync("./EquationOutput/output.json", JSON.stringify(problemArray))
    return console.log("Successfully written new file")
  }

  printFunction()
}
const selectionFunc = async() => {
  console.clear()
  const selection = prompt("Which function do you want to use?  [1] Arithmatic Trainer  [2] Equation Generator : ")
  if(selection == 1){
    return arithmaticTrainer()
  }else if(selection == 2){
    return equationGenerator()
  }else{
    console.clear()
    console.log("Invalid Argument! Try again.")
    return selectionFunc()
  }
}
selectionFunc()
