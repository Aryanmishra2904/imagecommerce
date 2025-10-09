import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, props: { params: { id: string } }) {
   try {
    await connectToDatabase()
    const product=await Product.findById(props.params.id).lean()

    if(!product){
        return new Response(JSON.stringify({message:"Product not found"}),{status:404})
    }
    return new Response(JSON.stringify(product),{status:200}) 
   } catch (error) {
    console.error("Product Fetch Error",error)
    return new Response(JSON.stringify({message:"Failed to fetch product"}),{status:500})
   }
}