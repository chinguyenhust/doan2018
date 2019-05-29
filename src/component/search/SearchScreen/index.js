import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconSearch from 'react-native-vector-icons/Ionicons';
import IconRestaurant from 'react-native-vector-icons/Ionicons';
import IconHotel from 'react-native-vector-icons/MaterialIcons';
import IconATM from 'react-native-vector-icons/MaterialIcons';
import IconTravel from 'react-native-vector-icons/Entypo';
import IconGas from 'react-native-vector-icons/MaterialIcons';
import IconCoffee from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './SearchScreenStyle';
import PlaceAutoComplete from '../../home/GoogleMapInput/index';
import { ScrollView } from 'react-native-gesture-handler';
import MyService from "../../../api/MyService";
import img_restaurant from "../../../assets/restaurant.png";
import img_hotel from "../../../assets/hotel.png";
import img_bank from "../../../assets/bank.png";
import img_cafe from "../../../assets/cafe.png";
import img_camera from "../../../assets/camera.png";
import img_petrolimex from "../../../assets/petrolimex.png";

const KEY = "AIzaSyBUlVo1hI6x58Zp3w1uvKDag5H4HqIuINE"
export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      isAddress: false,
      latitude: "",
      longitude: "",
      type: "",
    }
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
  }

  handleSelectAddress(data, details) {
    this.setState({
      address: details.formatted_address,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      isAddress: true
    })
  }

  handleClickHotel = async () => {
    var userLocation = this.props.navigation.state.params.userLocation;
    if (this.state.address === "") {
      alert("Vui long nhap dia chi")
    } else {
      var param = {
        location: this.state.latitude + "," + this.state.longitude,
        type: "lodging",
        key: KEY,
        rankby: "distance"
      }
      var data = await MyService.getRequestData(param);
      console.log(param.location)
      console.log(data.results)
      this.props.navigation.navigate('ItemInfo', { 
        "data": data.results, 
        "userLocation": userLocation,
        "source": img_hotel
      })
    }
  }

  handleClickTravel = async () => {
    var userLocation = this.props.navigation.state.params.userLocation;
    if (this.state.address === "") {
      alert("Vui lòng nhập địa chỉ")
    } else {
      var param = {
        location: this.state.latitude + "," + this.state.longitude,
        type: "point_of_interest",
        key: KEY,
        rankby: "distance"
      }
      var data = await MyService.getRequestData(param);
      console.log(param.location)
      console.log(data)
      console.log(data.results)
      this.props.navigation.navigate('ItemInfo', { 
        "data": data.results, 
        "userLocation": userLocation,
        "source": img_camera
      })
    }
  }

  handleClickRestaurant = async () => {
    var userLocation = this.props.navigation.state.params.userLocation;
    if (this.state.address === "") {
      alert("Vui lòng nhập địa chỉ")
    } else {
      var param = {
        location: this.state.latitude + "," + this.state.longitude,
        type: "restaurant",
        key: KEY,
        rankby: "distance"
      }
      var data = await MyService.getRequestData(param);
      console.log(param.location)
      console.log(data)
      console.log(data.results)
      this.props.navigation.navigate('ItemInfo', { 
        "data": data.results, 
        "userLocation": userLocation,
        "source": img_restaurant
       })
    }
  }

  handleClickGas = async () => {
    var userLocation = this.props.navigation.state.params.userLocation;
    if (this.state.address === "") {
      alert("Vui lòng nhập địa chỉ")
    } else {
      var param = {
        location: this.state.latitude + "," + this.state.longitude,
        type: "gas_station",
        key: KEY,
        rankby: "distance"
      }
      var data = await MyService.getRequestData(param);
      console.log(param.location)
      console.log(data)
      console.log(data.results)
      this.props.navigation.navigate('ItemInfo', { 
        "data": data.results, 
        "userLocation": userLocation,
        "source": img_petrolimex
      })
    }
  }

  handleClickATM = async () => {
    var userLocation = this.props.navigation.state.params.userLocation;
    if (this.state.address === "") {
      alert("Vui lòng nhập địa chỉ")
    } else {
      var param = {
        location: this.state.latitude + "," + this.state.longitude,
        type: "atm",
        key: KEY,
        rankby: "distance"
      }
      var data = await MyService.getRequestData(param);
      console.log(param.location)
      console.log(data)
      console.log(data.results)
      this.props.navigation.navigate('ItemInfo', { 
        "data": data.results,
        "userLocation": userLocation ,
        "source": img_bank
      })
    }
  }

  handleClickCoffee = async () => {
    var userLocation = this.props.navigation.state.params.userLocation;
    if (this.state.address === "") {
      alert("Vui lòng nhập địa chỉ")
    } else {
      var param = {
        location: this.state.latitude + "," + this.state.longitude,
        type: "cafe",
        key: KEY,
        rankby: "distance"
      }
      var data = await MyService.getRequestData(param);
      console.log(param.location)
      console.log(data)
      console.log(data.results)
      this.props.navigation.navigate('ItemInfo', { 
        "data": data.results, 
        "userLocation": userLocation,
        "source": img_cafe
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={styles.header}>
          <Icon name="ios-arrow-round-back"
            size={34}
            style={{ width: "15%", color: "#ffff" }}
            onPress={() => { this.props.navigation.goBack() }} />
          {/* <IconSearch name="ios-search"
          style={{ fontSize: 24, color: "#ffffff", flex: 1 }}
          onPress={() => navigate("SearchScreen")}
        /> */}
          <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "600" }}>Tìm kiếm cơ bản</Text>
        </View>
        <ScrollView style={{ flex: 1, paddingLeft: 20, paddingRight: 20, flexDirection: "column" }}>
          <View style={{ justifyContent: "center", marginTop: 20, }}>
            <Text style={{ color: "#000000", fontSize: 22 }}>Bạn muốn đi đâu?</Text>
          </View>
          <PlaceAutoComplete handleSelectAddress={this.handleSelectAddress} />

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <Text style={{ color: "#000000", fontSize: 22 }}>Khám phá quanh đây</Text>
            <View style={{ flexDirection: "column", marginTop: 20, }}>
              <View style={{ flexDirection: "row", height: 90, marginBottom: 10, alignItems: "center" }}>
                <TouchableOpacity style={styles.item} onPress={this.handleClickHotel}>
                  <View style={{ flex: 3, justifyContent:"center" }}>
                    <IconHotel name="hotel" size={40} style={{ color: "#3b80ff" }} onPress={this.handleClickHotel} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>Khách sạn</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={this.handleClickRestaurant}>
                  <View style={{ flex: 3 , justifyContent:"center"}}>
                    <IconRestaurant name="ios-restaurant" size={40} style={{ color: "#ff5735" }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>Nhà hàng</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={this.handleClickTravel}>
                  <View style={{ flex: 3, justifyContent:"center" }}>
                    <IconTravel name="tripadvisor" size={40} style={{ color: "#6eff84" }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>Tham quan</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", height: 90 }}>
                <TouchableOpacity style={styles.item} onPress={this.handleClickATM}>
                  <View style={{ flex: 3,justifyContent:"center" }}>
                    <IconATM name="local-atm" size={40} style={{ color: "#a0e6ff" }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>ATM</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={this.handleClickGas}>
                  <View style={{ flex: 3 , justifyContent:"center" }}>
                    <IconGas name="local-gas-station" size={40} style={{ color: "#ffa215" }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>Trạm xăng</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={this.handleClickCoffee}>
                  <View style={{ flex: 3,justifyContent:"center" }}>
                    <IconCoffee name="coffee" size={40} style={{ color: "#ff1f22" }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>Coffee</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </ScrollView>

      </View>
    )
  }
}
