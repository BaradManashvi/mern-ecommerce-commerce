// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsAsync, selectProducts } from '../features/products/ProductSlice';
import { ProductCard } from '../features/products/components/ProductCard';
import { ProductBanner } from '../features/products/components/ProductBanner';
import { banner1, banner2, banner3, banner4 } from '../assets';
import { Stack, Grid, Typography, Button, Box } from '@mui/material';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems } from '../features/wishlist/WishlistSlice';
import { selectLoggedInUser } from '../features/auth/AuthSlice';
import { toast } from 'react-toastify';

export const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector(selectProducts);
    const wishlistItems = useSelector(selectWishlistItems);
    const loggedInUser = useSelector(selectLoggedInUser);

    useEffect(() => {
        const filters = { pagination: { page: 1, limit: 50 }, user: true };
        dispatch(fetchProductsAsync(filters));
    }, [dispatch]);

    // Add/remove wishlist
    const handleAddRemoveFromWishlist = (e, productId) => {
        if (!loggedInUser) {
            toast.error("Please login to add wishlist");
            return;
        }

        if (e.target.checked) {
            const data = { user: loggedInUser?._id, product: productId };
            dispatch(createWishlistItemAsync(data));
        } else {
            const index = wishlistItems.findIndex(item => item.product._id === productId);
            if (index !== -1) {
                dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
            }
        }
    };

    return (
        <Stack spacing={6} px={{ xs: 2, sm: 4, md: 8 }} py={4}>
            {/* Banner */}
            <Box mb={6}>
                <ProductBanner images={[banner1, banner3, banner2, banner4]} />
            </Box>

            {/* Latest Products */}
            <Stack spacing={3} mt={6} paddingRight={3} >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" fontWeight="bold">
                        Latest Products
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/productList')}
                    >
                        View All Products
                    </Button>
                </Stack>

                <Grid container spacing={3}>
                    {products.map(product => (
                        <Grid item xs={6} sm={4} md={3} key={product._id}>
                            <ProductCard
                                id={product._id}
                                title={product.title}
                                thumbnail={product.thumbnail}
                                brand={product.brand?.name}
                                price={product.price}
                                handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Stack>
    );
};




// // src/pages/HomePage.jsx
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { fetchProductsAsync, selectProducts } from '../features/products/ProductSlice';
// import { ProductCard } from '../features/products/components/ProductCard';
// import { ProductBanner } from '../features/products/components/ProductBanner';
// import { banner1, banner2, banner3, banner4 } from '../assets';
// import { Stack, Grid, Typography, Button, Box, IconButton } from '@mui/material';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems } from '../features/wishlist/WishlistSlice';
// import { selectLoggedInUser } from '../features/auth/AuthSlice';
// import { addToCartAsync, selectCartItems } from '../features/cart/CartSlice';
// import { toast } from 'react-toastify';

// export const HomePage = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const products = useSelector(selectProducts);
//     const wishlistItems = useSelector(selectWishlistItems);
//     const cartItems = useSelector(selectCartItems);
//     const loggedInUser = useSelector(selectLoggedInUser);

//     useEffect(() => {
//         const filters = { pagination: { page: 1, limit: 8 }, user: true };
//         dispatch(fetchProductsAsync(filters));
//     }, [dispatch]);

//     const handleAddRemoveFromWishlist = (e, productId) => {
//         if (!loggedInUser) {
//             toast.error("Please login to add wishlist");
//             return;
//         }
//         if (e.target.checked) {
//             const data = { user: loggedInUser?._id, product: productId };
//             dispatch(createWishlistItemAsync(data));
//         } else {
//             const index = wishlistItems.findIndex(item => item.product._id === productId);
//             if (index !== -1) {
//                 dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
//             }
//         }
//     };

//     const handleAddToCart = (productId) => {
//         if (!loggedInUser) {
//             toast.error("Please login to add to cart");
//             return;
//         }
//         const isInCart = cartItems.some(item => item.product._id === productId);
//         if (!isInCart) {
//             dispatch(addToCartAsync({ productId, quantity: 1 }));
//             toast.success("Product added to cart");
//         } else {
//             toast.info("Product already in cart");
//         }
//     };

//     return (
//         <Stack spacing={6} px={{ xs: 2, sm: 4, md: 8 }} py={4}>
//             {/* Banner */}
//             <Box mb={6}>
//                 <ProductBanner images={[banner1, banner3, banner2, banner4]} />
//             </Box>

//             {/* Latest Products */}
//             <Stack spacing={3}>
//                 <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//                     <Typography variant="h4" fontWeight="bold">
//                         Latest Products
//                     </Typography>
//                     <Button 
//                         variant="contained" 
//                         color="primary"
//                         onClick={() => navigate('/productList')}
//                     >
//                         View All Products
//                     </Button>
//                 </Stack>

//                 <Grid container spacing={3}>
//                     {products.map(product => {
//                         const isInWishlist = wishlistItems.some(item => item.product._id === product._id);
//                         const isInCart = cartItems.some(item => item.product._id === product._id);

//                         return (
//                             <Grid item xs={12} sm={6} md={3} key={product._id}>
//                                 <Box
//                                     sx={{
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         height: '100%',
//                                         backgroundColor: 'white',
//                                         borderRadius: 3,
//                                         overflow: 'hidden',
//                                         boxShadow: 2,
//                                         transition: 'transform 0.3s, boxShadow 0.3s',
//                                         '&:hover': {
//                                             transform: 'translateY(-5px)',
//                                             boxShadow: 6,
//                                         },
//                                     }}
//                                 >
//                                     {/* Product Image */}
//                                     <Box
//                                         component="img"
//                                         src={product.thumbnail}
//                                         alt={product.title}
//                                         sx={{
//                                             width: '100%',
//                                             height: 200,
//                                             objectFit: 'cover',
//                                         }}
//                                     />

//                                     {/* Product Details */}
//                                     <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                                         <Box>
//                                             <Typography variant="subtitle2" color="text.secondary" noWrap>
//                                                 {product.brand?.name}
//                                             </Typography>
//                                             <Typography
//                                                 variant="h6"
//                                                 fontWeight="bold"
//                                                 mt={0.5}
//                                                 sx={{
//                                                     whiteSpace: 'nowrap',
//                                                     overflow: 'hidden',
//                                                     textOverflow: 'ellipsis',
//                                                 }}
//                                             >
//                                                 {product.title}
//                                             </Typography>
//                                         </Box>

//                                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
//                                             <Typography variant="h6" color="primary">
//                                                 ${product.price}
//                                             </Typography>

//                                             <IconButton
//                                                 onClick={(e) => handleAddRemoveFromWishlist(e, product._id)}
//                                                 color={isInWishlist ? 'error' : 'default'}
//                                                 size="small"
//                                             >
//                                                 {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
//                                             </IconButton>
//                                         </Box>

//                                         {/* Add to Cart Button */}
//                                         <Button
//                                             variant="contained"
//                                             sx={{ mt: 2, backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
//                                             fullWidth
//                                             onClick={() => handleAddToCart(product._id)}
//                                             disabled={isInCart}
//                                         >
//                                             {isInCart ? 'In Cart' : 'Add to Cart'}
//                                         </Button>
//                                     </Box>
//                                 </Box>
//                             </Grid>
//                         );
//                     })}
//                 </Grid>
//             </Stack>
//         </Stack>
//     );
// };
