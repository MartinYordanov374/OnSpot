function calculateEuclideanDistance(vector1, vector2)
{
    let distances = []
    for(let i = 0; i < vector1.length; i++)
    {
        distances.push(    
            Math.pow( ( vector2[i] - vector1[i] ), 2 ) 
        )
    }
    return Math.sqrt(distances.reduce((v1,v2) => {return v1+v2}))
}
function createObjectFromArray(array)
{
   let trackerObject = {}
   array.forEach(elementToBeKey => {
        trackerObject[elementToBeKey.toString()] = []
   });

   return trackerObject

}

function populateTrackerObject(trackerObject, trainSampleSize, allDistancesBetweenTestData)
{
    let targetKey = 0
    let countsOfN = 0
    for(let i = 0; i < trainSampleSize + 1; i++)
        {
            if( countsOfN < trainSampleSize)
            {
                let targetObjectIndex = 
                Object.keys(trackerObject)[targetKey] 

                let classData = allDistancesBetweenTestData.splice(countsOfN, countsOfN+3)
                countsOfN += 1
                targetKey += 1
                trackerObject[targetObjectIndex.toString()] = classData
                
            }
        }
       return trackerObject
}

function getMeanDistancesOfTrackerObject(trackerObject)
{
    let newObject = {}
    for(var item in trackerObject)
    {
        let sum = 0
        for(let i = 0; i < trackerObject[item].length; i++)
        {
            sum += trackerObject[item][i]
        }
        sum = sum / trackerObject[item].length;
        newObject[item] = sum
    }
    return newObject
}

class KNearestNeighbor
{

    constructor(K_Value)
    {
        this.K_Value = K_Value
    }

    fit(trainX, trainY)
    {
        this.train_X = trainX
        this.train_Y = trainY
    }
    
    predict(X)
    {
        let allDistancesBetweenTestData = []
        for(let trainX of this.train_X)
        {
            for(let inputX of X)
            {
                allDistancesBetweenTestData.push(calculateEuclideanDistance(inputX,trainX))
            }
        }
        
        let trackerObject = createObjectFromArray(this.train_Y)

        let populatedTrackerObject = populateTrackerObject(trackerObject, this.train_Y.length, allDistancesBetweenTestData)
        
        let summedDistancesTrackerObject = getMeanDistancesOfTrackerObject(populatedTrackerObject, this.train_Y.length)
        let sortedDistances = Object.keys(summedDistancesTrackerObject).sort((a,b) => {return summedDistancesTrackerObject[a] - summedDistancesTrackerObject[b]})
        sortedDistances = sortedDistances.splice(0,this.K_Value)
        
        return sortedDistances
    
    }

}

module.exports = { KNearestNeighbor }