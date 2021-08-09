import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
    public async register({request, response}: HttpContextContract){
        try{
            const newData = await request.validate(UserValidator)
            const newUser = await User.create(newData)
            return response.created({ message: 'registered!', newUser})
        } catch(error){
            return response.unprocessableEntity({messages: error.messages})

        }
    }

    public async login({request, response, auth}: HttpContextContract){
        const UserSchema = schema.create({
            email: schema.string(),
            password: schema.string()
        })
        try {
          const email = request.input('email')
          const password = request.input('password')
           
          await request.validate({ schema: UserSchema})

          const token = await auth.use('api').attempt(email,password)

          return response.ok({messages: 'login success!', token})
          
      } catch (error) {
          if (error.guard){
            return response.badRequest({ messages: error.message})
          }else{
            return response.badRequest({ messages: error.messages})

          }
      }
    }
}
