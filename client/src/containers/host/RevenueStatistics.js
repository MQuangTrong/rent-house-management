import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import * as services from "../../services";

const RevenueStatistics = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [selectedView, setSelectedView] = useState("month");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await services.apiGetRevenueStatistic(year, selectedView === "month" ? month : null);

      setTotalRevenue(response.totalRevenue);

      if (
        (selectedView === "month" && (!response.dailyData || response.dailyData.length === 0)) ||
        (selectedView === "year" && (!response.monthlyData || response.monthlyData.length === 0))
      ) {
        setErrorMessage("Không có dữ liệu cho thời gian này.");
        setChartData([]);
        return;
      }

      const data = [["Thời gian", "Doanh thu"]];
      const detailData = selectedView === "month" ? response.dailyData : response.monthlyData;
      detailData?.forEach(([time, revenue]) => {
        data.push([`${time}`, revenue]);
      });
      setChartData(data);
    } catch (error) {
      console.error("Error fetching revenue data:", error.message);
      setErrorMessage("Lỗi khi tải dữ liệu doanh thu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedView, year, month]);

  return (
    <div className="p-4">
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Thống Kê Doanh Thu</h1>

        <div className="mb-8">
          <label className="text-xl font-semibold mr-4">Chọn xem theo:</label>
          <select
            className="p-2 bg-gray-700 text-white rounded mr-4"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
          {selectedView === "month" && (
            <input
              type="number"
              className="p-2 bg-gray-700 text-white rounded mr-4"
              value={month}
              min="1"
              max="12"
              onChange={(e) => setMonth(e.target.value)}
            />
          )}
          <input
            type="number"
            className="p-2 bg-gray-700 text-white rounded"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : errorMessage ? (
          <div className="text-red-500">{errorMessage}</div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Tổng doanh thu</h3>
              <p className="text-lg">Tổng doanh thu: {totalRevenue.toLocaleString()} VND</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {selectedView === "month" ? "Doanh thu theo ngày" : "Doanh thu theo tháng"}
              </h3>
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={chartData}
                options={{
                  title: selectedView === "month" ? "Doanh thu theo ngày" : "Doanh thu theo tháng",
                  curveType: "function",
                  legend: { position: "bottom" },
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueStatistics;
