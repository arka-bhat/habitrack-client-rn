import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { useState } from "react";

const CustomRefreshControl = () => {
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 4000); // Force API refresh
    };

    return (
        <View>
            <Text>RefreshControl</Text>
            <ScrollView
                className='flex pt-2'
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ></ScrollView>
        </View>
    );
};

export default CustomRefreshControl;
