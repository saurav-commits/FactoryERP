const AppError = require("../utils/errors/app.error");
const {StatusCodes} = require("http-status-codes")
class CrudRepository{
    constructor(model){
        this.model=model;
    }

    async create(data, options = {}){
            const response = await this.model.create(data,{ transaction: options.transaction });
            return response;
    }

    async destroy(data){
            const response = await this.model.destroy({
                where: {
                    id:data
                }
            })
            if(!response){
                throw new AppError('Not resource found with ',StatusCodes.NOT_FOUND)
            }
            return response;
    }

    async get(data) {
        const response = await this.model.findByPk(data);
        return response||null;
            if(!response || response==null){
                throw new AppError('No resource found related to the corresponding details',StatusCodes.NOT_FOUND)
            }
            return response;
    }

    async getOne(data) {
        const response = await this.model.findOne(data);
        return response||null;
        if(!response || response==null) {
            throw new AppError('No resource found related to the corresponding details',StatusCodes.NOT_);
        }
        return response;
    }


    async getAll(){
            const response = await this.model.findAll()
            return response;
    }

    async update(id,data){
            const response = await this.model.update(data,{
                where:{
                    id:id
                },
            })
            if(!response){
                throw new AppError('No resource found related to the corresponding details',StatusCodes.NOT_FOUND)
            }
            return response;
    }
}

module.exports = CrudRepository;