// @flow

import React from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    PanResponder,
    Image
} from 'react-native';

import styles from './styles';

const { width } = Dimensions.get('window');

export default class ItemList extends React.PureComponent<{}> {
    constructor(props){
        super(props);

        this.gestureDelay = -35;
        this.scrollViewEnable = true;

        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx > 35) {
                    this.setScrollViewEnable(false);
                    let newX = gestureState.dx + this.gestureDelay;
                    position.setValue({ x: newX, y: 0 });
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < 150) {
                    Animated.timing(this.state.position, {
                        toValue: { x: 0, y: 0 },
                        duration: 500
                    }).start(() => {
                        this.setScrollViewEnable(true);
                    });
                }
                else {
                    Animated.timing(this.state.position, {
                        toValue: { x: width, y: 0 },
                        duration: 500
                    }).start(() => {
                        this.props.success(this.props.id);
                        this.setScrollViewEnable(true);
                    });
                }
            }
        });

        this.panResponder = panResponder;
        this.state = { position };
    }

    setScrollViewEnable(enable){
        if (this.scrollViewEnable !== enable) {
            this.props.setScrollEnable(enable);
            this.scrollViewEnable = enable;
        }
    }

    render(){
        return (
            <View style={styles.listItem}>
                <Animated.View 
                    style={[this.state.position.getLayout()]}
                    {...this.panResponder.panHandlers}
                >
                    <View style={styles.absoluteCell}>
                        <Text style={styles.absoluteCellText}>REJECT</Text>
                    </View>
                    <View style={styles.innerCell}>
                        <View style={styles.info}>
                            <Text>
                                {'Fee: ' + this.props.fee}
                            </Text>
                            <Text>
                                {'Size: ' + this.props.size}
                            </Text>
                            <Text>
                                {'Arrti: ' + this.props.attr}
                            </Text>
                        </View>
                        <View>
                            <Image
                                style={styles.image}
                                source={require('../../data/sampleSnapshot.png')}
                            />
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    }
}
