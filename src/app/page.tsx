"use client";

import { useEffect, useState } from "react";

interface Advocate {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

interface ApiResponse {
  data: Advocate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchAdvocates = async () => {
    setIsLoading(true);
    
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
    });
    
    if (searchTerm) params.append('search', searchTerm);
    if (cityFilter) params.append('city', cityFilter);
    if (degreeFilter) params.append('degree', degreeFilter);
    if (minExperience) params.append('minExperience', minExperience);
    if (maxExperience) params.append('maxExperience', maxExperience);

    try {
      const response = await fetch(`/api/advocates?${params.toString()}`);
      const data: ApiResponse = await response.json();
      
      setAdvocates(data.data);
      setTotalPages(data.totalPages);
      setTotalResults(data.total);
    } catch (error) {
      console.error('Error fetching advocates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, [currentPage, searchTerm, cityFilter, degreeFilter, minExperience, maxExperience]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCityFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDegreeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDegreeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleMinExperience = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinExperience(e.target.value);
    setCurrentPage(1);
  };

  const handleMaxExperience = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxExperience(e.target.value);
    setCurrentPage(1);
  };

  const onReset = () => {
    setSearchTerm("");
    setCityFilter("");
    setDegreeFilter("");
    setMinExperience("");
    setMaxExperience("");
    setCurrentPage(1);
  };


  const formatPhoneNumber = (phone: number) => {
    const phoneStr = phone.toString();
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Solace Advocates
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find experienced healthcare advocates to guide you through your medical journey
          </p>
        </header>

        {/* Search and Filter Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8" role="search" aria-label="Search and filter advocates">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                Search Advocates
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search-input"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by name..."
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city-filter"
                  type="text"
                  value={cityFilter}
                  onChange={handleCityFilter}
                  placeholder="Filter by city..."
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label htmlFor="degree-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <select
                  id="degree-filter"
                  value={degreeFilter}
                  onChange={handleDegreeFilter}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All degrees</option>
                  <option value="MD">MD</option>
                  <option value="PhD">PhD</option>
                  <option value="MSW">MSW</option>
                </select>
              </div>

              <div>
                <label htmlFor="min-experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Min Experience
                </label>
                <input
                  id="min-experience"
                  type="number"
                  value={minExperience}
                  onChange={handleMinExperience}
                  placeholder="0"
                  min="0"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label htmlFor="max-experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Experience
                </label>
                <input
                  id="max-experience"
                  type="number"
                  value={maxExperience}
                  onChange={handleMaxExperience}
                  placeholder="50"
                  min="0"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Results count and reset button */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                {totalResults} advocate{totalResults !== 1 ? 's' : ''} found
              </p>
              {(searchTerm || cityFilter || degreeFilter || minExperience || maxExperience) && (
                <button
                  onClick={onReset}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading advocates...</span>
          </div>
        )}

        {/* Results Section */}
        {!isLoading && (
          <section aria-label="Advocates directory">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Top Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} advocates
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credentials
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialties
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {advocates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          {searchTerm || cityFilter || degreeFilter || minExperience || maxExperience ? 'No advocates found matching your filters.' : 'No advocates available.'}
                        </td>
                      </tr>
                    ) : (
                      advocates.map((advocate: Advocate) => (
                        <tr key={advocate.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {advocate.firstName} {advocate.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{advocate.city}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {advocate.degree}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {advocate.specialties.map((specialty: string) => (
                                <span
                                  key={specialty}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {advocate.yearsOfExperience} years
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={`tel:${advocate.phoneNumber}`}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {formatPhoneNumber(advocate.phoneNumber)}
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {advocates.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || cityFilter || degreeFilter || minExperience || maxExperience ? 'No advocates found matching your filters.' : 'No advocates available.'}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {advocates.map((advocate: Advocate) => (
                      <article key={advocate.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {advocate.firstName} {advocate.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{advocate.city}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {advocate.degree}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Specialties</h4>
                            <div className="flex flex-wrap gap-1">
                              {advocate.specialties.map((specialty: string) => (
                                <span
                                  key={specialty}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{advocate.yearsOfExperience}</span> years experience
                            </div>
                            <a
                              href={`tel:${advocate.phoneNumber}`}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                            >
                              <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              {formatPhoneNumber(advocate.phoneNumber)}
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} advocates
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
