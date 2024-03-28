import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '../../slices/productsApiSlice'
import Spinner from '../../components/Spinner'
import { toast } from 'react-toastify'

export default function ProductListScreen() {
    
    const navigate = useNavigate();
    const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
    const [filteredProducts, setFilteredProducts] = useState([]);

    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || "");

    useEffect(() => {
        if (!isLoading && products) {
            handleSearchFilter();
        }
    }, [keyword, products]);

    const handleSearchFilter = () => {
        const searchValue = keyword.toLowerCase();
        const filteredProducts = products.filter 
        (product => 
            product.name.toLowerCase().includes(searchValue) || product._id.toLowerCase().includes(searchValue)
        );
        setFilteredProducts(filteredProducts);
    }  

    if (isLoading) {
        return <Spinner />
    }

    if (error) {
        toast.error(error?.data?.message || error?.error)
    }


    const createProductHandler = async () => {
        if (window.confirm("Are you sure you want to create a new product?")) {
            try {
                await createProduct()
                toast.success("Product Created")
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error?.error)
            }
        }
    }

    const editProductHandler = (id) => {
        navigate(`/admin/product/${id}/edit`)
    }

    const deleteProductHandler = async id => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await deleteProduct(id)
                refetch()
                toast.success(res.message)
            } catch (error) {
                toast.error(error?.data?.message || error?.error)
            }
        }
    }
    return (
        <div>
            <div>
    <h2 className="text-2xl font-semibold mb-4">Products</h2>
    <div className="flex items-center justify-between mb-4">
        <div>
            <div className="flex justify-between mb-4 sm:flex">
                <input
                    type="text"
                    placeholder="Search"
                    className="ml-2 px-5 rounded-md bg-gray-100 text-back"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                />
                <button className="bg-red-500 text-white py-1 px-4 rounded-md ml-2">
                    Search
                </button>
            </div>
        </div>
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6 "
            onClick={createProductHandler}
        >
            Create Product
        </button>
        {loadingCreate && <Spinner />}
    </div>
</div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Product ID
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts?.map((product, index) => (
                        <tr key={product._id}>
                            <td className='px-7 py-3 whitespace-nowrap'>
                            <img src={product.image} alt={product.name} className="w-20 h-15 object-cover mr-4" />
                                <div className="flex flex-col">
                                    <div className="text-align">{product.name}</div>
                                </div>
                            </td>
                            <td className='px-7 py-3 whitespace-nowrap'>{product._id}</td>
                            <td className='px-7 py-3 whitespace-nowrap'>{product.countInStock}</td>
                            <td className='px-7 py-3 whitespace-nowrap'>{product.category}</td>
                            <td className='px-7 py-3 whitespace-nowrap'>
                                <button className='text-blue-500 hover:text-blue-700 mr-2'
                                    onClick={() => editProductHandler(product._id)}
                                >Edit</button>
                                <button className='text-red-500 hover:text-red-700'
                                    onClick={() => deleteProductHandler(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {loadingDelete && <Spinner />}
                </tbody>
            </table>
            </div>
        </div>
    )
}

