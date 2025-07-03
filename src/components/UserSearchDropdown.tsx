// Corrected and streamlined UserSearchDropdown component
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User as UserIcon, Check } from 'lucide-react';
import { userService, User } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './LoadingSpinner';

interface UserSearchDropdownProps {
  value?: string;
  userId?: number;
  onChange: (userId: number, userDisplayName: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({
  value,
  userId,
  onChange,
  placeholder = "Search user...",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userWasSelected, setUserWasSelected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const unassignTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: searchResponse, isLoading, error } = useQuery({
    queryKey: ['userSearch', searchTerm],
    queryFn: () => userService.searchUsersByName(searchTerm),
    enabled: searchTerm.length >= 1 && isOpen && !userWasSelected,
    staleTime: 30000,
    retry: 1,
  });

  const searchResults = searchResponse?.data || [];

  const { data: currentUserResponse } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId!),
    enabled: !!userId && !selectedUser,
    staleTime: 60000,
  });

  useEffect(() => {
    if (currentUserResponse?.data) {
      const user = currentUserResponse.data;
      const displayName = userService.getUserDisplayName(user);
      setSelectedUser(user);
      setSearchTerm(displayName);
      setUserWasSelected(true);
      const timer = setTimeout(() => setUserWasSelected(false), 500);
      return () => clearTimeout(timer);
    } else if (value && !selectedUser) {
      setSearchTerm(value);
    }
  }, [currentUserResponse, selectedUser, value]);

  useEffect(() => {
    if (userId !== selectedUser?.id && userId !== undefined) {
      setSelectedUser(null);
      setSearchTerm(value || '');
      setUserWasSelected(false);
    }
  }, [userId, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      if (!searchTerm && !selectedUser) {
        setUserWasSelected(false);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setIsOpen(true);
      if (unassignTimeoutRef.current) {
        clearTimeout(unassignTimeoutRef.current);
        unassignTimeoutRef.current = null;
      }
    }
    setUserWasSelected(false);
    // if (term === '' || (selectedUser && term !== userService.getUserDisplayName(selectedUser))) {
    //   setSelectedUser(null);
    //   if (term === '') {
    //     if (unassignTimeoutRef.current) {
    //       clearTimeout(unassignTimeoutRef.current);
    //     }
    //     unassignTimeoutRef.current = setTimeout(() => {
    //       onChange(0, 'Unassigned');
    //       unassignTimeoutRef.current = null;
    //     }, 5500);
    //   }
    // }
  };

  const handleUserSelect = (user: User) => {
    const displayName = userService.getUserDisplayName(user);
    if (unassignTimeoutRef.current) {
      clearTimeout(unassignTimeoutRef.current);
      unassignTimeoutRef.current = null;
    }
    setUserWasSelected(true);
    setSelectedUser(user);
    setSearchTerm(displayName);
    setIsOpen(false);
    onChange(user.id, displayName);
    setTimeout(() => setUserWasSelected(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length === 1) {
        handleUserSelect(searchResults[0]);
      } else if (searchResults.length > 1 && searchTerm) {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      if (selectedUser && searchTerm !== userService.getUserDisplayName(selectedUser)) {
        setSearchTerm(userService.getUserDisplayName(selectedUser));
      }
    } else if (e.key === 'Backspace' && searchTerm === '') {
      setSelectedUser(null);
      setSearchTerm('');
      onChange(0, 'Unassigned');
    } else if (e.key === 'Delete' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setSelectedUser(null);
      setSearchTerm('');
      onChange(0, 'Unassigned');
    } else if (e.key === 'ArrowDown') {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleFocusOut = () => {
      if (!document.activeElement || 
          (document.activeElement !== inputRef.current && 
           !dropdownRef.current?.contains(document.activeElement))) {
        setIsOpen(false);
        if (unassignTimeoutRef.current) {
          clearTimeout(unassignTimeoutRef.current);
          unassignTimeoutRef.current = null;
        }
        if (selectedUser && searchTerm !== userService.getUserDisplayName(selectedUser)) {
          setSearchTerm(userService.getUserDisplayName(selectedUser));
        }
      }
    };
    document.addEventListener('focusin', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusOut);
      if (unassignTimeoutRef.current) {
        clearTimeout(unassignTimeoutRef.current);
      }
    };
  }, [selectedUser, searchTerm]);

  return (
    <div className={`relative min-w-[150px] max-w-full ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-7 pr-${selectedUser ? '14' : '7'} py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
        />
        {selectedUser && (
          <button 
            type="button"
            className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                if (unassignTimeoutRef.current) {
                  clearTimeout(unassignTimeoutRef.current);
                  unassignTimeoutRef.current = null;
                }
                setSelectedUser(null);
                setSearchTerm('');
                onChange(0, 'Unassigned'); 
                inputRef.current?.focus();
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <ChevronDown 
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 transition-transform ${
            isOpen ? 'rotate-180' : ''
          } cursor-pointer`}
          onClick={() => {
            if (!disabled) {
              const newIsOpen = !isOpen;
              setIsOpen(newIsOpen);
              if (newIsOpen) {
                inputRef.current?.focus();
                setUserWasSelected(false);
              }
            }
          }}
        />
      </div>
      {isOpen && !disabled && (
        <div className="absolute z-[100] w-64 min-w-[250px] mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading && searchTerm.length >= 1 && (
            <div className="p-3 text-center">
              <LoadingSpinner size="sm" text="Searching..." />
            </div>
          )}
          {error && (
            <div className="p-3 text-center text-red-600 text-xs">
              Error searching users. Try again.
            </div>
          )}
          {searchTerm.length < 1 && (
            <div className="p-3 text-center text-gray-500 text-xs">
              Type to search users
            </div>
          )}
          {userWasSelected && selectedUser && (
            <div className="p-3 text-center text-green-600 text-xs">
              Selected: {userService.getUserDisplayName(selectedUser)}
            </div>
          )}
          {searchTerm.length >= 1 && !isLoading && !error && searchResults.length === 0 && !userWasSelected && (
            <div className="p-3 text-center text-gray-500 text-xs">
              No users found. Try another search term.
            </div>
          )}
          {searchResults.length > 0 && !userWasSelected && (
            <div className="py-1">
              {searchResults.map((user) => {
                const displayName = userService.getUserDisplayName(user);
                const isSelected = selectedUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors text-xs ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <UserIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{displayName}</div>
                          {user.email && (
                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      )}
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
