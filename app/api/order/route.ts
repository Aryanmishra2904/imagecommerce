import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import Order from "@/models/Order"
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import Razorpay from "razorpay"


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,  
    key_secret: process.env.RAZORPAY_KEY_SECRET! 
})

export async function POST(request:Request){
    try {
       const session = await getServerSession(authOptions)
         if(!session){
            return NextResponse.json({error:"Unauthorized"},{status:401})
         }

         const {productId,variantId,quantity} = await request.json()
         if(!productId||!variantId||!quantity){
            return NextResponse.json({error:"All fields are required"},{status:400})
         }
         await connectToDatabase()

         //create order in razorpay

         const order= await razorpay.orders.create({
            amount:Math.round(100*variantId.price), //in paise
            currency:"INR",
            receipt:`recept-${Date.now()}`,
            notes:{
                productId:productId.toString(),
                variantId:variantId.toString(),
                quantity:quantity.toString(),
                userId:session.user?.id!
            }
         })

         const newOrder =await Order.create({
            userId:session.user?.id!,
            productId,
            variantId,
            razorpayOrderId:order.id,
            amount:Math.round(100*variantId.price),
            status:"pending",
         })

         return NextResponse.json({
            orderId:order.id,
            amount:order.amount,
            currency:order.currency,
            dbOrderId:newOrder._id  
         })


        
    } catch (error) {
       return NextResponse.json({error:"Failed to create order"},{status:500}) 
    }
}