import { User } from "../schema/model.js"

let authorization = (role) => {
     // let roles = ['admin', 'user', 'unLoggerUser']

     
    return async(req, res, next) => {
        try {
            let id = req._id
            // console.log(id)
            let result = await User.findById(id)
            // console.log(result)
            let tokenRole = result.role

            if(role.includes(tokenRole)) {
                next() 
            }
            else {
                res.status(403).json({
                    success : false,
                    message : "user not authorized."
                })
            }

        } catch (error) {
            res.json({
                success : false,
                message : error.message
            })
        }
    }
        

}

export default authorization