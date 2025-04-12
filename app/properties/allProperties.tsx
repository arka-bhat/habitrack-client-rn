import React, { useCallback, useRef } from "react";
import { FlatList, View, Text } from "react-native";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import SwipeableItem, { LeftActionButton, RightActionButton } from "@/components/SwipeableItem";

const DATA = Array.from({ length: 50 }, (_, i) => ({
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    description: `Swipe me left or right #${i + 1}`,
}));

const SwipeableListScreen = () => {
    const swipeableRefs = useRef<Record<string, SwipeableMethods>>({});

    const handleArchive = useCallback((id: string) => {
        console.log("Archive", id);
    }, []);

    const handleDelete = useCallback((id: string) => {
        console.log("Delete", id);
    }, []);

    const getLeftActions = useCallback(
        (id: string) => (
            <View className='flex-row w-48'>
                <LeftActionButton
                    onClose={() => swipeableRefs.current[id]?.close()}
                    onAction={() => handleArchive(id)}
                    label='Archive'
                />
            </View>
        ),
        []
    );

    const getRightActions = useCallback(
        (id: string) => (
            <View className='flex-row w-48'>
                <RightActionButton
                    onClose={() => swipeableRefs.current[id]?.close()}
                    onAction={() => handleDelete(id)}
                    label='Delete'
                />
            </View>
        ),
        []
    );

    const renderItem = useCallback(
        ({ item }: { item: (typeof DATA)[0] }) => (
            <SwipeableItem
                id={item.id}
                leftActions={getLeftActions(item.id)}
                rightActions={getRightActions(item.id)}
                ref={(ref: SwipeableMethods) => {
                    if (ref) {
                        swipeableRefs.current[item.id] = ref;
                    } else {
                        delete swipeableRefs.current[item.id];
                    }
                }}
            >
                <View className='p-4 bg-white'>
                    <Text className='text-lg font-medium'>{item.title}</Text>
                    <Text className='text-gray-500 mt-1'>{item.description}</Text>
                </View>
            </SwipeableItem>
        ),
        []
    );

    return (
        <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews
            ItemSeparatorComponent={() => <View className='h-px bg-gray-200' />}
        />
    );
};

export default SwipeableListScreen;
