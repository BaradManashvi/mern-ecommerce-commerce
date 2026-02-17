import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedProduct, fetchProductByIdAsync, resetProductFetchStatus, selectProductFetchStatus, selectSelectedProduct } from '../ProductSlice';
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { fetchReviewsByProductIdAsync, resetReviewFetchStatus, selectReviewFetchStatus, selectReviews } from '../../review/ReviewSlice';
import { Reviews } from '../../review/components/Reviews';
import { toast } from 'react-toastify';
import { motion, MotionConfig } from 'framer-motion';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { useTheme } from '@mui/material';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Lottie from 'lottie-react';
import { loadingAnimation } from '../../../assets';

const SIZES = ['XS','S','M','L','XL'];
const COLORS = ['#020202','#F6F6F6','#B82222','#BEA9A9','#E2BB8D'];

export const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectSelectedProduct);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const reviews = useSelector(selectReviews);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
  const productFetchStatus = useSelector(selectProductFetchStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();
  const is1420 = window.innerWidth <= 1420;
  const is990 = window.innerWidth <= 990;
  const is840 = window.innerWidth <= 840;
  const is500 = window.innerWidth <= 500;
  const is480 = window.innerWidth <= 480;

  const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id);
  const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id);

  const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const totalReviews = reviews.length;
  const averageRating = totalReviews ? Math.ceil(totalReviewRating / totalReviews) : 0;
  const maxSteps = product?.images.length || 0;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  useEffect(() => { if (id) { dispatch(fetchProductByIdAsync(id)); dispatch(fetchReviewsByProductIdAsync(id)); } }, [id]);

  useEffect(() => {
    const interval = setInterval(() => setActiveStep(prev => (prev + 1) % maxSteps), 3000);
    return () => clearInterval(interval);
  }, [maxSteps]);

  useEffect(() => {
    if (cartItemAddStatus === 'fulfilled') toast.success("Product added to cart");
    if (cartItemAddStatus === 'rejected') toast.error('Error adding product to cart, please try again later');
    if (wishlistItemAddStatus === 'fulfilled') toast.success("Product added to wishlist");
    if (wishlistItemAddStatus === 'rejected') toast.error("Error adding product to wishlist, please try again later");
    if (wishlistItemDeleteStatus === 'fulfilled') toast.success("Product removed from wishlist");
    if (wishlistItemDeleteStatus === 'rejected') toast.error("Error removing product from wishlist, please try again later");
    if (productFetchStatus === 'rejected') toast.error("Error fetching product details, please try again later");
    if (reviewFetchStatus === 'rejected') toast.error("Error fetching product reviews, please try again later");
  }, [cartItemAddStatus, wishlistItemAddStatus, wishlistItemDeleteStatus, productFetchStatus, reviewFetchStatus]);

  useEffect(() => () => {
    dispatch(clearSelectedProduct());
    dispatch(resetProductFetchStatus());
    dispatch(resetReviewFetchStatus());
    dispatch(resetWishlistItemDeleteStatus());
    dispatch(resetWishlistItemAddStatus());
    dispatch(resetCartItemAddStatus());
  }, []);

  const handleAddToCart = () => { dispatch(addToCartAsync({ user: loggedInUser._id, product: id, quantity })); setQuantity(1); };
  const handleDecreaseQty = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncreaseQty = () => quantity < 20 && quantity < product.stockQuantity && setQuantity(quantity + 1);
  const handleSizeSelect = size => setSelectedSize(size);
  const handleAddRemoveFromWishlist = e => {
    if (e.target.checked) dispatch(createWishlistItemAsync({ user: loggedInUser?._id, product: id }));
    else { const index = wishlistItems.findIndex(item => item.product._id === id); dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id)); }
  };
  const handleNext = () => setActiveStep(prev => Math.min(prev + 1, maxSteps - 1));
  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));
  const handleStepChange = step => setActiveStep(step);

  if (!product) return (
    <div className="flex justify-center items-center h-screen w-full">
      <Lottie animationData={loadingAnimation} className="w-40 h-40" />
    </div>
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-10 w-full">
        
        {/* Left - Images */}
        <div className="flex flex-col lg:flex-row gap-5 w-full lg:w-2/3">
          {!is1420 && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px]">
              {product.images.map((img, idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.05 }} className="cursor-pointer" onClick={() => setSelectedImageIndex(idx)}>
                  <img src={img} alt={`${product.title} ${idx}`} className="w-32 h-32 object-contain border rounded" />
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex-1 flex flex-col items-center justify-center">
            {is1420 ? (
              <div className="w-full">
                <SwipeableViews index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
                  {product.images.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex justify-center">
                      {Math.abs(activeStep - idx) <= 2 && (
                        <img src={img} alt={product.title} className="w-full max-h-[600px] object-contain rounded-lg" />
                      )}
                    </div>
                  ))}
                </SwipeableViews>
                <MobileStepper
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  nextButton={<button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={handleNext} disabled={activeStep === maxSteps - 1}>Next</button>}
                  backButton={<button className="px-4 py-2 bg-gray-200 text-black rounded" onClick={handleBack} disabled={activeStep === 0}>Back</button>}
                />
              </div>
            ) : (
              <img src={product.images[selectedImageIndex]} alt={product.title} className="w-full max-h-[600px] object-contain rounded-lg" />
            )}
          </div>
        </div>

        {/* Right - Info */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="flex items-center gap-2">
                <span className="text-yellow-500">{'⭐'.repeat(averageRating)}</span>
                <span>({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})</span>
              </span>
              <span className={`font-semibold ${product.stockQuantity <= 10 ? 'text-red-600' : product.stockQuantity <= 20 ? 'text-orange-500' : 'text-green-600'}`}>
                {product.stockQuantity <= 10 ? `Only ${product.stockQuantity} left` : product.stockQuantity <= 20 ? "Only few left" : "In Stock"}
              </span>
            </div>
            <p className="text-2xl font-bold mt-2">&#8377;{product.price}</p>
          </div>

          <p className="text-gray-700">{product.description}</p>

          {!loggedInUser?.isAdmin && (
            <div className="flex flex-col gap-4">
              {/* Colors */}
              <div className="flex items-center gap-4">
                <span>Colors:</span>
                <div className="flex gap-2">
                  {COLORS.map((color, idx) => (
                    <div key={idx} onClick={() => setSelectedColorIndex(idx)} className={`w-10 h-10 rounded-full border-2 cursor-pointer ${selectedColorIndex === idx ? 'border-black' : 'border-gray-200'}`} style={{ backgroundColor: color }}></div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="flex items-center gap-4">
                <span>Size:</span>
                <div className="flex gap-2">
                  {SIZES.map(size => (
                    <motion.div key={size} onClick={() => handleSizeSelect(size)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} className={`px-3 py-2 border rounded cursor-pointer ${selectedSize === size ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
                      {size}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quantity + Buttons */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border rounded">
                  <button className="px-3 py-1" onClick={handleDecreaseQty}>-</button>
                  <span className="px-3">{quantity}</span>
                  <button className="px-3 py-1 bg-black text-white" onClick={handleIncreaseQty}>+</button>
                </div>
                {isProductAlreadyInCart ? (
                  <button className="px-6 py-2 bg-black text-white rounded" onClick={() => navigate("/cart")}>In Cart</button>
                ) : (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }} onClick={handleAddToCart} className="px-6 py-2 bg-black text-white rounded">Add To Cart</motion.button>
                )}
                <input type="checkbox" checked={isProductAlreadyinWishlist} onChange={handleAddRemoveFromWishlist} className="cursor-pointer"/>
              </div>
            </div>
          )}

          {/* Perks */}
          <div className="border rounded p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <LocalShippingOutlinedIcon />
              <div>
                <p className="font-semibold">Free Delivery</p>
                <p className="text-gray-500 text-sm">Enter your postal for delivery availability</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CachedOutlinedIcon />
              <div>
                <p className="font-semibold">Return Delivery</p>
                <p className="text-gray-500 text-sm">Free 30 Days Delivery Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <Reviews productId={id} averageRating={averageRating} />
      </div>
    </div>
  );
};
