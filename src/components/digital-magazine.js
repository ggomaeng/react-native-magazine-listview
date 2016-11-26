/**
 * Created by ggoma on 2016. 11. 25..
 */
import Exponent from 'exponent';
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Image,
    Dimensions,
    ListView,
    StyleSheet
} from 'react-native';

const {width, height} = Dimensions.get('window');
const midpoint = width / 2;

export default class DigitalMagazine extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            dataSource: ds.cloneWithRows(props.items),
            opacity: new Animated.Value(1),

            images: props.images.reverse(), //to stack the images in right order
            opacity_values : props.images.map(() => {
                return new Animated.Value(1)
            }),
            text_opacity : props.images.map(() => {
                return new Animated.Value(1)
            }),
        };

        this.page = props.images.length - 1; //backwards
        this.offset = 0;
        this._renderRow = this._renderRow.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

    }



    _renderRow(row) {
        var {page, publisher, title, author, highlight, color} = row;

        return (
            <View style={{height, width, justifyContent: 'center', alignItems: 'center'}}>

                <View style={{position:'absolute', bottom: 16, margin: 16,
                backgroundColor: 'white', height: 200, width: width - 32}}>
                    <Animated.View style={{flex: 1, opacity: this.state.text_opacity[page]}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{backgroundColor: color, padding: 10, marginLeft: 24}}>
                                <Text style={{fontSize: 12, color: 'white', fontWeight: '800'}}>{publisher}</Text>
                            </View>
                        </View>

                        <View style={{flex: 1, padding: 24, paddingTop: 10, paddingBottom: 0}}>
                            <Text style={{fontSize: 20, fontWeight: '900',}}>
                                <Text style={{color: color}}>{highlight}</Text>{title}
                            </Text>
                        </View>

                        <View style={{padding: 24}}>
                            <Text style={{fontSize: 16, fontFamily:'cursive', fontStyle: 'italic'}}>
                                {author}
                            </Text>
                        </View>

                    </Animated.View>

                </View>
                <View style={{padding: 5, transform: [{rotate: '45deg'}],
                        backgroundColor: 'white', position: 'absolute', bottom: 6, left: width/2 - 16}}>
                    <View style={{ height: 10, width: 10, backgroundColor: color}} />
                </View>


            </View>
        )
    }


    handleScroll (event) {
        var e = event.nativeEvent;

        var currentOffset = e.contentOffset.x;
        var offset_ratio = (currentOffset / width);
        if(currentOffset > this.offset) {
            if(!Number.isInteger(offset_ratio) && offset_ratio > 0 ) {
                var page = Math.floor(offset_ratio);
                // console.log('scrolling right on page', page);
                var stack = Math.abs(page - this.state.opacity_values.length + 1);
                // console.log('position on stack', stack);
                //make current slide fade to 0
                if(stack != 0) { //check last page
                    this.state.opacity_values[stack].setValue(Math.abs((currentOffset - ( width * (page +1) )) / width));
                    //set current page to 0
                    this.state.text_opacity[page].setValue(Math.abs((currentOffset - ( width * (page +1) )) / width));
                    //set next page to 1 from 0
                    this.state.text_opacity[page + 1].setValue(Math.abs((currentOffset - ( width * (page) )) / width));
                }
            }
        } else {
            if(!Number.isInteger(offset_ratio) && offset_ratio > 0) {
                var page = Math.ceil(offset_ratio);
                // console.log('scrolling left on page', page);
                var stack = Math.abs(page - this.state.opacity_values.length + 1);
                // console.log('position on stack', stack);
                if(this.state.opacity_values[stack + 1] != null && page < this.state.opacity_values.length) {
                    //make previous slide fade to 1 -- remember, here uses math.ceil
                    this.state.opacity_values[stack + 1].setValue(Math.abs(currentOffset - ( width * page )) / width);
                    //set left page to 1
                    this.state.text_opacity[page - 1].setValue(Math.abs((currentOffset - ( width * (page) )) / width));
                    //set current page from 1 to 0
                    this.state.text_opacity[page].setValue(Math.abs(currentOffset - (width * (page-1) )) / width);

                }
            }
        }
        this.offset = currentOffset;

    }

    renderImages() {

        var {images, opacity_values} = this.state;

        return images.map((image, i) => {
              return <Animated.Image key={i} style={[styles.img, {opacity: opacity_values[i]}]} source={images[i]}/>
        })


    }


    render() {

        var {images, page, opacity} = this.state;
        return (
            <View style={{flex: 1}}>
                {this.renderImages()}
                <View style={{position:'absolute'}}>
                    <ListView
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={this.handleScroll}
                        horizontal={true}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                    />
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    img: {
        width: width,
        height: height,
        position: 'absolute',
    }
})