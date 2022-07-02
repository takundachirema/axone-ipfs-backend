import bookRoutes from './controllers/books/routes.js'
import chapterRoutes from './controllers/chapters/routes.js'

export function registerRoutes(app) {
    app.use('/api', bookRoutes);
    app.use('/api', chapterRoutes);
}
