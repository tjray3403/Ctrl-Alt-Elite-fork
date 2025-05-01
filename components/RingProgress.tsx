import { View, Text } from 'react-native'
import React from 'react'
import * as Svg from 'react-native-svg';
import { Circle } from 'react-native-svg'; // Import Circle from react-native-svg

type RingProgressProps = {
    radius?: number;



};

const color = "#8dfa6a"

const RingProgress = ({radius = 50}: RingProgressProps) => {
  return (

    <View style={{ width: radius * 2, height: radius * 2, justifyContent: 'center', alignItems: 'center' }}>   
      <Svg.Svg>
        <Circle cx={radius} cy={radius} r={radius} fill={color} />
      </Svg.Svg>
    

    </View>
  )
}

export default RingProgress;