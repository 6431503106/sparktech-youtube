import React, { useState, useEffect } from 'react';
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/userApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import TablePagination from '@mui/material/TablePagination';
import '../../Header.css'; // เพิ่มไฟล์ CSS

export default function UserListScreen() {
    const { data: users, isLoading, error, refetch } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || "");
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (!isLoading && users) {
            handleSearchFilter();
        }
    }, [keyword, users]);
    
    useEffect(() => {
        paginate(0);
    }, [filteredUsers]);

    const handleSearchFilter = () => {
        const searchValue = keyword.toLowerCase();
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchValue) || user.email.toLowerCase().includes(searchValue)
        );
        setFilteredUsers(filteredUsers);
    };           

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginate = pageNumber => setPage(pageNumber);

    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await deleteUser(id);
                toast.success(res.message);
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error?.error);
            }
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        toast.error(error.message);
    }

    const indexOfLastUser = (page + 1) * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
<div>
    <div className="content-wrapper justify-start" >
            <h2 className="text-3xl font-semibold mb-3">Users</h2>
    </div>
    <div className="content-menu  justify-between mb-2">
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
            onClick={() => navigate("/admin/add")}
        >
            Create New User
        </button>
    </div>
</div>      
            <div className='content-table'>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">ID</th>
                            <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Name</th>
                            <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Email</th>
                            <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Status</th>
                            <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id} className="text-center">
                                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">{user._id}</td>
                                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">{user.name}</td>
                                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">{user.email}</td>
                                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">{user.isAdmin ? "Faculty Member" : "Student"}</td>
                                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">
                                    <button className="text-blue-500 hover:text-blue-700 mr-2"
                                        onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                                    >
                                        Edit
                                    </button>
                                    <button className="text-red-500 hover:text-red-700"
                                        onClick={() => onDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
}
