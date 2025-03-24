import { useEffect, useState, useRef } from "react";
import {
    Image,
    Keyboard,
    StatusBar,
    Text,
    TextInput,
    Pressable,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView, KeyboardProvider } from "react-native-keyboard-controller";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import {
    AsYouType,
    parsePhoneNumberFromString,
    CountryCode,
    getExampleNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

import { colors, mergeClassNames } from "@utils/TailwindUtils";
import { backgroundColors, textColors } from "@constants/TailwindClassNameConstants";
import CountryCodePicker from "@components/CountryCodePicker";
import I18nText from "@components/i18nText";

const PhoneNumberScreen = () => {
    const inputRef = useRef(null);

    const { colorScheme } = useColorScheme();
    const colorMode = colorScheme === "dark" ? "dark" : "light";

    const [countryCode, setCountryCode] = useState("+91");
    const [countryCodeISO, setCountryCodeISO] = useState<CountryCode>("IN");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [formattedNumber, setFormattedNumber] = useState("");
    const [maxLength, setMaxLength] = useState(20);

    useEffect(() => {
        // This will trigger a re-render of the CountryCodePicker
    }, [countryCode, countryCodeISO]);

    const formatPhoneNumber = (input: string, countryCodeISO: CountryCode) => {
        const phoneNumberFormatter = new AsYouType(countryCodeISO);
        const formattedNum = phoneNumberFormatter.input(input);
        setFormattedNumber(formattedNum.length < input.length ? input : formattedNum);
    };

    // Process phone input that might include country code
    const handlePhoneNumberChange = (input: string): void => {
        try {
            if (input.includes("+")) {
                const parsedNumber = parsePhoneNumberFromString(input);

                if (parsedNumber && parsedNumber.isValid()) {
                    const newCountryCode = "+" + parsedNumber.countryCallingCode;
                    const newCountryISO = parsedNumber.country as CountryCode;
                    const nationalNumber = parsedNumber.nationalNumber;

                    // Update states
                    setCountryCodeISO(newCountryISO);
                    setCountryCode(newCountryCode); // This triggers a re-render
                    setPhoneNumber(nationalNumber);

                    // Format the national number
                    const phoneNumberFormatter = new AsYouType(newCountryISO);
                    const formattedNum = phoneNumberFormatter.input(nationalNumber);
                    setFormattedNumber(formattedNum);

                    // Update max length
                    const examplePhoneNumber = getExampleNumber(newCountryISO, examples);
                    setMaxLength(
                        examplePhoneNumber?.formatNational().length ?? nationalNumber.length
                    );

                    return;
                }
            }

            // Regular case (no country code detected)
            setPhoneNumber(input);
            const examplePhoneNumber = getExampleNumber(countryCodeISO, examples);
            setMaxLength(examplePhoneNumber?.formatNational().length ?? 15);
            formatPhoneNumber(input, countryCodeISO);
        } catch (error) {
            console.log("Error processing phone number:", error);
            setPhoneNumber(input);
            formatPhoneNumber(input, countryCodeISO);
        }
    };

    const handleCountryCodeChange = (code: string, iso: CountryCode): void => {
        setCountryCode(code);
        setCountryCodeISO(iso);
        formatPhoneNumber(phoneNumber, iso); // Reformat the existing phone number with the new country code
    };

    const isPhoneNumberValid = (): boolean => {
        // Construct the full number for validation
        const fullNumber = countryCode + phoneNumber.replace(/\D/g, "");
        const phoneNumberObj = parsePhoneNumberFromString(fullNumber);

        if (phoneNumberObj && phoneNumberObj.isValid()) {
            console.log("Valid Phone Number:", phoneNumberObj.number);
            return true;
        } else {
            console.log("Invalid Phone Number");
            return false;
        }
    };

    const handleSendOTP = (): void => {
        if (!isPhoneNumberValid()) {
            alert("Phone number is Invalid");
        } else {
            router.navigate("/auth/otpInput");
        }
    };

    return (
        <SafeAreaView className={mergeClassNames("flex-1", backgroundColors)}>
            <StatusBar barStyle='default' />
            {/* Dismiss keyboard on tap */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardProvider>
                    <KeyboardAwareScrollView className='flex-1' bottomOffset={62}>
                        <View className='px-6 py-8 items-center justify-center'>
                            {/* Login Image */}
                            <View className='mt-2 mb-10 w-96 h-96 justify-center items-center'>
                                <Image
                                    source={{ uri: "https://picsum.photos/1920/1200" }}
                                    className='w-96 h-96 rounded-lg'
                                    resizeMode='contain'
                                />
                            </View>

                            {/* Login Text */}
                            <Text
                                className={mergeClassNames(
                                    "text-4xl font-base-bold mb-8",
                                    textColors
                                )}
                            >
                                HabiTrack
                            </Text>

                            {/* Phone Number Input */}
                            <View className='flex-row w-full mb-6'>
                                <CountryCodePicker
                                    key={countryCodeISO}
                                    selectedCode={countryCode}
                                    setSelectedCode={(code, iso) =>
                                        handleCountryCodeChange(code, iso)
                                    }
                                    setSelectedISO={setCountryCodeISO}
                                />

                                <TextInput
                                    ref={inputRef}
                                    placeholder='Phone Number'
                                    className={mergeClassNames(
                                        "flex-1 p-3 rounded-md h-16 tracking-wide text-xl font-base-semibold bg-light-secondary-100 dark:bg-dark-secondary-800",
                                        textColors
                                    )}
                                    placeholderTextColor={colors[colorMode].secondary[600]}
                                    keyboardType='phone-pad'
                                    maxLength={maxLength}
                                    value={formattedNumber}
                                    onChangeText={handlePhoneNumberChange}
                                    autoFocus
                                    textContentType='telephoneNumber'
                                />
                            </View>

                            {/* Send OTP Button */}
                            <Pressable
                                className='w-full rounded-md p-4 items-center mb-4 bg-light-primary-400 dark:bg-dark-primary-500 active:bg-light-primary-500 dark:active:bg-dark-primary-600'
                                onPress={() => handleSendOTP()}
                            >
                                <I18nText
                                    translationKey='button.sendOtp'
                                    className='text-white font-base-medium'
                                />
                            </Pressable>

                            {/* Create Account Link */}
                            <View className='flex-row mt-2'>
                                <Text className={mergeClassNames("mr-2", textColors)}>
                                    Don't have an account?
                                </Text>
                                <Pressable>
                                    <Text className='text-light-primary-400 dark:text-dark-primary-400 font-base-medium'>
                                        Create Account
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </KeyboardProvider>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default PhoneNumberScreen;
