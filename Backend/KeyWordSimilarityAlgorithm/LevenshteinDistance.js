function findDistance(userWord, keyword)
{
    const matrix = []
    for(let i = 0; i <= userWord.length; i++)
    {
        const row = []
        for(let j = 0; j <= keyword.length; j++)
        {
            row.push(j)
        }
        row[0] = i
        matrix.push(row)
    }

    for(let i = 1; i <= userWord.length; i++)
    {
        for(let j = 1; j <= keyword.length; j++)
        {
            if(userWord[i - 1] == keyword[j - 1])
            {
                matrix[i][j] = matrix[i-1][j-1]
            }
            else
            {
                matrix[i][j] = 1 + Math.min(matrix[i-1][j-1], matrix[i][j-1], matrix[i-1][j])
            }
        }
    }
    return matrix[userWord.length - 1][keyword.length - 1]
}
