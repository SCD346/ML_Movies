const x = 1

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
const network = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]