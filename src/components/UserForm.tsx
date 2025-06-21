'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserFormData, UserSchema } from '../types/user';

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema.omit({ id: true, createdAt: true, updatedAt: true })),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      age: user.age,
      department: user.department,
      role: user.role,
    } : {
      name: '',
      email: '',
      age: 0,
      department: '',
      role: '',
    },
  });

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      if (!user) {
        reset(); // Reset form only for new users
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {user ? 'Edit User' : 'Add New User'}
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Age Field */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            {...register('age', { valueAsNumber: true })}
            type="number"
            id="age"
            min="1"
            max="120"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter age"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        {/* Department Field */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <select
            {...register('department')}
            id="department"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        {/* Role Field */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <input
            {...register('role')}
            type="text"
            id="role"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter job role"
          />
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting || isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {user ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              user ? 'Update User' : 'Create User'
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};