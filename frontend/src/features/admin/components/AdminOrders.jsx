// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { getAllOrdersAsync, resetOrderUpdateStatus, selectOrderUpdateStatus, selectOrders, updateOrderByIdAsync } from '../../order/OrderSlice'
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { Avatar, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
// import { useForm } from "react-hook-form"
// import { toast } from 'react-toastify';
// import {noOrdersAnimation} from '../../../assets/index'
// import Lottie from 'lottie-react'


// export const AdminOrders = () => {

//   const dispatch=useDispatch()
//   const orders=useSelector(selectOrders)
//  // const users=useSelector(selectOrders)
//   const [editIndex,setEditIndex]=useState(-1)
//   const orderUpdateStatus=useSelector(selectOrderUpdateStatus)
//   const theme=useTheme()
//   const is1620=useMediaQuery(theme.breakpoints.down(1620))
//   const is1200=useMediaQuery(theme.breakpoints.down(1200))
//   const is820=useMediaQuery(theme.breakpoints.down(820))
//   const is480=useMediaQuery(theme.breakpoints.down(480))

//   const {register,handleSubmit,formState: { errors },} = useForm()

//   useEffect(()=>{
//     dispatch(getAllOrdersAsync())
//   },[dispatch])


//   useEffect(()=>{
//     if(orderUpdateStatus==='fulfilled'){
//       toast.success("Status udpated")
//     }
//     else if(orderUpdateStatus==='rejected'){
//       toast.error("Error updating order status")
//     }
//   },[orderUpdateStatus])

//   useEffect(()=>{
//     return ()=>{
//       dispatch(resetOrderUpdateStatus())
//     }
//   },[])


//   const handleUpdateOrder=(data)=>{
//     const update={...data,_id:orders[editIndex]._id}
//     setEditIndex(-1)
//     dispatch(updateOrderByIdAsync(update))
//   }


//   const editOptions=['Pending','Dispatched','Out for delivery','Delivered','Cancelled']

//   const getStatusColor=(status)=>{
//     if(status==='Pending'){
//       return {bgcolor:'#dfc9f7',color:'#7c59a4'}
//     }
//     else if(status==='Dispatched'){
//       return {bgcolor:'#feed80',color:'#927b1e'}
//     }
//     else if(status==='Out for delivery'){
//       return {bgcolor:'#AACCFF',color:'#4793AA'}
//     }
//     else if(status==='Delivered'){
//       return {bgcolor:"#b3f5ca",color:"#548c6a"}
//     }
//     else if(status==='Cancelled'){
//       return {bgcolor:"#fac0c0",color:'#cc6d72'}
//     }
//   }


//   return (

//     <Stack justifyContent={'center'} alignItems={'center'}>

//       <Stack mt={5} mb={3} component={'form'} noValidate onSubmit={handleSubmit(handleUpdateOrder)}>

//         {
//           orders.length?
//           <TableContainer sx={{width:is1620?"95vw":"auto",overflowX:'auto'}} component={Paper} elevation={2}>
//             <Table aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Order</TableCell>
//                   <TableCell align="left">Id</TableCell>
//                   <TableCell align="left">Item</TableCell>
//                   <TableCell align="right">Total Amount</TableCell>
//                   <TableCell align="right">Shipping Address</TableCell>
//                   <TableCell align="right">Payment Method</TableCell>
//                   <TableCell align="right">Order Date</TableCell>
//                   <TableCell align="right">Status</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>

//                 {
//                 orders.length && orders.map((order,index) => (

//                   <TableRow key={order._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

//                     <TableCell component="th" scope="row">{index}</TableCell>
//                     <TableCell align="right">{order._id}</TableCell>
//                     <TableCell align="right">
//                       {
//                         order.item.map((product)=>(
//                           <Stack mt={2} flexDirection={'row'} alignItems={'center'} columnGap={2}>
//                             <Avatar src={product.product.thumbnail}></Avatar>
//                             <Typography>{product.product.title}</Typography>
//                           </Stack>
//                         ))
//                       }
//                     </TableCell>
//                     <TableCell align="right">{order.total}</TableCell>
//                     <TableCell align="right">
//                       <Stack>

//                         <Typography>Street:-{order.address[0].street}</Typography>
//                         <Typography>City:- {order.address[0].city}</Typography>
//                         <Typography>State:- {order.address[0].state}</Typography>
//                         <Typography>Contact No.:- {order.address[0].phoneNumber}</Typography>
//                         <Typography>Pincode:- {order.address[0].postalCode}</Typography>
//                       </Stack>
//                     </TableCell>
//                     <TableCell align="right">{order.paymentMode}</TableCell>
//                     <TableCell align="right">{new Date(order.createdAt).toDateString()}</TableCell>

//                     {/* order status */}
//                     <TableCell align="right">

//                         {
//                           editIndex===index?(

//                         <FormControl fullWidth>
//                           <InputLabel id="demo-simple-select-label">Update status</InputLabel>
//                           <Select
//                             defaultValue={order.status}
//                             labelId="demo-simple-select-label"
//                             id="demo-simple-select"
//                             label="Update status"
//                             {...register('status',{required:'Status is required'})}
//                             >

//                             {
//                               editOptions.map((option)=>(
//                                 <MenuItem value={option}>{option}</MenuItem>
//                               ))
//                             }
//                           </Select>
//                         </FormControl>
//                         ):<Chip label={order.status} sx={getStatusColor(order.status)}/>
//                         }

//                     </TableCell>

//                     {/* actions */}
//                     <TableCell align="right">

//                       {
//                         editIndex===index?(
//                           <Button>

//                             <IconButton type='submit'><CheckCircleOutlinedIcon/></IconButton>
//                           </Button>
//                         )
//                         :
//                         <IconButton onClick={()=>setEditIndex(index)}><EditOutlinedIcon/></IconButton>
//                       }

//                     </TableCell>

//                   </TableRow>
//                 ))}

//               </TableBody>
//             </Table>
//           </TableContainer>
//           :
//           <Stack width={is480?"auto":'30rem'} justifyContent={'center'}>

//             <Stack rowGap={'1rem'}>
//                 <Lottie animationData={noOrdersAnimation}/>
//                 <Typography textAlign={'center'} alignSelf={'center'} variant='h6' fontWeight={400}>There are no orders currently</Typography>
//             </Stack>


//           </Stack>  
//         }

//     </Stack>

//     </Stack>
//   )
// }

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersAsync, resetOrderUpdateStatus, selectOrders, selectOrderUpdateStatus, updateOrderByIdAsync } from '../../order/OrderSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, FormControl, InputLabel, MenuItem, Select, Stack, Typography, IconButton, TextField, useMediaQuery, useTheme } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { toast } from 'react-toastify';
import { noOrdersAnimation } from '../../../assets/index';
import Lottie from 'lottie-react';

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const ordersFromStore = useSelector(selectOrders);
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);

  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [rowStatus, setRowStatus] = useState({});
  const [rowPayment, setRowPayment] = useState({});
  const [search, setSearch] = useState('');

  const theme = useTheme();
  const is1620 = useMediaQuery(theme.breakpoints.down(1620));

  useEffect(() => { dispatch(getAllOrdersAsync()); }, [dispatch]);

  useEffect(() => {
    if (orderUpdateStatus === 'fulfilled') toast.success("Order updated successfully");
    else if (orderUpdateStatus === 'rejected') toast.error("Error updating order");
  }, [orderUpdateStatus]);

  useEffect(() => { return () => dispatch(resetOrderUpdateStatus()); }, [dispatch]);

  useEffect(() => {
    // Sort latest orders first
    const sorted = [...ordersFromStore].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(sorted);
  }, [ordersFromStore]);

  const handleChangeStatus = (id, value) => setRowStatus(prev => ({ ...prev, [id]: value }));
  const handleChangePayment = (id, value) => setRowPayment(prev => ({ ...prev, [id]: value }));

  const handleUpdateRow = (order) => {
    const updatedStatus = rowStatus[order._id] || order.status;
    let updatedpaymentstatus = rowPayment[order._id] || order.paymentstatus;

    // Payment logic
    if (updatedStatus === 'Delivered') updatedpaymentstatus = 'Completed';
    else if (order.paymentMode === 'COD') updatedpaymentstatus = 'Pending';
    else if (order.paymentMode === 'Card') updatedpaymentstatus = order.razerpayId ? 'Completed' : 'Failed';

    // Dispatch update
    dispatch(updateOrderByIdAsync({
      _id: order._id,
      status: updatedStatus,
      paymentstatus: updatedpaymentstatus,
      paymentMode: order.paymentMode
    }));

    setEditIndex(-1);
  };

  const getStatusColor = status => ({
    Pending: { bgcolor: '#dfc9f7', color: '#7c59a4' },
    Dispatched: { bgcolor: '#feed80', color: '#927b1e' },
    'Out for delivery': { bgcolor: '#AACCFF', color: '#4793AA' },
    Delivered: { bgcolor: "#b3f5ca", color: "#548c6a" },
    Cancelled: { bgcolor: "#fac0c0", color: '#cc6d72' }
  }[status] || {});

  const getPaymentColor = status => ({
    Completed: { bgcolor: '#b3f5ca', color: '#548c6a' },
    Pending: { bgcolor: '#dfc9f7', color: '#7c59a4' },
    Failed: { bgcolor: '#fac0c0', color: '#cc6d72' }
  }[status] || {});

  // Filter orders by ID or user's phone number
  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(search.toLowerCase()) ||
    order.address[0].phoneNumber.includes(search)
  );

  return (
    <Stack justifyContent="center" alignItems="center" p={2}>
      <Stack mt={5} mb={3} width={is1620 ? '95vw' : 'auto'} spacing={2}>
        <TextField
          label="Search by Order ID or Phone Number"
          variant="outlined"
          size="small"
          fullWidth={is1620}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {filteredOrders.length ? (
          <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>#</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Shipping Address</TableCell>
                  <TableCell align="center">Payment Mode</TableCell>
                  <TableCell align="center">Order Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Payment Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order, index) => (
                  <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        {order.item.map(p => (
                          <Stack key={p.product._id} direction="row" alignItems="center" spacing={1}>
                            <Avatar src={p.product.thumbnail} variant="rounded" />
                            <Typography fontSize=".95rem">{p.product.title}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">&#8377;{order.total}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography>{order.address[0].street}</Typography>
                        <Typography>{order.address[0].city}, {order.address[0].state}</Typography>
                        <Typography>Phone: {order.address[0].phoneNumber}</Typography>
                        <Typography>ZIP: {order.address[0].postalCode}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">{order.paymentMode}</TableCell>
                    <TableCell align="center">{new Date(order.createdAt).toLocaleDateString()}</TableCell>

                    <TableCell align="center">
                      {editIndex === index ? (
                        <FormControl fullWidth size="small">
                          <InputLabel>Order Status</InputLabel>
                          <Select value={rowStatus[order._id] || order.status} onChange={e => handleChangeStatus(order._id, e.target.value)}>
                            {['Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled'].map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip label={order.status} sx={getStatusColor(order.status)} />
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {editIndex === index ? (
                        <FormControl fullWidth size="small">
                          <InputLabel>Payment Status</InputLabel>
                          <Select
                            value={rowPayment[order._id] || order.paymentstatus}
                            onChange={e => handleChangePayment(order._id, e.target.value)}
                          >
                            {/* Admin can choose any payment status manually */}
                            {['Pending', 'Completed', 'Failed'].map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                      ) : (
                        <Chip label={order.paymentstatus} sx={getPaymentColor(order.paymentstatus)} />
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {editIndex === index ? (
                        <IconButton onClick={() => handleUpdateRow(order)} color="success"><CheckCircleOutlinedIcon /></IconButton>
                      ) : (
                        <IconButton onClick={() => setEditIndex(index)} color="primary"><EditOutlinedIcon /></IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack justifyContent="center" alignItems="center" mt={10}>
            <Lottie animationData={noOrdersAnimation} style={{ maxWidth: 300 }} />
            <Typography variant="h6" color="text.secondary" mt={2}>No orders found</Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

