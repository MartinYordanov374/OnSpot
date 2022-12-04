class KeywordSimilarity{

    constructor()
    {
        this.alphabet = {
            'a': 0,
            'b': 1,
            'c': 2,
            'd': 3,
            'e': 4,
            'f': 5,
            'g': 6,
            'h': 7,
            'i': 8,
            'j': 9,
            'k': 10,
            'l': 11,
            'm': 12,
            'n': 13,
            'o': 14,
            'p': 15,
            'q': 16,
            'r': 17,
            's': 18,
            't': 19,
            'u': 20,
            'v': 21,
            'w': 22,
            'x': 23,
            'y': 24,
            'z': 25
        }
        this.targetVectorizedWord = [];
        this.vectorizedKeyword = []
    }

    turnWordsToFeatureVectors(targetWord, keyword)
    {
        let splittedTargetWord = targetWord.split('')
        let splittedKeyword = keyword.split('')
        for(let item of splittedTargetWord)
        {
            this.targetVectorizedWord.push(this.alphabet[item])
        }

        for(let item of splittedKeyword)
        {
            this.vectorizedKeyword.push(this.alphabet[item])
        }
        return [this.targetVectorizedWord, this.vectorizedKeyword]
    }

    dot(vectorOne, vectorTwo)
    {
        let dotProduct = 0
        for(let i = 0; i < vectorOne.length; i++)
        {
            dotProduct += vectorOne[i] * vectorTwo[i]
        }
        return dotProduct
    }

    getCosineSimilarity(wordVectorOne, wordVectorTwo)
    {
        let dotProduct = this.dot(wordVectorOne, wordVectorTwo)
        console.log(dotProduct)
    }
}

model = new KeywordSimilarity()
let VectorizedWords = model.turnWordsToFeatureVectors('test', 'cats')

model.getCosineSimilarity(VectorizedWords[0], VectorizedWords[1])