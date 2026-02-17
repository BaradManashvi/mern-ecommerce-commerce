import { FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery, useTheme, Button, Box } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync, resetProductFetchStatus, selectProductFetchStatus, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters } from '../ProductSlice';
import { ProductCard } from './ProductCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import { selectBrands } from '../../brands/BrandSlice';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { selectCategories } from '../../categories/CategoriesSlice';
import Pagination from '@mui/material/Pagination';
import { ITEMS_PER_PAGE } from '../../../constants';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { toast } from 'react-toastify';
import { banner1, banner2, banner3, banner4, loadingAnimation } from '../../../assets';
import { resetCartItemAddStatus, selectCartItemAddStatus } from '../../cart/CartSlice';
import { motion } from 'framer-motion';
import { ProductBanner } from './ProductBanner';
import ClearIcon from '@mui/icons-material/Clear';
import Lottie from 'lottie-react';

const sortOptions = [
    { name: "Price: low to high", sort: "price", order: "asc" },
    { name: "Price: high to low", sort: "price", order: "desc" },
    { name: "Latest first", sort: "createdAt", order: "desc" }, // added latest
];

const bannerImages = [banner1, banner3, banner2, banner4];

export const ProductList = () => {
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState(sortOptions[2]); // default latest first
    const theme = useTheme();
    const filterRef = useRef();
    const [searchText, setSearchText] = useState("");


    const is1200 = useMediaQuery(theme.breakpoints.down(1200));
    const is800 = useMediaQuery(theme.breakpoints.down(800));
    const is700 = useMediaQuery(theme.breakpoints.down(700));
    const is600 = useMediaQuery(theme.breakpoints.down(600));
    const is500 = useMediaQuery(theme.breakpoints.down(500));
    const is488 = useMediaQuery(theme.breakpoints.down(488));

    const brands = useSelector(selectBrands);
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const totalResults = useSelector(selectProductTotalResults);
    const loggedInUser = useSelector(selectLoggedInUser);
    const productFetchStatus = useSelector(selectProductFetchStatus);
    const wishlistItems = useSelector(selectWishlistItems);
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
    const cartItemAddStatus = useSelector(selectCartItemAddStatus);
    const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

    const dispatch = useDispatch();

    // Filter handlers
    const handleBrandFilters = (e) => {
        const filterSet = new Set(filters.brand);
        if (e.target.checked) filterSet.add(e.target.value);
        else filterSet.delete(e.target.value);
        setFilters({ ...filters, brand: Array.from(filterSet) });
    };

    const handleCategoryFilters = (e) => {
        const filterSet = new Set(filters.category);
        if (e.target.checked) filterSet.add(e.target.value);
        else filterSet.delete(e.target.value);
        setFilters({ ...filters, category: Array.from(filterSet) });
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    useEffect(() => { setPage(1); }, [totalResults]);

    useEffect(() => {
        const finalFilters = {
            ...filters,
            pagination: { page, limit: ITEMS_PER_PAGE },
            sort,
            search: searchText.trim() === "" ? undefined : searchText.trim()
        };

        if (!loggedInUser?.isAdmin) finalFilters.user = true;
        dispatch(fetchProductsAsync(finalFilters));
    }, [filters, page, sort, searchText]);

    const handleAddRemoveFromWishlist = (e, productId) => {
        if (e.target.checked) dispatch(createWishlistItemAsync({ user: loggedInUser?._id, product: productId }));
        else {
            const index = wishlistItems.findIndex((item) => item.product._id === productId);
            if (index >= 0) dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    };

    // Toast notifications
    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') toast.success("Product added to wishlist");
        else if (wishlistItemAddStatus === 'rejected') toast.error("Error adding product to wishlist");
    }, [wishlistItemAddStatus]);

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') toast.success("Product removed from wishlist");
        else if (wishlistItemDeleteStatus === 'rejected') toast.error("Error removing product from wishlist");
    }, [wishlistItemDeleteStatus]);

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') toast.success("Product added to cart");
        else if (cartItemAddStatus === 'rejected') toast.error("Error adding product to cart");
    }, [cartItemAddStatus]);

    useEffect(() => {
        if (productFetchStatus === 'rejected') toast.error("Error fetching products");
    }, [productFetchStatus]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                if (isProductFilterOpen) dispatch(toggleFilters());
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProductFilterOpen]);

    const handleFilterToggle = () => dispatch(toggleFilters());

    return (
        <Box>
            {/* Filter toggle button */}
            <Stack direction="row" justifyContent="flex-end" my={2} px={2}>
                <Button variant="contained" onClick={handleFilterToggle}>
                    {isProductFilterOpen ? "Close Filters" : "Show Filters"}
                </Button>
            </Stack>

            {/* Filter sidebar */}
            {isProductFilterOpen && (
                <motion.div
                    ref={filterRef}
                    style={{ position: "fixed", top: 0, left: 0, backgroundColor: "white", height: "100vh", padding: "1rem", overflowY: "scroll", width: is500 ? "100vw" : "30rem", zIndex: 500 }}
                    initial={{ x: -500 }}
                    animate={{ x: 0 }}
                    exit={{ x: -500 }}
                    transition={{ type: "spring", duration: 0.7 }}
                >
                    <Stack mb={5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4">Filters</Typography>
                            <IconButton onClick={handleFilterToggle}>
                                <ClearIcon />
                            </IconButton>
                        </Stack>

                        {/* Brand filters */}
                        <Accordion sx={{ mt: 2 }}>
                            <AccordionSummary expandIcon={<AddIcon />}>
                                <Typography>Brands</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                <FormGroup onChange={handleBrandFilters}>
                                    {brands?.map((brand) => (
                                        <FormControlLabel key={brand._id} sx={{ ml: 1 }} control={<Checkbox />} label={brand.name} value={brand._id} />
                                    ))}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>

                        {/* Category filters */}
                        <Accordion sx={{ mt: 2 }}>
                            <AccordionSummary expandIcon={<AddIcon />}>
                                <Typography>Category</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                <FormGroup onChange={handleCategoryFilters}>
                                    {categories?.map((category) => (
                                        <FormControlLabel key={category._id} sx={{ ml: 1 }} control={<Checkbox />} label={category.name} value={category._id} />
                                    ))}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </motion.div>
            )}

            {/* Products Section */}
            <Stack rowGap={5} mt={2} px={2}>
                {/* Sort dropdown */}
                <Stack
                    direction={is600 ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    width="100%"
                >
                    {/* SEARCH BAR */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "4px 10px",
                            width: is600 ? "100%" : "280px"
                        }}
                    >
                        <IconButton size="small">
                            <i className="fa fa-search"></i>
                        </IconButton>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                border: "none",
                                outline: "none",
                                width: "100%",
                                fontSize: "16px"
                            }}
                        />
                    </Stack>

                    {/* SORT DROPDOWN */}
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Sort</InputLabel>
                        <Select
                            value={sort}
                            label="Sort"
                            onChange={(e) => setSort(e.target.value)}
                        >
                            {sortOptions.map((option) => (
                                <MenuItem key={option.name} value={option}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>


                {/* Product Grid */}
                {productFetchStatus === 'pending' ? (
                    <Stack width={is500 ? "35vh" : '25rem'} height={'60vh'} justifyContent={'center'} margin="auto">
                        <Lottie animationData={loadingAnimation} />
                    </Stack>
                ) : (
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                    >
                        {products.map((product) => (
                            <Grid
                                item
                                key={product._id}
                                xs={6}   // ⭐ EXACT 2 per row on mobile
                                sm={4}   // ⭐ 3 per row on tablets
                                md={3}   // ⭐ 4 per row on small laptops
                                lg={2.4} // ⭐ 5 per row on large screens
                            >
                                <ProductCard
                                    id={product._id}
                                    title={product.title}
                                    thumbnail={product.thumbnail}
                                    brand={product.brand.name}
                                    price={product.price}
                                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                />
                            </Grid>
                        ))}
                    </Grid>

                )}

                {/* Pagination */}
                <Stack alignItems={is488 ? 'center' : 'flex-end'} mt={3}>
                    <Pagination
                        page={page}
                        onChange={(e, p) => setPage(p)}
                        count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                        variant="outlined"
                        shape="rounded"
                        size={is488 ? 'medium' : 'large'}
                    />
                    <Typography textAlign="center">
                        Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE} of {totalResults} results
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};
