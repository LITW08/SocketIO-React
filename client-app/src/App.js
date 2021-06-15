import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { PieChart } from 'react-minimal-pie-chart';
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


const map = new Map();

const getColorForAge = age => {
    const ageS = age.toString();
    if(map.has(ageS)) {
        return map.get(ageS);
    }

    const color = getRandomColor();
    map.set(ageS, color);
    return color;
}

const App = () => {

    const [socket, setSocket] = useState(null);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('message_from_server', data => {
            console.log(data);
        });

        socket.on('new_person', data => {
            setPeople(people => [...people, data.person]);
        });

        setSocket(socket);
    }, []);

    const onButtonClick = () => {
        socket.emit('client_message', { message: 'Hello from React!!' });
    }

    const groupPeople = (people) => {
        const grouped = groupBy(people, p => {
            let { age } = p;
            age--;
            const mod10 = age % 10;
            const bottom = age - mod10;
            return bottom + 1;
        });

        return Object.keys(grouped).map(key => {
            return {
                title: `(${key} - ${+key + 9}) [${grouped[key].length}]`,
                value: grouped[key].length,
                color: getColorForAge(key)
            }
        })
    }

    const data = groupPeople(people);
    return (
        <div className='container'>
            <div className='row'>
                <h1>Hello React!</h1>
                <h3>Current person count {people.length}</h3>
                <button className='btn btn-primary' onClick={onButtonClick}>Send message to server</button>


            </div>
            <div className="row mt-5">
                <div className="col-md-6 offset-md-3" style={{ height: 400 }}>
                    <PieChart
                        data={data}
                    />;
                </div>
            </div>
            <div className="row">
                {orderBy(data, d => -d.value).map(({title, color}) => <h3 style={{color}}>{title}</h3>)}
            </div>
        </div>
    )
}

export default App;