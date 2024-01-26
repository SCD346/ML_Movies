type Axons = [number, number, number]
type Network = [Axons, Axons, Axons]

interface Movie{
    title:string,
    year:number,
    runtime:number
}

interface PredictedMovie extends Movie{
    target:number,
    prediction:number
}

const trainingData = [
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

function predictMovie(network:Network, movie:Movie) {
    const prediction = getPrediction(network, movie)
    const predictedMovie = {...movie, prediction}
    return predictedMovie
}
const predictedMovie = predictMovie(network, trainingData[0])

function predictMovies(network:Network, movies:Movie[]) {
    const predictedMovies = movies.map(movie => {
        return predictMovie(network, movie)
    })
    return predictedMovies
}

const predictedMovies = predictMovies(network, trainingData)
console.log(predictedMovies)

//Train Network
function calculateError(movie:PredictedMovie){
    const difference = movie.target - movie.prediction
    const error = Math.abs(difference)
    const finalMovie = {...movie, error}
}
const finalMovie = calculateError(predictedMovie) //Start here in next meeting

//TypeScript Generics
