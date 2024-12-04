import { View, Text, Image } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'

const Header = () => {
    const {user}=useUser();
    //console.log(user.fullName)
  return (
    <View style={{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }}>
        <View>
            <Text style={{
                fontFamily:'outfit',
                fontSize:15
            }}>Welcome</Text>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:20
            }}>{user?.fullName}</Text>
        </View>
        <Image source={{uri:user?.imageUrl}}
        style={{
            width:40,
            height:40,
            borderRadius:99
        }}/>
    </View>
  )
}
export default Header;