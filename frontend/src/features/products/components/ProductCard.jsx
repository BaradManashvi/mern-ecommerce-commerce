import { FormHelperText, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion';

export const ProductCard = ({ 
    id, 
    title, 
    price, 
    thumbnail, 
    brand, 
    discountPercentage, 
    rating, 
    stockQuantity, 
    handleAddRemoveFromWishlist, 
    isWishlistCard, 
    isAdminCard 
}) => {

    const navigate = useNavigate();
    const wishlistItems = useSelector(selectWishlistItems);
    const loggedInUser = useSelector(selectLoggedInUser);
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch();

    const theme = useTheme();
    const is408 = useMediaQuery(theme.breakpoints.down(408));

    const isWishlisted = wishlistItems.some((item) => item.product._id === id);
    const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        const data = { user: loggedInUser?._id, product: id };
        dispatch(addToCartAsync(data));
    };

    return (
        <>
            <Stack
                component={isAdminCard ? "" : isWishlistCard ? "" : Paper}
                mt={is408 ? 2 : 0}
                elevation={1}
                p={2}
                width="100%"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/product-details/${id}`)}
            >

                {/* ⭐ NEW MODERN AMAZON STYLE IMAGE SECTION */}
                <Stack
                    width="100%"
                    height="180px"
                    borderRadius="10px"
                    overflow="hidden"
                    bgcolor="#ffffff"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        "@media (max-width: 900px)": { height: "160px" },
                        "@media (max-width: 600px)": { height: "140px" },
                        "@media (max-width: 400px)": { height: "120px" }
                    }}
                >
                    <img
                        src={thumbnail}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            backgroundColor: "#fff",
                            padding: "5px"
                        }}
                    />
                </Stack>

                {/* ⭐ LOWER SECTION (FULL OLD FUNCTIONALITY RESTORED) */}
                <Stack spacing={1} mt={1}>

                    {/* Title + Wishlist Button */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontSize="14px" fontWeight={600} noWrap>
                            {title}
                        </Typography>

                        {!isAdminCard && (
                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 1 }}>
                                <Checkbox
                                    onClick={(e) => e.stopPropagation()}
                                    checked={isWishlisted}
                                    onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                                    icon={<FavoriteBorder />}
                                    checkedIcon={<Favorite sx={{ color: 'red' }} />}
                                />
                            </motion.div>
                        )}
                    </Stack>

                    {/* Brand */}
                    <Typography fontSize="12px" color="#6b6b6b">
                        {brand}
                    </Typography>

                    {/* Rating */}
                    {rating && (
                        <Typography fontSize="12px" color="#ff9800">
                            ⭐ {rating.toFixed(1)} / 5
                        </Typography>
                    )}

                    {/* Price Section */}
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Typography
                            fontSize="11px"
                            bgcolor="#ff3552"
                            color="#fff"
                            px={0.6}
                            borderRadius="4px"
                        >
                            {discountPercentage}% OFF
                        </Typography>

                        <Typography fontSize="16px" fontWeight="700">
                            ₹{price}
                        </Typography>

                        <Typography
                            fontSize="12px"
                            color="#777"
                            sx={{ textDecoration: "line-through" }}
                        >
                            ₹{Math.round(price * 1.8)}
                        </Typography>
                    </Stack>

                    {/* Add to Cart Button */}
                    {!isWishlistCard &&
                        (!isProductAlreadyInCart ? (
                            !isAdminCard && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 1 }}
                                    onClick={(e) => handleAddToCart(e)}
                                    style={{
                                        marginTop: "8px",
                                        width: "100%",
                                        padding: "10px 0",
                                        backgroundColor: "#ffd814",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "14px"
                                    }}
                                >
                                    Add to Cart
                                </motion.button>
                            )
                        ) : (
                            <Typography
                                mt={1}
                                color="green"
                                fontSize="13px"
                                fontWeight={600}
                            >
                                ✔ Added to Cart
                            </Typography>
                        ))}
                    
                    {/* Stock Warning */}
                    {stockQuantity <= 20 && (
                        <FormHelperText sx={{ fontSize: "12px" }} error>
                            {stockQuantity === 1 ? "Only 1 stock left!" : "Only few left!"}
                        </FormHelperText>
                    )}
                </Stack>
            </Stack>
        </>
    );
};
