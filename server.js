import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";



const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const Location_API_URL = "https://ipgeolocation.abstractapi.com/v1/?api_key=be3dcbb572de40e0940377dfa1c725c8";
const Weather_API_URL = "https://api.weatherapi.com/v1/current.json?key=6542d139cde9494dba292108231810 &q="



app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




mongoose.connect("mongodb+srv://HonGrandPa:123@cluster0.suriwcf.mongodb.net/?retryWrites=true&w=majority");



// const listSchema = {

//     //listname
//     name: String,
//     //array of task docu
//     tasks: [itemSchema]
// }

// const List = mongoose.model("List", listSchema);

const itemSchema = {

    name: String
};

const response = await axios.get(Location_API_URL);
const responseData = response.data.ip_address;
console.log("user id:" + responseData)

const Task = mongoose.model(`Task${responseData}`, itemSchema);

// Process the responseData here


//const Task = mongoose.model("Task", itemSchema);


const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wedesday",
    "Thursday",
    "Friday",
    "Saturday"
]

const defaultTaskFromHon = new Task({ name: `Happy ${weekday[new Date().getDay()]} From HonGrandPa` })


//varible to track daytime 
let day = "day";

//obtain client latitude and longtitude
const response_location = await axios.get(Location_API_URL);
console.log("Latitude: " + response_location.data.latitude + " Longtitude: " + response_location.data.longitude);

//get the weather condition where client lives
const response_weather = await axios.get(Weather_API_URL + `${response_location.data.latitude},${response_location.data.longitude}`);



//icons' address
console.log(response_weather.data.current.condition.icon);
const iconAddress = response_weather.data.current.condition.icon;
//this is the path to retrieve the icon from the folder
const iconInfo = iconAddress.slice(35, 48);
console.log(iconInfo);



app.get("/", async (req, res) => {

    try {

        //look for the stored tasks from the DB
        const storedTasks = await Task.find()

        console.log(storedTasks)


        //check if DB is empty 
        if (storedTasks.length === 0) { //if it is empty storedDefu message


            defaultTaskFromHon.save()

                .then(result => {
                    console.log("Insert Success")
                })
                .catch(error => {

                    console.err("Eroor inserting")
                });

            res.redirect("/");

        } else {


            res.render(__dirname + "/view/index.ejs", {


                icon: iconInfo,

                tasks: storedTasks

            });


        }


    } catch (err) {

        console.log(err);

    }


})



app.post("/submit", (req, res) => {


    //console.log(req.body);

    const newTaskName = req.body.newTask

    const s = newTaskName.toString();

    console.log("input: " + s)

    const newTask = new Task({
        name: newTaskName
    });

    newTask.save()


        .then(result => {

            console.log("Insert Success")
            res.redirect("/");
        })
        .catch(error => {

            console.err("Eroor inserting")
            res.redirect("/");
        });


});


/// the drop and delete function
app.post("/delete", (req, res) => {


    const checkID = req.body.taskId

    //check if clent decito use drop function or not
    //if no -> complete
    if (!checkID) {

        const id = req.body.checkbox

        console.log("Complete ID: " + id)


        Task.findByIdAndDelete(id)

            .then(result => {

                console.log("Complete Success")

            })
            .catch(error => {

                console.log("Eroor Complete")
            });

    } else {

        console.log("Drop ID :" + checkID)

        Task.deleteOne({ _id: checkID })

            .then(result => {

                console.log("Drop Success");

            })
            .catch(error => {

                console.log("Eroor drop");
            });

    }


})


//upcomming fuctionality
// app.get("/:custom", (req, res) => {

//     const customeListName = req.params.custom;


//     const list = new List {


//         name: customeListName,
//         item : defaultTaskFromHon
//     }

//     list.save();

//    const found = await List.findOne({nmae:customeListName})


//   if (found) {

//     res.render(__dirname + "/view/index.ejs", {


//         icon: iconInfo,

//         tasks: storedTasks

//     });

//   } else {



//     const list = new List {


//         name: customeListName,
//         item : defaultTaskFromHon
//     }

//     list.save();
//     //does not exit

//   }




//     list.save();

// })


app.listen(process.env.PORT || port, (err) => {

    if (err) {

        console.log(err)
    } else {

        console.log("connected")
    }
})