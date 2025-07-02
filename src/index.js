import express from 'express'
import { PORT } from './config/env.js'
import routes from './routes/allRoutes.js';

const app = express();

//Rutas de la api
app.use('/api', routes);

//Ruta main
app.get("/", (req, res) => {
    res.send('📚 API Biblioteca en línea');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Express en http://localhost:${PORT}`);
});