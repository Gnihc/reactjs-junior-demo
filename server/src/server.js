const allowedFileExtensions = require("../../client/public/allowedImageExtension.js")
const app = require("express")()
const bodyParser = require('body-parser');
const db = require("../models")
const multer = require('multer');
const { Op } = require("sequelize")
const crypto = require("crypto")  
const fs = require("fs")
const path = require("path")

const { Image } = require("../models");


const publicDirectory = "../client/public"
const rawAttributes = Image.rawAttributes

const ImageGetLimit = 5;

function validNumber(str) {
  const num = parseInt(str);
  return num != null && !isNaN(num) && num || null;
}

const jsonParseMiddle = bodyParser.json();
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/',storage : storage  });
const uploadPath = path.join(publicDirectory,"uploads/");
console.log(allowedFileExtensions);

db.sequelize.sync().then(() => {

  app.post("/submitImage", upload.single('file'), async (req, res) => {
    const topic = req.body.topic;
    try {
      const file = req.file;
      const extension = file.mimetype.split("/")[1];
      console.log("topic: ",topic);
      if (allowedFileExtensions.find((allowedExtension)=>allowedExtension===extension) == null){
        throw new Error('unsupportedfile')
      }
      const fileName = `uploads/${crypto.randomUUID()}.${extension}`;
      await fs.writeFile(path.join(publicDirectory,fileName), file.buffer, (err) => {
        console.log(err)
      })
      
      Image.create({
        [rawAttributes.ImageURL.fieldName] : fileName,
        "Topic": topic
      }).catch((err) => {
        if (err) console.log(err);
        fs.unlink(path.join(publicDirectory,fileName));
        return;
      });

      res.status(200).json({ success: true });
    }
    catch (err) {
      console.log(err)
      res.status(400).json({ success: false,err: err })
    }
  })

  app.post("/likeImage", jsonParseMiddle, async (req, res) => {
    let imageId = req.query.imageId;
    if (imageId == null || isNaN(imageId)) {
      res.status(400)
      res.end("Error: missing or invalid imageId")
      return;
    }

    const image = await Image.findByPk(imageId)
    if (image != null) {
      try {
        await image.increment('Likes', { by: 1 });
        res.status(200)
        res.send(image.Likes.toString());
      }
      catch (error) {
        console.log(error)
      }
    }
    res.status(400)
  })
  app.get("/imageDetail", jsonParseMiddle, (req, res) => {
    const imageId = req.query.id;
    if (!validNumber(imageId)) {
      res.status(400)
      res.end("Error: missing or invalid id")
      return;
    }

    Image.findOne({
      where: { id: imageId }
    }
    ).then((Images) => {
      res.send(Images);
    }).catch((err) => {
      if (err) console.log(err);
      return;
    });
  })
  app.get("/api", jsonParseMiddle, (req, res) => {
    const page = validNumber(req.query.page || 1);
    const starting = validNumber(req.query.starting);
    const popular = validNumber(req.query.popular);
    const topicQuery = req.query.topic
    if (!page) {
      res.status(400)
      res.end("Error: invalid page")
      return;
    }

    const startingCondition = !!starting & {
      [Op.gt]: starting - 1
    }
      || {
      [Op.not]: null
    }

    const orderCondition = !!popular && popular === 1 && [
      [rawAttributes.Likes.fieldName, "DESC"],
      [rawAttributes.id.fieldName, "DESC"]
    ] || [[rawAttributes.id.fieldName, "DESC"]]

    console.log(startingCondition);
    Image.findAll({
      order: orderCondition, where: {
        [rawAttributes.id.fieldName]: startingCondition,
        [rawAttributes.Topic.fieldName]: topicQuery || {[Op.not]: null}
      }, limit: ImageGetLimit, offset: (page - 1) * ImageGetLimit
    }).then((Images) => {
      res.send(Images);
    }).catch((err) => {
      if (err) console.log(err);
      return;
    });
  })

  app.get("/insert", (req, res) => {
    Image.create({
    }).catch((err) => {
      if (err) console.log(err);
      return;
    }).then((user) => {
      res.send(user)
    });
  })

  app.get("/nuke", (req, res) => {
    Image.destroy({
      where: {}
    })
 
    fs.readdir(uploadPath, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        fs.unlink(uploadPath, (err) => {
          if (err) throw err;
        });
      }
    });
    res.end("nuked database")
  })

  app.listen(5000, () => { console.log("Server started on port 5000") })
})


