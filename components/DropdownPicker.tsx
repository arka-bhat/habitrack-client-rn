import { cssInterop } from "nativewind";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";

// Define interface for your component props
interface DropdownPickerProps<T extends ValueType> {
    items: Array<{ label: string; value: T }>;
    selectedValue: T;
    onValueChange: (value: T) => void;
    placeholderText?: string;
    isFocusedPlaceholderText?: string;
    [key: string]: any; // For additional props
}

cssInterop(DropdownPicker, {
    className: "style",
    containerClassName: "containerStyle",
    textClassName: "textStyle",
    labelClassName: "labelStyle",
    placeholderClassName: "placeholderStyle",
    dropDownContainerClassName: "dropDownContainerStyle",
    listItemLabelClassName: "listItemLabelStyle",
    listItemContainerClassName: "listItemContainerStyle",
    selectedItemLabelClassName: "selectedItemLabelStyle",
    selectedItemContainerClassName: "selectedItemContainerStyle",
    arrowIconClassName: "arrowIconStyle",
    tickIconClassName: "tickIconStyle",
    searchContainerClassName: "searchContainerStyle",
    searchTextInputClassName: "searchTextInputStyle",
    flatListContainerClassName: "flatListContainerStyle",
    modalContentClassName: "modalContentContainerStyle",
    modalContentContainerClassName: "modalContentContainerStyle",
    scrollViewContainerClassName: "scrollViewContentContainerStyle",
    disabledClassName: "disabledStyle",
    badgeClassName: "badgeStyle",
    badgeTextClassName: "badgeTextStyle",
    badgeDotClassName: "badgeDotStyle",
    arrowIconContainerClassName: "arrowIconContainerStyle",
    closeIconClassName: "closeIconStyle",
    closeIconContainerClassName: "closeIconContainerStyle",
});

// Make component generic with type parameter
function DropdownPicker<T extends ValueType>({
    items,
    selectedValue,
    onValueChange,
    placeholderText = "Select Item",
    isFocusedPlaceholderText = "...",
    ...props
}: DropdownPickerProps<T>) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<T | null>(selectedValue);
    const [itemsList, setItemsList] = useState(items);

    // Ensure the component's state updates when selectedValue changes externally
    useEffect(() => {
        setValue(selectedValue);
    }, [selectedValue]);

    // Ensure items list is updated if passed items change
    useEffect(() => {
        setItemsList(items);
    }, [items]);

    return (
        <DropDownPicker
            closeAfterSelecting
            dropDownDirection='DEFAULT'
            listMode='SCROLLVIEW'
            placeholder={open ? isFocusedPlaceholderText : placeholderText}
            open={open}
            setOpen={setOpen}
            items={itemsList}
            setItems={setItemsList}
            value={value}
            setValue={(val) => {
                if (typeof val === "function") {
                    setValue(val);
                } else {
                    setValue(val);
                    if (val !== null) {
                        onValueChange(val as T);
                    }
                }
            }}
            zIndex={1000}
            scrollViewProps={{
                nestedScrollEnabled: true,
                contentContainerStyle: { flexGrow: 1 },
            }}
            {...props}
        />
    );
}

export default DropdownPicker;
