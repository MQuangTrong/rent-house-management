import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "./index";
import { RoomCard, SidebarRoom, Arrange, Pagination } from "../../components";
import * as service from "../../services";

const Room = () => {
    const [rooms, setRooms] = useState([]);
    const [roomsLasted, setRoomsLasted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [loadingLasted, setLoadingLasted] = useState(true); // Loading riêng cho roomsLasted
    const [errorLasted, setErrorLasted] = useState(null);

    const [sort, setsort] = useState("");
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;
    const roomsPerPage = 5;


    useEffect(() => {
        const fetchRoomsLasted = async () => {
            try {
                const response = await service.apiRoomLasted();
                if (response && response.data.err === 0) {
                    setRoomsLasted(response.data.result);
                } else {
                    setErrorLasted("Không có phòng");
                }
            } catch (err) {
                setErrorLasted("Đã xảy ra lỗi khi lấy dữ liệu.");
            } finally {
                setLoadingLasted(false);
            }
        };

        fetchRoomsLasted();
    }, []);

    // Lấy danh sách phòng dựa trên filter và sort
    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await service.apiRoomFilterSorted(filters, sort);
                if (response && response.data.err === 0) {
                    setRooms(response.data.result);
                } else {
                    setError("Không tìm thấy phòng trọ nào phù hợp.");
                }
            } catch (err) {
                setError("Đã xảy ra lỗi khi lấy phòng trọ.");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [filters, sort]);


    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const totalPages = Math.ceil(rooms.length / roomsPerPage);

    const handlePageChange = (pageNumber) => {
        setSearchParams({ page: pageNumber });
    };

    useEffect(() => {
        const sortParam = searchParams.get("sort") || "";
        setsort(sortParam);
    }, [searchParams]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Mượt mà khi cuộn
        });
    }, [currentPage]);

    return (
        <div className="space-y-4">
            <div className="w-full">
                <Search
                    onFilterChange={(newFilters) => {
                        setFilters(newFilters); // Cập nhật bộ lọc
                        setSearchParams((prevParams) => {
                            const newParams = new URLSearchParams(prevParams);
                            Object.entries(newFilters).forEach(([key, value]) => {
                                if (value) newParams.set(key, value);
                                else newParams.delete(key);
                            });
                            return newParams;
                        });
                    }}
                />
            </div>

            <div className="flex gap-4">
                <div className="w-3/4">
                    {loading ? (
                        <div className="text-center py-4">Đang tải dữ liệu...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-4">{error}</div>
                    ) : (
                        <div>
                            {currentRooms.length === 0 ? (
                                <div className="text-center py-4">Không có phòng nào.</div>
                            ) : (
                                currentRooms.map((room) => (
                                    <RoomCard key={room.id} room={room} />
                                ))
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
                <div className="w-1/4 mt-4">
                    <div>
                        <Arrange onSortChange={(value) => {
                            setsort(value);
                            setSearchParams((prevParams) => {
                                const newParams = new URLSearchParams(prevParams);
                                newParams.set('sort', value);
                                return newParams;
                            });
                        }} />
                        <div className="bg-secondary1 p-4 mt-4">
                            <p className="font-semibold text-lg mb-4">Phòng trọ mới nhất</p>
                            {loadingLasted ? (
                                <div className="text-center py-4">Đang tải dữ liệu...</div>
                            ) : errorLasted ? (
                                <div className="text-center text-red-500 py-4">{error}</div>
                            ) : (
                                roomsLasted.slice(0, 5).map((room) => (
                                    <SidebarRoom key={room.id} room={room} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;