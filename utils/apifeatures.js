class ApiFeatures{
    constructor(query,queryStr){
           this.query= query,
           this.queryStr=queryStr
    }

    //search feature

    search(){
        const keyword =this.queryStr.keyword
        ?
        {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }:{}

        this.query = this.query.find({...keyword})
        return this
    }

    //filter feature based on pricing and reviews

    fliter(){
        const queryCopy = {...this.queryStr}
        //filter for category
        const removeFields = ["keyword"]
        removeFields.forEach((key)=>delete queryCopy[key])

        //filter for price
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))
        console.log(queryStr);
        return this
    }
}

export default ApiFeatures