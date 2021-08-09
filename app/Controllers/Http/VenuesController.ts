import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import Venue from 'App/Models/Venue'

export default class VenuesController {
    public async index({response, request, auth}: HttpContextContract){
        // query builder
        // let venues = await Database.from('venues').select('id','name','phone','address')

        //ORM
        const user = auth.user?.id
        if(request.qs().name){
            let name = request.qs().name
            let VenueFiltered = await Venue.findBy("name", name)
            response.status(200).json({messages: "Success!", data: VenueFiltered, user})
        }
        let venue = await Venue.all()
        response.status(200).json({messages: "Success!", data: venue, user})


    }

    public async store({request, response}: HttpContextContract){
        try {

            //Query builder
            await request.validate( CreateVenueValidator )
            // let newVenueId = await Database.table('venues').returning('id').insert({
            //     name: request.input('name'),
            //     phone: request.input('phone'),
            //     address: request.input('address')
            // })
            // response.created({message: 'New Venue added!', newVenueId})

            //Model ORM
            let newVenue = new Venue()
            newVenue.name = request.input('name'),
            newVenue.phone = request.input('phone'),
            newVenue.address = request.input('address')

            await newVenue.save()
            response.created({message: 'New Venue added!', newVenue})
            
        } catch (error) {
            response.badRequest(error.messages)
            
        }
    }

    public async show({params, response}: HttpContextContract){
        // let venue = await Database.from('venues').where('id',params.id).select('*').firstOrFail()

        let venue = await Venue.find(params.id)
        return response.ok({message: 'success', data:venue})
    }

    public async update({params, response, request} : HttpContextContract){
        // await Database.from('venues').where('id', params.id).update({
        //     name: request.input('name'),
        //     phone: request.input('phone'),
        //     address: request.input('address')
        // })
        // return response.ok({messages: 'berhasil update!'})

        let venue = await Venue.findOrFail(params.id)
        venue.name = request.input('name'),
        venue.phone = request.input('phone'),
        venue.address = request.input('address')

        venue.save()
        return response.ok({messages: 'berhasil update!', venue})
        
    }

    public async destroy({params, response} : HttpContextContract){
        // await Database.from('venues').where('id',params.id).delete()

        let venue = await Venue.findOrFail(params.id)
        await venue.delete()
        return response.ok({messages: 'berhasil delete!'})
    }

}
