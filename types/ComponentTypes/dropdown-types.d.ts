import "react-native-dropdown-picker";
import { DropDownPickerProps as RNDropDownPickerProps } from "react-native-dropdown-picker";

declare module "react-native-dropdown-picker" {
    export interface DropDownPickerProps<T> extends RNDropDownPickerProps<T> {
        className?: string;
        containerClassName?: string;
        textClassName?: string;
        labelClassName?: string;
        placeholderClassName?: string;
        dropDownContainerClassName?: string;
        listItemLabelClassName?: string;
        listItemContainerClassName?: string;
        selectedItemLabelClassName?: string;
        selectedItemContainerClassName?: string;
        arrowIconClassName?: string;
        tickIconClassName?: string;
        searchContainerClassName?: string;
        searchTextInputClassName?: string;
        flatListContainerClassName?: string;
        modalContentClassName?: string;
        modalContentContainerClassName?: string;
        scrollViewContainerClassName?: string;
        disabledClassName?: string;
        badgeClassName?: string;
        badgeTextClassName?: string;
        badgeDotClassName?: string;
        arrowIconContainerClassName?: string;
        closeIconClassName?: string;
        closeIconContainerClassName?: string;
    }
}
