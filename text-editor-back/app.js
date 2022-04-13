const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const { 
    isSectionBusy, 
    writeToSection, 
    setSectionBusy, 
    freeSection, 
    listenToSection, 
    listenToSectionState,
    purgeSection
} = require('./connection/editor');
const { users } = require('./connection/helpers');

const app = express();
const router = express.Router();
const server = require('http').Server(app);


const socketIO = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

const textSocket = socketIO.of('/text');


const sections = ["section1", "section2"];
for (let section of sections){
    purgeSection(section);
    freeSection(section);
}
    
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', router);


router.route('/register').post((req, res) => {
    const { user } = req.body;
    for (let section of sections) {
        listenToSection(section, content => {
            const obj = {
                section,
                content
            };
            textSocket.emit(user + "/content", JSON.stringify(obj));
        });
        listenToSectionState(section, state => {
            const obj = {
                section,
                state,
            };
            textSocket.emit(user + "/state", JSON.stringify(obj));
        })
    }
    console.log(user + " has connnected to the server!");
    res.json({ status: "ok", statusCode: 200 });
});

router.route('/write').post((req, res) => {
    const { user, section, content } = req.body;
    setSectionBusy(section, user);
    writeToSection(content, section);
    res.json({ status: 200 });
})

router.route('/free').post((req, res) => {
    const { section } = req.body;
    freeSection(section);
    res.json({ status: 200 });
})



server.listen(5555,
    () => {
        console.log('Running at at localhost:5555')
    }
)