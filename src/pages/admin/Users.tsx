import React, { useState, useEffect } from 'react';
import {
	PencilIcon,
	TrashIcon,
	MagnifyingGlassIcon,
	UserPlusIcon,
	KeyIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { useUsers, User } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Users: React.FC = () => {
	const { isAuthenticated, user, loading: authLoading } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterRole, setFilterRole] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [users, setUsers] = useState<User[]>([]);
	const [roles, setRoles] = useState<string[]>([]);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		itemsPerPage: 10
	});
	const { toast, showToast, hideToast } = useToast();
	const { 
		loading, 
		error, 
		getUsers, 
		getUserRoles,
		createUser, 
		updateUser, 
		deleteUser, 
		toggleUserStatus,
		changeUserPassword
	} = useUsers();

	// Redirect if not authenticated or not a superadmin
	if (!authLoading && (!isAuthenticated || (user && user.role !== 'superadmin'))) {
		return <Navigate to="/login" />;
	}

	// Load users on component mount and when filters change
	useEffect(() => {
		if (!isAuthenticated) return;

		const loadUsers = async () => {
			try {
				const response = await getUsers(
					currentPage,
					10,
					filterRole === 'all' ? undefined : filterRole,
					searchTerm || undefined
				);
				setUsers(response.users);
				setPagination(response.pagination);
			} catch (error: any) {
				showToast('error', error.response?.message || 'Failed to load users');
			}
		};
		loadUsers();
	}, [currentPage, filterRole, searchTerm, isAuthenticated]);

	// Load user roles
	useEffect(() => {
		if (!isAuthenticated) return;

		const loadRoles = async () => {
			try {
				const response = await getUserRoles();
				setRoles(response);
			} catch (error: any) {
				showToast('error', error.response?.message || 'Failed to load roles');
			}
		};
		loadRoles();
	}, [isAuthenticated]);

	// Debounce search term changes
	useEffect(() => {
		const timer = setTimeout(() => {
			setCurrentPage(1); // Reset to first page when search changes
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const handleAddUser = () => {
		setSelectedUser(null);
		setIsModalOpen(true);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleEditUser = (user: User) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleChangePassword = (user: User) => {
		setSelectedUser(user);
		setIsPasswordModalOpen(true);
	};

	const handleDeleteUser = (user: User) => {
		setUserToDelete(user);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteUser = async () => {
		if (!userToDelete) return;
		
		try {
			await deleteUser(userToDelete.id);
			showToast('success', `User ${userToDelete.name} berhasil dihapus`);
			setIsDeleteDialogOpen(false);
			setUserToDelete(null);
			// Refresh user list
			const response = await getUsers(currentPage, 10, filterRole === 'all' ? undefined : filterRole, searchTerm);
			setUsers(response.users);
			setPagination(response.pagination);
		} catch (error: any) {
			showToast('error', error.response?.message || 'Failed to delete user');
		}
	};

	const handleSubmitUser = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);

		try {
			if (selectedUser) {
				const userData = {
					name: formData.get('name') as string,
					email: formData.get('email') as string,
					role: formData.get('role') as string,
					is_active: formData.get('is_active') === 'true'
				};
				
				await updateUser(selectedUser.id, userData);
				showToast('success', 'User berhasil diperbarui');
			} else {
				const userData = {
					name: formData.get('name') as string,
					email: formData.get('email') as string,
					password: formData.get('password') as string,
					role: formData.get('role') as string
				};
				
				await createUser(userData);
				showToast('success', 'User berhasil dibuat');
			}
			
			setIsModalOpen(false);
			setSelectedUser(null);
			// Refresh user list
			const response = await getUsers(currentPage, 10, filterRole === 'all' ? undefined : filterRole, searchTerm);
			setUsers(response.users);
			setPagination(response.pagination);
		} catch (error: any) {
			showToast('error', error.response?.message || 'Failed to save user');
		}
	};

	const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedUser) return;
		
		const form = e.currentTarget;
		const formData = new FormData(form);
		const password = formData.get('password') as string;
		
		try {
			await changeUserPassword(selectedUser.id, password);
			showToast('success', 'Password berhasil diubah');
			setIsPasswordModalOpen(false);
			setSelectedUser(null);
		} catch (error: any) {
			showToast('error', error.response?.message || 'Failed to change password');
		}
	};

	const handleToggleStatus = async (user: User) => {
		try {
			await toggleUserStatus(user.id);
			showToast('success', `Status user ${user.name} berhasil diubah`);
			// Refresh user list
			const response = await getUsers(currentPage, 10, filterRole === 'all' ? undefined : filterRole, searchTerm);
			setUsers(response.users);
			setPagination(response.pagination);
		} catch (error: any) {
			showToast('error', error.response?.message || 'Failed to toggle user status');
		}
	};

	const getRoleColor = (role: string) => {
		switch (role) {
			case 'superadmin': return 'bg-purple-100 text-purple-800';
			case 'admin': return 'bg-red-100 text-red-800';
			case 'msme': return 'bg-green-100 text-green-800';
			case 'contributor': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusColor = (isActive: boolean) => {
		return isActive 
			? 'bg-green-100 text-green-800'
			: 'bg-gray-100 text-gray-800';
	};

	// Calculate pagination
	const totalPages = pagination.totalPages;
	const pageNumbers = [];
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
					<p className="text-gray-600">Kelola admin, UMKM, and kontributor</p>
				</div>
				<button
					onClick={handleAddUser}
					className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
				>
					<UserPlusIcon className="h-5 w-5" />
					<span>Tambah Pengguna</span>
				</button>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
					<div className="flex-1 max-w-md">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							/>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						<select
							value={filterRole}
							onChange={(e) => setFilterRole(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						>
							<option value="all">All Roles</option>
							{roles.map(role => (
								<option key={role} value={role}>{role}</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{users.map((user) => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
												{user.name.charAt(0)}
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">{user.name}</div>
												<div className="text-sm text-gray-500">{user.email}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
											{user.role}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.is_active)}`}>
											{user.is_active ? 'active' : 'inactive'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{new Date(user.created_at).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex space-x-2">
											<button 
												onClick={() => handleEditUser(user)}
												className="text-green-600 hover:text-green-900"
												title="Edit user"
											>
												<PencilIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleChangePassword(user)}
												className="text-blue-600 hover:text-blue-900"
												title="Change password"
											>
												<KeyIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeleteUser(user)}
												className="text-red-600 hover:text-red-900"
												title="Delete user"
											>
												<TrashIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleToggleStatus(user)}
												className="text-blue-600 hover:text-blue-900 text-xs"
												title={user.is_active ? "Deactivate user" : "Activate user"}
											>
												Toggle
											</button>
										</div>
									</td>
								</tr>
							))}
							{users.length === 0 && (
								<tr>
									<td colSpan={5} className="px-6 py-4 text-center text-gray-500">
										No users found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
						<div className="flex-1 flex justify-between sm:hidden">
							<button
								onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
								disabled={currentPage === 1}
								className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
									currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
								}`}
							>
								Sebelumnya
							</button>
							<button
								onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
								disabled={currentPage === totalPages}
								className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
									currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
								}`}
							>
								Selanjutnya
							</button>
						</div>
						<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-gray-700">
									Showing <span className="font-medium">{(currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
									<span className="font-medium">
										{Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)}
									</span>{' '}
									of <span className="font-medium">{pagination.totalItems}</span> results
								</p>
							</div>
							<div>
								<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
									<button
										onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
										disabled={currentPage === 1}
										className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
											currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
										}`}
									>
										<span className="sr-only">Previous</span>
										<span>&laquo;</span>
									</button>
									{pageNumbers.map((page) => (
										<button
											key={page}
											onClick={() => handlePageChange(page)}
											className={`relative inline-flex items-center px-4 py-2 border ${
												page === currentPage
													? 'bg-orange-500 text-white border-orange-500 z-10'
													: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
											} text-sm font-medium`}
										>
											{page}
										</button>
									))}
									<button
										onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
										disabled={currentPage === totalPages}
										className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
											currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
										}`}
									>
										<span className="sr-only">Next</span>
										<span>&raquo;</span>
									</button>
								</nav>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Add/Edit User Modal */}
			<Transition appear show={isModalOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
										{selectedUser ? 'Edit User' : 'Add New User'}
									</Dialog.Title>

									<form onSubmit={handleSubmitUser} className="space-y-4">
										<div>
											<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
											<input
												id="name"
												name="name"
												type="text"
												defaultValue={selectedUser?.name || ''}
												required
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											/>
										</div>

										<div>
											<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
											<input
												id="email"
												name="email"
												type="email"
												defaultValue={selectedUser?.email || ''}
												required
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											/>
										</div>

										<div>
											<label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
											<select
												id="role"
												name="role"
												defaultValue={selectedUser?.role || (roles.length > 0 ? roles[0] : '')}
												required
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											>
												{roles.map(role => (
													<option key={role} value={role}>{role}</option>
												))}
											</select>
										</div>

										{selectedUser && (
											<div>
												<label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
												<select
													id="is_active"
													name="is_active"
													defaultValue={selectedUser.is_active ? 'true' : 'false'}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
												>
													<option value="true">Active</option>
													<option value="false">Inactive</option>
												</select>
											</div>
										)}

										{!selectedUser && (
											<div>
												<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
												<input
													id="password"
													name="password"
													type="password"
													required
													minLength={6}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
												/>
											</div>
										)}

										<div className="flex justify-end space-x-3 pt-4">
											<button
												type="button"
												onClick={() => setIsModalOpen(false)}
												className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
											>
												Cancel
											</button>
											<button
												type="submit"
												className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
											>
												{selectedUser ? 'Update' : 'Create'}
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>

			{/* Change Password Modal */}
			<Transition appear show={isPasswordModalOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={setIsPasswordModalOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
										Change Password for {selectedUser?.name}
									</Dialog.Title>

									<form onSubmit={handleSubmitPassword} className="space-y-4">
										<div>
											<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
											<input
												id="password"
												name="password"
												type="password"
												required
												minLength={6}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											/>
										</div>

										<div className="flex justify-end space-x-3 pt-4">
											<button
												type="button"
												onClick={() => setIsPasswordModalOpen(false)}
												className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
											>
												Cancel
											</button>
											<button
												type="submit"
												className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
											>
												Change Password
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>

			{/* Delete Confirmation Dialog */}
			<ConfirmDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={confirmDeleteUser}
				title="Hapus User"
				message={`Apakah Anda yakin ingin menghapus user ${userToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
				confirmText="Hapus"
				cancelText="Batal"
				type="danger"
			/>

			{/* Toast Notification */}
			{toast.show && (
				<Toast
					type={toast.type}
					message={toast.message}
					onClose={hideToast}
				/>
			)}
		</div>
	);
};

export default Users;
