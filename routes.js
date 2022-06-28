import bookRoutes from './controllers/books/routes'
import chapterRoutes from './controllers/chapters/routes'

export function registerRoutes(app) {
    app.use('/api', bookRoutes);
    app.use('/api', chapterRoutes);
}
