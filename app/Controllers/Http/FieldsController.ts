import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateFieldValidator from 'App/Validators/CreateFieldValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import Field from 'App/Models/Field'

export default class FieldsController {
    public async index({response}: HttpContextContract){
        // let fields = await Database
        // .from('fields')
        // .join('fields', 'fields.field_id', '=', 'fields.id')
        // .select('fields.id','fields.name','type','field_id', 'fields.name as field')

        let field = await Field.all()
        response.status(200).json({messages: "Success!", data: field})
    }

    public async store({request, response, params}: HttpContextContract){
        try {
            await request.validate( CreateFieldValidator )
            // let newFieldId = await Database.table('fields').returning('id').insert({
            //     name: request.input('name'),
            //     type: request.input('type'),
            //     field_id: params.field_id
            // })
            // response.created({message: `New Fields added to field!`, newFieldId})

            let newField = new Field()
            newField.name = request.input('name'),
            newField.type = request.input('type'),
            newField.venue_id = params.id
            response.created({message: `New Fields added to field!`, newField})
            
        } catch (error) {
            response.badRequest(error.messages)
            
        }
    }

    public async show({params, response}: HttpContextContract){
        let field = await Database
        .from('fields')
        .join('fields', 'fields.field_id', '=', 'fields.id')
        .where('fields.id',params.id)
        .select('fields.id','fields.name','type','field_id', 'fields.name as field')
        .firstOrFail()
        return response.ok({message: 'success', data:field})
    }

    public async update({params, response, request} : HttpContextContract){
        // await Database.from('fields').where('id', params.id).update({
        //     name: request.input('name'),
        //     type: request.input('type'),
        //     field_id: request.input('field_id')
        // })
        // return response.ok({messages: 'berhasil update!'})

        let field = await Field.findOrFail(params.id)
        field.name = request.input('name'),
        field.type = request.input('phone'),
        field.venue_id = params.id

        field.save()
        return response.ok({messages: 'berhasil update!', field})
    }

    public async destroy({params, response} : HttpContextContract){
        // await Database.from('fields').where('id',params.id).delete()
        let field = await Field.findOrFail(params.id)
        await field.delete()
        return response.ok({messages: 'berhasil delete!'})
    }

}
