import React from 'react'
import { Link } from 'react-router-dom'

export default function Product({ product }) {
    return (
        <Link to={`/product/${product._id}`}>
            <div className="bg-white p-4 shadow-md rounded-md cursor-pointer">
                <img src={product.image} alt={product.name} className="w-full h-48 object-contain mb-2" />
                <h2 className="text-lg font-semibold overflow-ellipsis">{product.name}</h2>
                <p className="text-gray-700 mt-2">In Stock: {product.countInStock}</p>
                <div className="flex items-center mt-1">
                    <span className="text-yellow-500 mr-1">{product.rating}</span>
                    <span className="text-gray-500">({product.numReviews} reviews)</span>
                </div>
            </div>
        </Link>
    )
}
