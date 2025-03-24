import React, { useState, useEffect } from "react";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { cssInterop } from "nativewind";

interface DropdownPickerProps<T extends ValueType> {
    items: Array<{ label: string; value: T }>;
    selectedValue: T;
    onValueChange: (value: T) => void;
    placeholderText?: string;
    isFocusedPlaceholderText?: string;
    [key: string]: any; // For additional props
}

// Make component generic with type parameter
const DropdownPicker = <T extends ValueType>({
    items,
    selectedValue,
    onValueChange,
    placeholderText = "Select Item",
    isFocusedPlaceholderText = "...",
    ...props
}: DropdownPickerProps<T>) => {
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
};

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

export default DropdownPicker;

// usage:
{
    /* <DropdownPicker
    className={mergeClassNames(
        "flex-1 px-3 rounded-md h-12 tracking-wide text-lg font-base-semibold leading-tight",
        textColors,
        placeholderColors
    )}
    containerClassName='mb-2'
    textClassName='text-base font-base-medium'
    placeholderClassName={mergeClassNames(
        "text-lg font-base-semibold",
        placeholderTextColors
    )}
    dropDownContainerClassName={mergeClassNames(
        "border border-gray-300 rounded-lg",
        placeholderColors
    )}
    listItemLabelClassName='text-base font-base-medium'
    listItemContainerClassName='py-2'
    selectedItemLabelClassName='text-base font-medium text-light-primary-400 dark:text-dark-primary-500'
    tickIconClassName='text-base font-medium'
    items={[
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" },
        { label: "Option 3", value: "3" },
        { label: "Option 4", value: "4" },
        { label: "Option 5", value: "5" },
        { label: "Option 6", value: "6" },
    ]}
    selectedValue={formData.category}
    onValueChange={(value) => {
        console.log("here", value);
        handleInputChange("category", value);
    }}
    placeholderText='Select a category'
/> */
}
