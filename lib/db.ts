
import mongoose from 'mongoose'
const  connectionString = process.env.DB_CONNCETION_URL as string
export const connectDB = async ()=>{
    try{
        const res = await mongoose.connect(connectionString)
        console.log("DB connection Successfull");
        
    }
    catch(err){
        console.log("DB connection  Failed");
        console.log(err);
        
    }
}