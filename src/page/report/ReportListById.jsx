import React, { useState, useEffect } from 'react';
import { useGetAllReportsByShopQuery } from '../../service/reportService';

const ReportListById = ({ shopId }) => {
    // Manage the page number and page size for pagination
    const [page, setPage] = useState(1);
    const pageSize = 10; // You can adjust the size per your requirement

    // Fetch reports for a specific shop
    const { data, error, isLoading } = useGetAllReportsByShopQuery({
        shopId,  // Corrected to use shopId as per API modification
        page,
        size: pageSize
    });

    useEffect(() => {
        // This effect could be used for additional operations if necessary.
    }, [shopId, page]);

    // Handle loading, error, and display data
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading reports: {error.message}</div>;
    }

    // Check if there's data and render
    if (data && data.reports) {
        return (
            <div>
                <h2>Reports for Shop {shopId}</h2>
                <table>
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Report Type</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.reports.map((report) => (
                        <tr key={report.id}>
                            <td>{report.user}</td>
                            <td>{report.type}</td>
                            <td>{report.status}</td>
                            <td>{report.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div>
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page}</span>
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={!data.hasNextPage}  // Use hasNextPage if available in the API response
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }

    return <div>No data available</div>; // Show message if no data
};

export default ReportListById;
