import * as services from '../services/statistics.service'

export const getGeneralStatistics = async (req, res) => {
  try {
    const response = await services.getGeneralStatisticsService()
    return res.status(200).json(response)

  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'fail at statistics controller: ' + error
    })
  }
}

export const getRevenueByMonthAndYear = async (req, res) => {
  const { year, month } = req.query;
  const id = req.user.id

  try {
    const response = await services.getRevenueByMonthAndYearService({ year, month }, id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      err: -1,
      msg: 'Fail at revenue Controller: ' + error.message,
    });
  }
};