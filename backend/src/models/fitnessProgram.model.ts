import mongoose, { Document, Schema, Types, } from "mongoose";
export interface IFitnessProgram extends Document{
     _id:Types.ObjectId,
    programName:string,    
    slug :string,        

    description:string,
    isActive:boolean,
        
}

const FitnessProgramSchema=new Schema<IFitnessProgram>({
    programName:{type:String,
        required:true,
        unique:true},
    slug :{type:String,
        required:true,
        unique:true},
    
    description:{type:String},
    isActive:{type:Boolean,
        default:true}
})

export default mongoose.model('FitnessProgramModal',FitnessProgramSchema);