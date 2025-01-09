import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import axiosInstance from './axiosSetup';
import AdminLeaveRequests from './leave-request/AdminLeaveRequests';

const Crud = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const navigate=useNavigate()

useEffect(() => {

  //fetch users

    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

 
    fetchUsers();
  }, []);


  // disabled users
  const handeleToggleStatus= async (e,userId,currentStatus)=>{
e.preventDefault()
    const isConfirmed=window.confirm(`Are you sure you want to change`)
    if (!isConfirmed) return;
    try{
const resp=await axiosInstance.put(`users/${userId}/toggle`)
console.log(resp.data.message)
setUsers(users.map(user=>
  user.id===userId?{...user,status:currentStatus==='enabled'?'disabled':'enabled'}:user
))}catch(error){
console.error(error)
}
  }

  // const handleDeleteSuccess = (deletedUserId) => {
  //   setUsers(users.filter(user => user.id !== deletedUserId)); 
  // };

  // const handleDelete = async (userId) => {
  //   const isConfirmed = window.confirm('Are you sure you want to delete this user?'); 
  //   if (!isConfirmed) {
  //     return; 
  //   }

  //   try {
  //     const response = await axiosInstance.delete(`/users/${userId}`);
  //     console.log(response.data.message); 
  //     handleDeleteSuccess(userId); 
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };


  //delete  demande d'attestations

  



  return (
    <div>
      <h2>User List</h2>

      <Link to="/create-user">
        <button style={{ backgroundColor: 'green', color: 'white' }}>
          Create User
        </button>
      </Link>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Profile Picture</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const profilePictureUrl = user.profile_picture
              ? `http://localhost:8000/storage/${user.profile_picture}` 
              : null;
              const isDisabled = user.status === 'disabled';
            return (
              <tr
  key={user.id}
 
>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.phone}</td>
                <td>
                  {profilePictureUrl ? (
                    <img src={profilePictureUrl} alt="Profile" style={{ width: '100px', height: '100px' }} />
                  ) : (
                    <p>No profile picture</p>
                  )}
                </td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/user-details/${user.id}`}>
                    <button style={{ backgroundColor: 'purple', color: 'white', marginRight: '10px' }} disabled={isDisabled}>
                      View Details
                    </button>
                  </Link>
                  <Link to={`/update-user/${user.id}`}>
                    <button style={{ backgroundColor: 'blue', color: 'white', marginRight: '10px' }} disabled={isDisabled}>
                      Update
                    </button>
                  </Link>

                  {/* <button 
                    onClick={() => handleDelete(user.id)} 
                    style={{ backgroundColor: 'red', color: 'white' }}>
                    Delete
                  </button> */}
<button
  onClick={(e) => handeleToggleStatus(e, user.id, user.status)} 
  disabled={user.status === 'disabled'}  
  style={{ backgroundColor: 'orange', color: 'white', marginRight: '10px' }}
>
  {user.status === 'enabled' ? 'Disable' : 'Enable'}
</button>


                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={onLogout}>Logout</button>

     
      <AdminLeaveRequests/>
      <button onClick={onLogout}>Logout</button>
    </div>


   
  );
};

export default Crud;
