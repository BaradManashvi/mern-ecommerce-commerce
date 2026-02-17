import {axiosi} from '../../config/axios'


export const createOrder=async(order)=>{
    try {
        const res=await axiosi.post("/orders",order)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const getOrderByUserId=async(id)=>{
    try {
        const res=await axiosi.get(`/orders/user/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const getAllOrders=async()=>{
    try {
        const res=await axiosi.get(`/orders`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

// export const updateOrderById=async(update)=>{
//     try {
//         const { _id, ...update } = orderData;
//         const res=await axiosi.patch(`/orders/${update._id}`,update)
//         return res.data
//     } catch (error) {
//         throw error.response.data
//     }
// }


export const updateOrderById = async (orderData) => {
  try {
    const { _id, ...updateFields } = orderData; // separate _id from other fields
    const res = await axiosi.patch(`/orders/${_id}`, updateFields)
    return res.data
  } catch (error) {
    throw error.response?.data || error
  }
}

