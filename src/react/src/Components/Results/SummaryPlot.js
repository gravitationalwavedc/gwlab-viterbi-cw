import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';


const SummaryPlot = ({data}) => <>
    <h4>Viterbi Path of Best Candidate</h4>
    <ResponsiveContainer width={'100%'} height={400}>
        <LineChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 50,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="time"
                type='number'
                domain={['auto', 'auto']}
                label={{ 
                    value: 'Time (s)',
                    position: 'bottom'
                }}
            />
            <YAxis
                dataKey="frequency"
                type='number'
                domain={['auto', 'auto']}
                label={{
                    value: 'Frequency (Hz)',
                    position: 'left',
                    angle: -90,
                    offset: 50,
                    style: {textAnchor: 'middle'}
                }}
            />
            <Tooltip />
            <Line type="monotone" dataKey="frequency" stroke="#8884d8"/>
        </LineChart>
    </ResponsiveContainer>
</>;

export default SummaryPlot;