import React from 'react'
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconSearch from 'react-native-vector-icons/Ionicons';
import IconRestaurant from 'react-native-vector-icons/Ionicons';
import IconHotel from 'react-native-vector-icons/MaterialIcons';
import IconClock from 'react-native-vector-icons/Entypo';
import IconLocation from 'react-native-vector-icons/Entypo';
import IconGas from 'react-native-vector-icons/MaterialIcons';
import IconCoffee from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './ItemInfoStyle';
import PlaceAutoComplete from '../../home/GoogleMapInput/index';
import { ScrollView } from 'react-native-gesture-handler';
import MyService from "../../../api/MyService";

const KEY = "AIzaSyBUlVo1hI6x58Zp3w1uvKDag5H4HqIuINE"
export default class ItemInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.state.params.data,
    }
  }
  getRating = (rating) => {
    var i = 0;
    var arr = [];
    for (i = 0; i < rating; i++) {
      arr.push(
        <IconClock name="star" size={14} style={{ marginRight: 5, color: "#006805" }} />
      )
    }
    return arr;
  }

  render() {
    var { data } = this.state;
    var i = 0;
    return (
      <View style={styles.container}>
        <View
          style={styles.header}>
          <Icon name="ios-arrow-round-back"
            size={34}
            style={{ width: "15%", color: "#ffff" }}
            onPress={() => { this.props.navigation.goBack() }} />
          <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "600" }}>Kết quả tìm kiếm</Text>
        </View>
        {/* String url = https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=PHOTOREF&key=YOUR_API_KEY */}

        <FlatList
          data={data}
          renderItem={
            ({ item }) =>
              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row", alignItems: "center", height: 110, paddingLeft: 15, paddingRight: 15 }}>
                  <View style={{ flex: 3 }}>
                    <Image
                      style={{ width: 90, height: 90, borderRadius: 3 }}
                      source={{
                        uri: (item.photos) ?
                          'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1500&photoreference=' + item.photos[0].photo_reference + '&key=' + KEY
                          : 'https://facebook.github.io/react-native/docs/assets/favicon.png'
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: "column", marginLeft: 10, flex: 7 }}>
                    <Text numberOfLines={2} style={{ fontSize: 18, fontWeight: "500", color: "#000" }}>{item.name}</Text>
                    {(item.rating) &&
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {this.getRating(Math.round(item.rating))}
                        <Text  >({Math.round(item.rating)} sao / {item.user_ratings_total} đánh giá)</Text>
                      </View>
                    }
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <IconLocation name="location-pin" size={14} style={{ marginRight: 10 }} />
                      <Text numberOfLines={1}>{item.vicinity}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <IconClock name="clock" size={14} style={{ marginRight: 10 }} />
                      {(item.opening_hours) ?
                        <Text numberOfLines={1} style={{ color: "green" }}>Mở cửa</Text> :
                        <Text numberOfLines={1} style={{ color: "red" }}>Đóng cửa</Text> 
                      }
                    </View>

                  </View>

                </View>
                <View style={{ backgroundColor: "#bcbcbc", height: 1 }}></View>

              </View>
          }
        />
      </View>
    )
  }
}




