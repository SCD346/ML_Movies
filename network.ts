type Axons = [number, number, number]
type Network = [Axons, Axons, Axons]

interface Movie{
    title:string,
    year:number,
    runtime:number
}
interface TrainingMovie extends Movie {
    target: number
}
//define the relationship between a predicted movie and a normal (training data) movie
type Predicted <Unpredicted extends Movie> = Unpredicted & {prediction: number}
interface FinalizedMovie extends Predicted<TrainingMovie> {
    error:number
}

const trainingData : TrainingMovie[] = [
        {title: "Robocop",
        year: 1987,
        runtime: 102,
        target: 1
    },
    {title: "Legally Blonde",
        year: 2001,
        runtime: 94,
        target: 0
    },
    {title: "The Terminator",
        year: 1984,
        runtime: 107,
        target: 1
    },{title: "The Notebook",
        year: 2004,
        runtime: 123,
        target: 0
    },
]


// Need to compare movies on a relative scale.
    //Calculate the average year.
const totalYear = trainingData.reduce(function(acc, movie){
    return acc + movie.year
}, 0)
const avgYear = totalYear/trainingData.length


    //Calculate the average runtime.
const totalRuntime = trainingData.reduce(function(acc, movies) {
    return acc + movies.runtime
}, 0)
const avgRuntime = totalRuntime/trainingData.length

// Start building neural network.
// Indicate a good (positive/high value) or bad (negative/low value)
const network:Network = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

//Sigma Function(https://www.desmos.com/calculator/coknirwubg)
function sigma(x:number) {
    return 1/(1+Math.exp(-x))
}
// Perceptron Algo 
function perceptron(axons: Axons, a:number, b:number) {
    const weightA = axons[0]
    const weightB = axons[1]
    const bias = axons[2]
    const feelingA = a * weightA
    const feelingB = b * weightB
    const opinion = feelingA + feelingB + bias
    const prediction = sigma(opinion)

    return prediction
}

//Predict Movie
function getPrediction(network: Network, movie:Movie){
    const normalYear = movie.year - avgYear
    const normalRuntime = movie.runtime - avgRuntime
    const neuron1 = perceptron(network[0], normalYear, normalRuntime)
    const neuron2 = perceptron(network[1], normalYear, normalRuntime)
    const neuron3 = perceptron(network[2], neuron1, neuron2)
    return neuron3
}

const prediction = getPrediction(network, trainingData[0])
console.log(prediction)

function predictMovie<Unpredicted extends Movie>(network:Network, movie:Unpredicted) {
    const prediction = getPrediction(network, movie)
    const predictedMovie : Predicted<Unpredicted> = {...movie, prediction}
    return predictedMovie
}
const roboCop = trainingData[0]

const predictedMovie = predictMovie(network, roboCop)

function predictMovies(network:Network, movies:Movie[]) {
    const predictedMovies = movies.map(movie => {
        return predictMovie(network, movie)
    })
    return predictedMovies
}

const predictedMovies = predictMovies(network, trainingData)
console.log(predictedMovies)

//Train Network
function calculateError(movie:Predicted<TrainingMovie>){
    const difference = movie.target - movie.prediction
    const error = Math.abs(difference)
    const finalMovie:FinalizedMovie = {...movie, error}
    return finalMovie
}
const finalMovie = calculateError(predictedMovie) //Start here in next meeting

console.log(finalMovie)

//Calculate Loss (average error) takes in array of movies, determines how far off a prediction was based on error
function calculateLoss(movies:FinalizedMovie[]){
    const totalError = movies.reduce((totalError, movie)=>{
        return totalError + movie.error
    }, 0)
    const loss = totalError/movies.length
    return loss
}

const finalMovies = trainingData.map((movie)=>{
    const predictedMovie = predictMovie(network, movie)
    const finalMovie = calculateError(predictedMovie)
    return finalMovie
})

function finalizeMovies(network: Network, movies:TrainingMovie[]) {
    const finalMovies = trainingData.map((movie)=>{
        const predictedMovie = predictMovie(network, movie)
        const finalMovie = calculateError(predictedMovie)
        return finalMovie
    })
    return finalMovies
}

function getLoss(network: Network, movies:TrainingMovie[]) {
    const finalMovies = finalizeMovies(network, movies)
    const loss = calculateLoss(finalMovies)
    return loss
}

const loss = calculateLoss(finalMovies)
console.log(loss)

//Evolutionary Algo is NEXT
function mutate(value: number) {
    const chaos = Math.random()
    const upOrDown = chaos - 0.5

    return value + upOrDown
}

//Mutate all axons in neural network
function evolve(network: Network):Network{
    const evolved = network.map((axons)=>{ 
        const evolved0 = mutate(axons[0])
        const evolved1 = mutate(axons[1])
        const evolved2 = mutate(axons[2])
        const evolvedAxons:[number, number, number] = [evolved0, evolved1, evolved2]

        return evolvedAxons
    })
    return evolved as Network
}

function displayNumber(value:number) {
    const short = value.toFixed(5)
    return short
}

function train(network: Network) {
    let steps = 1
    while (steps < 1000) {
        const loss = getLoss(network, trainingData)
        const offspring = evolve(network)
        const offspringLoss = getLoss(offspring, trainingData)
        const improvement = loss - offspringLoss
        if(improvement > 0.0001) {
            network.forEach((axons, index) => {
                network[index] = offspring[index]
            })
            steps = 1
            const short = displayNumber(loss)
            console.log('loss:', short)
        } else steps ++
    }
    console.log('network')
    console.table(network)
    const predictions = finalizeMovies(network, trainingData)
    console.log('predictions')
    console.table(predictions)
}

train(network)

//Pass in a type as an arg/param


//TypeScript Generic

