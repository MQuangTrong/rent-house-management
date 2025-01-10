import authRouter from './auth'
import userRouter from './user'
import imageRouter from './image'
import insertRouter from './insert'
import roomRouter from './room'
import hostRouter from './host'
import bookingRouter from './booking'
import DistrictWardRouter from './district_ward'
import paymentRouter from './payment';
import blogRouter from './blog'
import statisticRouter from './statistic'
import appRouter from './app'

const initRoutes = (app) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/image', imageRouter)
    app.use('/api/v1/insert', insertRouter)
    app.use('/api/v1/room', roomRouter)
    app.use('/api/v1/host', hostRouter)
    app.use('/api/v1/booking', bookingRouter)
    app.use('/api/v1/payment', paymentRouter);
    app.use('/api/v1/blog', blogRouter);
    app.use('/api/v1/statistic', statisticRouter);
    app.use('/api/v1/app', appRouter);
    app.use('/api/v1/district-ward', DistrictWardRouter)

    return app.use('/', (req, res) => {
        res.send('server on ...')
    })
}

export default initRoutes