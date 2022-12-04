class KeywordSimilarity{

    constructor()
    {
        this.alphabet = {
            'a': 0.03076180324539124,
            'b': 0.392321185070835,
            'c': 0.3164587727223104,
            'd': 0.42998015029940373,
            'e': 0.9914236476059985,
            'f': 0.8887869763058198,
            'g': 0.8955219698420669,
            'h': 0.534789627234677,
            'i': 0.8918208879009265,
            'j': 0.05358582267011425,
            'k': 0.4747106658342314,
            'l': 0.9974435122337739,
            'm': 0.4876967445080739,
            'n': 0.9221165176826699,
            'o': 0.9019998482030785,
            'p': 0.07656439781986712,
            'q': 0.8048141404878946,
            'r': 0.7798941005240141,
            's': 0.15186162696658112,
            't': 0.8364121332352864,
            'u': 0.5077976753623267,
            'v': 0.40254484989294936,
            'w': 0.4980714880151652,
            'x': 0.20612588917475405,
            'y': 0.9323548078712954,
            'z': 0.30629814929579857
        }
        this.englishStopWords = ['with', 'who', 'has', 'wasn', 'being', 'i', 'for', "she's", 'once', 'does', 'up', 'o', 'shouldn', 'through', 'don', "should've", 'm', "needn't", 'why', 'as', 'by', 'those', 'himself', 'in', 'ourselves', 'ain', 'then', 'you', "it's", 'theirs', "you're", 'herself', 'to', 'won', 'off', 'is', 'doesn', 'my', 'no', 'but', 'are', 'was', 'will', "wouldn't", 'when', "wasn't", 'whom', 'now', 'be', 'of', 'me', 'didn', 'nor', 'they', 'isn', 'other', 'themselves', 'been', 'itself', 'your', 'having', "aren't", "hasn't", 'couldn', 'until', 't', 'its', 'some', 'all', 'before', 'during', "you'll", "won't", 'did', "you've", 're', 'against', 'such', 'aren', 'only', 'yours', 'after', 'than', 'both', 'haven', 'which', 'again', 'about', 'ma', 'or', 'too', 's', 'a', 'mustn', "isn't", 'him', 'their', 'am', 'few', 'at', 'our', 'below', 'any', 'most', "shan't", 'out', 'mightn', 'hadn', 'y', 'an', 'same', "mightn't", "shouldn't", "couldn't", 'so', 'down', 'd', 'over', "don't", 'more', "that'll", 'yourselves', 'have', 'just', 'each', 'were', 'because', 'can', "didn't", 'these', 'between', 'he', 'how', 'should', 'that', 'further', 'her', 'here', 'she', 'shan', 'where', 'this', 'own', 'ours', "hadn't", 'it', 'his', 'if', 'doing', "mustn't", 'had', 'them', "haven't", 'what', 'myself', 'into', 'from', 'hers', 'wouldn', 'yourself', 'the', 'under', "doesn't", 'not', 'do', 've', 'hasn', 'we', 'and', 'on', 'while', 'there', 'very', 'll', "weren't", "you'd", 'weren', 'above', 'needn']
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

    removeStopWordsFromInputData(targetWord)
    {
        let splittedInput = targetWord.split(' ')
        let CleanInput = []
        for(let item of splittedInput)
        {  
            if( this.englishStopWords.includes(item) == false)
            {
                CleanInput.push(item)
            }
        }

        return CleanInput.join(" ")
    }

    l2norm(vectorOne)
    {
        let l2normProduct = 0
        for(let i = 0; i < vectorOne.length; i++)
        {
            l2normProduct += Math.pow(vectorOne[i],2)
        }
        return l2normProduct
    }

    getCosineSimilarity(wordVectorOne, wordVectorTwo)
    {
        let dotProduct = this.dot(wordVectorOne, wordVectorTwo)
        let l2norm_vectorOne = this.l2norm(wordVectorOne)
        let l2norm_vectorTwo = this.l2norm(wordVectorTwo)

        let cosineSimilarity = dotProduct / (Math.sqrt(l2norm_vectorOne) / Math.sqrt(l2norm_vectorTwo))
        return cosineSimilarity
    }
}

model = new KeywordSimilarity()
let VectorizedWords = model.turnWordsToFeatureVectors('test', 'cats')

let similarity = model.getCosineSimilarity(VectorizedWords[0], VectorizedWords[1])

console.log(similarity)

