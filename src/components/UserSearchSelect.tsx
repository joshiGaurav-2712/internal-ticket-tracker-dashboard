import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User as UserIcon } from 'lucide-react';
import { userService, User } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './LoadingSpinner';

interface UserSearchSelectProps {
  value?: string;
  onChange: (userId: number, userDisplayName: string) => void;
  placeholder?: string;
  className?: string;
}

export const UserSearchSelect: React.FC<UserSearchSelectProps> = ({
  value,
  onChange,
  placeholder = "Search and select user...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search users query - only enabled when search term is provided
  const { data: searchResponse, isLoading, error } = useQuery({
    queryKey: ['userSearch', searchTerm],
    queryFn: () => userService.searchUsersByName(searchTerm),
    enabled: searchTerm.length >= 2, // Only search when at least 2 characters
    staleTime: 30000, // Cache results for 30 seconds
  });

  const searchResults = searchResponse?.data || [];

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    
    // Clear selection if search term changes
    if (selectedUser && !userService.getUserDisplayName(selectedUser).toLowerCase().includes(term.toLowerCase())) {
      setSelectedUser(null);
    }
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    const displayName = userService.getUserDisplayName(user);
    setSelectedUser(user);
    setSearchTerm(displayName);
    setIsOpen(false);
    onChange(user.id, displayName);
  };

  // Handle input key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there's exactly one result, select it
      if (searchResults.length === 1) {
        handleUserSelect(searchResults[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Loading state */}
          {isLoading && searchTerm.length >= 2 && (
            <div className="p-4 text-center">
              <LoadingSpinner size="sm" text="Searching users..." />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-4 text-center text-red-600 text-sm">
              Error searching users. Please try again.
            </div>
          )}

          {/* No search term */}
          {searchTerm.length < 2 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              Type at least 2 characters to search users
            </div>
          )}

          {/* No results */}
          {searchTerm.length >= 2 && !isLoading && !error && searchResults.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No users found matching "{searchTerm}"
            </div>
          )}

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="py-1">
              {searchResults.map((user) => {
                const displayName = userService.getUserDisplayName(user);
                const isSelected = selectedUser?.id === user.id;
                
                return (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{displayName}</div>
                        {user.email && (
                          <div className="text-sm text-gray-500">{user.email}</div>
                        )}
                        {user.username !== displayName && (
                          <div className="text-xs text-gray-400">@{user.username}</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
