import React from "react";
import { Platform, View, Text, Pressable } from "react-native";
import RNDateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { mergeClassNames } from "@/utils/TailwindUtils";
import { textColors } from "@/constants/TailwindClassNameConstants";

interface DateTimePickerProps {
    currentDate: Date;
    onChange: (date: Date) => void;
}

const AndroidDateTimePicker = ({ currentDate, onChange }: DateTimePickerProps) => {
    const showDateTimePicker = () => {
        DateTimePickerAndroid.open({
            value: currentDate,
            onChange(_, date?: Date) {
                onChange(date || new Date());
            },
            mode: "date",
        });
    };
    return (
        <View>
            <Text
                className={mergeClassNames("font-base-regular text-lg", textColors)}
                numberOfLines={1}
            >
                {currentDate.toLocaleDateString()}
            </Text>
            <Pressable
                className='flex flex-row items-center justify-center bg-light-secondary-150 dark:bg-dark-secondary-800 p-3 rounded-lg'
                onPress={showDateTimePicker}
            >
                <Text className={mergeClassNames("font-base-regular text-lg", textColors)}>
                    Open Calendar
                </Text>
            </Pressable>
        </View>
    );
};

const IOSDateTimePicker = ({ currentDate, onChange }: DateTimePickerProps) => {
    return (
        <View>
            <RNDateTimePicker
                className='flex self-start'
                accentColor='black'
                maximumDate={new Date()}
                value={currentDate}
                mode='date'
                display='default'
                onChange={(_, date?: Date) => onChange(date || new Date())}
            />
        </View>
    );
};

const DateTimePicker = (props: DateTimePickerProps) => {
    if (Platform.OS === "android") {
        return <AndroidDateTimePicker {...props} />;
    }
    if (Platform.OS === "ios") {
        return <IOSDateTimePicker {...props} />;
    }
    return null;
};

export default DateTimePicker;
