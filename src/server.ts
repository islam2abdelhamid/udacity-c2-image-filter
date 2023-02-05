import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredimage", async ( req, res ) => {
    const { image_url } = req.query as { image_url: string };

    if ( !image_url ) {
      return res.status(400).send(`image_url is required`);
    }

    filterImageFromURL(image_url).then((filteredpath) => {
      res.status(200).sendFile(filteredpath, () => {
        deleteLocalFiles([filteredpath]);
      });

    }).catch((error) => {
      console.log(error);
    }
    );
  } );


  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
