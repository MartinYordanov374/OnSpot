const usernameRegex = /^[A-Za-z0-9]{3,256}$/
const passwordUppercaseRegex = /[A-Z]/
const passwordNumbersRegex = /(?<numbers>\d{2,256})/
const passwordCharacterRegex = /(?<=[\.\?\!]).|(?=[\.\?\!])./

let validatePassword = (password) => {
    if(password.length <= 3)
    {
      return {status: false, msg:'Registration failed. The password should be at least 4 characters.'}
    }
    else
    {
        if(passwordUppercaseRegex.test(password) != true)
        {
            return {status: false, msg:'The password should include at least one upper-case character!'}
        }
        if(passwordNumbersRegex.test(password) != true)
        {
            return {status: false, msg:'The password should include at least 2 digits!'}
        }
        if(passwordCharacterRegex.test(password) != true)
        {
            return {status: false, msg:'The password should include at least 1 special character!'}
        }
    }

    if(passwordUppercaseRegex.test(password) && passwordNumbersRegex.test(password) && passwordCharacterRegex.test(password))
    {
        return {status: true, msg: 'The password is successfully validated.'};
    }
}

let validateUsername = (username) => {
    if(usernameRegex.test(username))
    {
        return {status: true, msg: 'The username is successfully validated.'}
    }
    else
    {
        return {status: false, msg: 'The username should be at least 3 characters. It is recommended that it include digits as well.'}
    }
}

module.exports = {
    validatePassword,
    validateUsername
}