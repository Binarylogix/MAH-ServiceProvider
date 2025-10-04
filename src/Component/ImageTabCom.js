import React from 'react';
import { Image } from 'react-native';

export default function ImageTabCom({ Source, focused, size = 25 }) {
    return (
        <Image
            source={imageSource}
            style={{
                width: size,
                height: size,
                tintColor: focused ? 'blue' : 'gray',
            }}
            resizeMode="contain"
        />
    );
}
