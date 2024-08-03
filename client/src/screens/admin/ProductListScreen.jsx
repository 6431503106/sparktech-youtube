import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '../../slices/productsApiSlice';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import TablePagination from '@mui/material/TablePagination';


export default function ProductListScreen() {
    const navigate = useNavigate();
    const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || "");
    const [currentPage, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        if (!isLoading && products) {
            handleSearchFilter();
        }
    }, [keyword, products]);

    useEffect(() => {
        paginate(0);
    }, [filteredProducts]);

    const handleSearchFilter = () => {
        const searchValue = keyword.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchValue) || product._id.toLowerCase().includes(searchValue)
        );
        setFilteredProducts(filteredProducts);
    };

    const createProductHandler = async () => {
        if (window.confirm("Are you sure you want to create a new product?")) {
            try {
                await createProduct();
                toast.success("Product Created");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error?.error);
            }
        }
    };

    const editProductHandler = id => {
        navigate(`/admin/product/${id}/edit`);
    };

    const deleteProductHandler = async id => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await deleteProduct(id);
                refetch();
                toast.success(res.message);
            } catch (error) {
                toast.error(error?.data?.message || error?.error);
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginate = pageNumber => setPage(pageNumber);

    const indexOfLastProduct = (currentPage + 1) * rowsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        
        <div>
            <div class="content-wrapper justify-start sidebar-open">
                <h2 className="text-3xl font-semibold mb-3">Products</h2>
            </div>

            <div className="content-menu flex justify-between mb-2 sidebar-open">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search"
                            className="ml-2 px-5 rounded-md bg-gray-100 text-back"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                        />
                        <button className="bg-red-500 text-white py-2 px-4 rounded-md ml-2" onClick={handleSearchFilter}>
                            Search
                        </button>
                    </div>
                    <div className="flex">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                        onClick={createProductHandler}
                    >
                        Create Product
                    </button>
                    </div>
                    {loadingCreate && <Spinner />}
                </div>
            
            
            <div className="content-table">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Product Image
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Product ID
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentProducts.map(product => (
                            <tr key={product._id}>
                                <td className="table-cell px-4 py-3 text-center whitespace-nowrap">
                                <img src={product.image} alt={product.name} className="img-small" />
                                </td>
                                <td className="px-4 py-3 text-letf whitespace-nowrap">{product.name}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">{product._id}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">{product.countInStock}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">{product.category}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                        onClick={() => editProductHandler(product._id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => deleteProductHandler(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {loadingDelete && <Spinner />}
                    </tbody>
                </table>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
        
    );
}
