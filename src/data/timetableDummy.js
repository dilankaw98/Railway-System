const timetableDummyData = [
    {
        name: "Gampaha",
        timeTable:[
            {
                id:"1",
                trainName:"Train1",
                timeSlot:"08:00 AM",
                platForm:"1",
                ticketClassNo:[1,2,3],
                price:400,
            },
            {
                id:"2",
                trainName:"Train2",
                timeSlot:"12:00 PM",
                platForm:"2",
                ticketClassNo:[1,2],
                price:400,
            },
            {
                id:"3",
                trainName:"Train3",
                timeSlot:"04:00 PM",
                platForm:"3",
                ticketClassNo:[2],
                price:400,
            }
        ]
    },
    {
        name: "Kurunagala",
        timeTable:[
            {
                id:"4",
                trainName:"Train4",
                timeSlot:"08:30 AM",
                platForm:"1",
                ticketClassNo:[1,2,3],
                price:800,
            },
            {
                id:"5",
                trainName:"Train5",
                timeSlot:"01:00 PM",
                platForm:"3",
                ticketClassNo:[1,2],
                price:800,
            },
            {
                id:"6",
                trainName:"Train6",
                timeSlot:"05:00 PM",
                platForm:"2",
                ticketClassNo:[2],
                price:800,
            }
        ]
    },
    {
        name: "Jaffna",
        timeTable:[
            {
                id:"7",
                trainName:"Train7",
                timeSlot:"09:00 AM",
                platForm:"2",
                ticketClassNo:[1,2,3],
                price:1000,
            },
            {
                id:"8",
                trainName:"Train8",
                timeSlot:"02:00 PM",
                platForm:"3",
                ticketClassNo:[1,2],
                price:1000,
            },
            {
                id:"9",
                trainName:"Train9",
                timeSlot:"06:00 PM",
                platForm:"1",
                ticketClassNo:[2],
                price:1000,  
            }
        ]
    }]

export default timetableDummyData