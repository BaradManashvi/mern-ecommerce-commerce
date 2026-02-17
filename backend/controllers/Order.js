const Order = require("../models/Order");

 exports.create=async(req,res)=>{
     try {
         const created=new Order(req.body)
         await created.save()
         res.status(201).json(created)
     } catch (error) {
         console.log(error);
         return res.status(500).json({message:'Error creating an order, please trying again later'})
     }
 }
// exports.create = async (req, res) => {
//   try {
//     const { paymentMode, razerpayId, items} = req.body;

//     let paymentstatus = 'Pending';

//     if (paymentMode === 'Card') {
//       // Check if Razorpay payment succeeded
//       paymentstatus = razerpayId ? 'Completed' : 'Failed';
//     }
//     // For COD, payment is always pending
//     const newOrder = new Order({
//       ...req.body,
//       paymentstatus
//     });


//       if (items && items.length > 0) {
//       for (const item of items) {
//         await Product.findByIdAndUpdate(
//           item.product._id,  // make sure frontend sends product._id
//           { $inc: { stockQuantity: -item.quantity } },
//           { new: true }
//         );
//       }
//     }

//     await newOrder.save();
//     res.status(201).json(newOrder);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Error creating order' });
//   }
// };

exports.getByUserId=async(req,res)=>{
    try {
        const {id}=req.params
        const results=await Order.find({user:id})
        res.status(200).json(results)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error fetching orders, please trying again later'})
    }
}

exports.getAll = async (req, res) => {
    try {
        let skip=0
        let limit=0

        if(req.query.page && req.query.limit){
            const pageSize=req.query.limit
            const page=req.query.page
            skip=pageSize*(page-1)
            limit=pageSize
        }

        const totalDocs=await Order.find({}).countDocuments().exec()
        const results=await Order.find({}).skip(skip).limit(limit).exec()

        res.header("X-Total-Count",totalDocs)
        res.status(200).json(results)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching orders, please try again later'})
    }
};

// exports.updateById=async(req,res)=>{
//     try {
//         const {id}=req.params
//         const updated=await Order.findByIdAndUpdate(id,req.body,{new:true})
//         res.status(200).json(updated)
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message:'Error updating order, please try again later'})
//     }
// }

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentstatus } = req.body;

    const updateData = {};
    if(status) updateData.status = status;
    if(paymentstatus) updateData.paymentstatus = paymentstatus;

    
    // Auto update paymentstatus if COD
    if (status === 'Delivered' && req.body.paymentMode === 'COD') {
      updateData.paymentstatus = 'Completed';
    } else if (status === 'Cancelled' && req.body.paymentMode === 'COD') {
      updateData.paymentstatus = 'Failed';
    }

    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });

    if(!updated) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating order' });
  }
}

